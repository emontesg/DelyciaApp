var contentful = require('contentful'); 

function ContentfulService($rootScope, $sce, RequestService, preloaderService, $cordovaGeolocation){
	var self = this;
	var platos = [];
	var user = localStorage.getItem('idUser');
	self.dishes = [];
	self.mainDishes = [];
	self.total = 0;
	var allReviews = [];
	var waitingLoadDishes = [];
	var waitingLoadImages = [];
	self.promedioRating = 0;
	var ratingList = {};
	var distanceList = {};
	var userlocation = [];
	var moment = require('moment');
	moment().format();

	var client = contentful.createClient({
		// This is the space ID. A space is like a project folder in Contentful terms
		space: 'jeecg2rod0h5',
		// This is the access token for this space. Normally you get both ID and the token in the Contentful web app
		accessToken: 'e1e84ff039e7a97a5dd97ba4104682f57f10ca912016f42d000bf22cd4f0ceee'
	});
	//640*1136
	function getEntry(){
			client.getEntries({
			'content_type':'plato'
		})
		.then(function(entries){
			self.dishes = entries;
			platos = entries;
			var dishes = [];
			var index = 0;
			var items = entries.items;
			var images = [];

			var waitingDishesGroup = [];
			var waitingImagesGroup = [];
			var count = 0;
			for(var i = 0, l = items.length; i < l; i++)
			{	
				var imgLink= $sce.getTrustedResourceUrl('http:' +items[i].fields.foto.fields.file.url);

				if(userlocation !== null)
				{
					var distance = Math.round(calculateDistance(userlocation.lat,userlocation.long,items[i].fields.restaurante.fields.ubicacion.lat,items[i].fields.restaurante.fields.ubicacion.lon));
					distanceList[i] = distance;
				}

				if(i < 4)
				{
					self.mainDishes.push(self.getDishJson(i)); 
					images.push(imgLink);
				}
				else if(count < 4 && i !== l-1)
				{
					waitingDishesGroup.push(self.getDishJson(i));
					waitingImagesGroup.push(imgLink);
					count++;
				}
				else
				{
					waitingDishesGroup.push(self.getDishJson(i));
					waitingImagesGroup.push(imgLink);
					waitingLoadImages.push(waitingImagesGroup);
					waitingLoadDishes.push(waitingDishesGroup);
					waitingDishesGroup = [];
					waitingImagesGroup = [];
					count = 0;
				}
			}

					self.dishes = entries;
					self.total = entries.total;
				

			// $ImageCacheFactory.Cache(images);
			preloaderService.preloadImages(images).then(firstLoadResolve,
                    function handleReject( imageLocation ) {
                        // Loading failed on at least one image.
                        // console.error( "Image Failed", imageLocation );
                        // console.info( "Preload Failure" );
                        $rootScope.$broadcast('error');
                    },
                    function handleNotify( event ) {
                        // $scope.percentLoaded = event.percent;
                        // console.info( "Percent loaded:", event.percent );
                        }
                    
                );
		});
	};	

	self.getDishJson = function(index){
		var dish = self.dishes.items[index];
		var imgLink= 'http:' +dish.fields.foto.fields.file.url;
		var ratingValue = 0;
		var cantReviews = 0;

		if(ratingList[dish.sys.id] != undefined){
			ratingValue = ratingList[dish.sys.id].promedio;
			cantReviews = ratingList[dish.sys.id].cantReviews;
		}
		return {id:index, src:$sce.getTrustedResourceUrl(imgLink), title:dish.fields.nombre, 
			restaurant:dish.fields.restaurante.fields.nombre, price:dish.fields.precio, 
			rating: ratingValue, distance: userlocation == null ? 'N/A' : distanceList[index] + ' kms', 
			status: 'ABIERTO', lat: dish.fields.restaurante.fields.ubicacion.lat,
			lon: dish.fields.restaurante.fields.ubicacion.lon,
			idContentful:dish.sys.id,
			cantReviews : cantReviews
		};
	};

	function getState(item){
		//var imgLink= 'http:' +plato.fields.foto.fields.file.url;
		//console.log(item)

		var abierto = false;
		var estado = 'cerrado';

		restaurantSchedule = getSchedule(item);

		var dateAbierto = new Date(restaurantSchedule.horarioInicio);
		var dateCierre = new Date(restaurantSchedule.horarioFinal);
		
		var horaAbierto = dateAbierto.getHours();
		var horaCierre = dateCierre.getHours();				

		var minAbierto = dateAbierto.getMinutes();
		var minCierre = dateCierre.getMinutes();
		
		var horaActual = new Date().getHours();

		if(horaActual>= horaAbierto && horaActual<=horaCierre){
				abierto = true;

		 		if(horaActual == horaAbierto){
			  		if(new Date().getMinutes() <= minAbierto){
			  			abierto = false;
			  		}
		  		}

		  		if(horaActual == horaCierre){
			  		if(new Date().getMinutes() >= minCierre){
			  			abierto = false;
			  		}							
			  	}
		}
		if(abierto){
			estado = 'abierto';
		}

		return estado;

	}

	function getSchedule(item){
		var actualDay = new Date().getDay();
		var restaurantSchedule = {};

		switch(actualDay){
			case 0:
				restaurantSchedule.horarioInicio = item.fields.restaurante.fields.horarioInicioDomingo;
				restaurantSchedule.horarioFinal = item.fields.restaurante.fields.horarioFinalDomingo;
			break;
			case 1:
				restaurantSchedule.horarioInicio = item.fields.restaurante.fields.horarioInicioLunes;
				restaurantSchedule.horarioFinal = item.fields.restaurante.fields.horarioFinalLunes;
			break;
			case 2:
				restaurantSchedule.horarioInicio = item.fields.restaurante.fields.horarioInicioMartes;
				restaurantSchedule.horarioFinal = item.fields.restaurante.fields.horarioFinalMartes;
			break;
			case 3:
				restaurantSchedule.horarioInicio = item.fields.restaurante.fields.horarioInicioMiercoles;
				restaurantSchedule.horarioFinal = item.fields.restaurante.fields.horarioFinalMiercoles;
			break;
			case 4:
				restaurantSchedule.horarioInicio = item.fields.restaurante.fields.horarioInicioJueves;
				restaurantSchedule.horarioFinal = item.fields.restaurante.fields.horarioFinalJueves;
			break;
			case 5:
				restaurantSchedule.horarioInicio = item.fields.restaurante.fields.horarioInicioViernes;
				restaurantSchedule.horarioFinal = item.fields.restaurante.fields.horarioFinalViernes;
			break;
			case 6:
				restaurantSchedule.horarioInicio = item.fields.restaurante.fields.horarioInicioSabado;
				restaurantSchedule.horarioFinal = item.fields.restaurante.fields.horarioFinalSabado;
			break;
		}

		return restaurantSchedule;
		
	}

	function firstLoadResolve(imageLocations)
	{
        console.info( "Preload Successful" );
        $rootScope.$broadcast('ready',self.mainDishes);
        loadMoreImages();
	}

	function loadMoreImages()
	{
		if(waitingLoadImages.length > 0)
		{
			preloaderService.preloadImages(waitingLoadImages[0]).then(loadResolve,
                    function handleReject( imageLocation ) {
                        console.error( "Image Failed", imageLocation );
                    },
                    function handleNotify( event ) {
                    }
                );
		}
	}

	function loadResolve(imageLocations)
	{
		var dishes = waitingLoadDishes[0];
		for(var i = 0, l = dishes.length; i < l; i++)
		{
			self.mainDishes.push(dishes[i]);
		}
		waitingLoadDishes.splice(0, 1);
		waitingLoadImages.splice(0, 1);
		loadMoreImages();
	}

	self.updateRating = function(id, rating,cantReviews){
		if(self.mainDishes !== null){
			for(var i = 0; i < self.mainDishes.length; i++){
				if(id === self.mainDishes[i].idContentful){
					self.mainDishes[i].rating = rating;
					self.mainDishes[i].cantReviews = cantReviews;
					i = self.mainDishes.length;
				}
			}
		}

	}

	self.loadList = function(){
		RequestService.getAverageRatings().then(function (response){  
			if(response.data !== null){
				for(i = 0; i < response.data.length; i ++){
					ratingList[response.data[i].idPlato] = {
					promedio: response.data[i].promedio, 
					cantReviews: response.data[i].cantReviews};
				}
			}  
			getCurrentPosition();    

		}, function (reject){
			getCurrentPosition(); 
        });
	};
	
	self.loadList();

	function calculateDistance(lat1, lon1, lat2, lon2) {
	  var R = 6371; // km
	  var dLat = (lat2 - lat1).toRad();
	  var dLon = (lon2 - lon1).toRad(); 
	  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
	          Math.sin(dLon / 2) * Math.sin(dLon / 2); 
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
	  var d = R * c;
	  return d;
	}

	Number.prototype.toRad = function() {
	  return this * Math.PI / 180;
	}

	function getCurrentPosition()
	{
		var posOptions = {timeout: 10000, enableHighAccuracy: false};

		$cordovaGeolocation
		    .getCurrentPosition(posOptions)
		    .then(function (position) {
		      	userlocation.lat = position.coords.latitude;
		      	userlocation.long = position.coords.longitude;
		      	getEntry();
			}, function(err) {
				userlocation = null;
		      	getEntry();
		    });
	}


	return self;
}

module.exports = ['$rootScope', '$sce', 'RequestService', 'PreloaderService', '$cordovaGeolocation', ContentfulService];
