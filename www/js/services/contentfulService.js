var contentful = require('contentful'); 

function ContentfulService($rootScope, $sce, RequestService, preloaderService){
	var self = this;
	var platos = [];
	var user = localStorage.getItem('idUser');
	self.dishes = [];
	self.mainDishes = [];
	self.total = 0;
	self.userFavorites = [];

	var waitingLoadDishes = [];
	var waitingLoadImages = [];

	var client = contentful.createClient({
		// This is the space ID. A space is like a project folder in Contentful terms
		space: 'jeecg2rod0h5',
		// This is the access token for this space. Normally you get both ID and the token in the Contentful web app
		accessToken: 'e1e84ff039e7a97a5dd97ba4104682f57f10ca912016f42d000bf22cd4f0ceee'
	});
	//640*1136

	client.getEntries({
			'content_type':'plato'
		})
		.then(function(entries){
			//console.log(entries);
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

				if(i < 4)
				{
					self.mainDishes.push({id:index++, 
							src:imgLink, 
							title:items[i].fields.nombre, 
							restaurant:items[i].fields.restaurante.fields.nombre, 
							price:items[i].fields.precio, 
							rating:1, 
							distance: '5 kms', 
							status: getState(items[i]),
							idContentful:items[i].sys.id
						}); 

					images.push(imgLink);
				}
				else if(count < 4 && i !== l-1)
				{
					waitingDishesGroup.push({id:index++, 
							src:imgLink, 
							title:items[i].fields.nombre, 
							restaurant:items[i].fields.restaurante.fields.nombre, 
							price:items[i].fields.precio, 
							rating:1, 
							distance: '5 kms', 
							status: getState(items[i]),
							idContentful:items[i].sys.id});
				
					waitingImagesGroup.push(imgLink);
					count++;
				}
				else
				{
					waitingDishesGroup.push({id:index++, 
							src:imgLink, 
							title:items[i].fields.nombre, 
							restaurant:items[i].fields.restaurante.fields.nombre, 
							price:items[i].fields.precio, 
							rating:1, 
							distance: '5 kms', 
							status: getState(items[i]),
							idContentful:items[i].sys.id});
				
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
			// self.getAllFavorites();

			// $ImageCacheFactory.Cache(images);
			preloaderService.preloadImages(images).then(firstLoadResolve,
                    function handleReject( imageLocation ) {
                        // Loading failed on at least one image.
                        console.error( "Image Failed", imageLocation );
                        console.info( "Preload Failure" );
                        $rootScope.$broadcast('error');
                    },
                    function handleNotify( event ) {
                        // $scope.percentLoaded = event.percent;
                        console.info( "Percent loaded:", event.percent );
                    }
                );
		});

	self.getDishJson = function(index){
		var dish = self.dishes.items[index];
		var imgLink= 'http:' +dish.fields.foto.fields.file.url;
		return {id:index, src:$sce.getTrustedResourceUrl(imgLink), title:dish.fields.nombre, 
			restaurant:dish.fields.restaurante.fields.nombre, price:dish.fields.precio, 
			rating:1, distance: '5 kms', status: 'ABIERTO'};
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

	self.getAllFavorites = function(){
		var exist = false;

		RequestService.getAllFavorites(user).then(function (response){
            var favoritesList = response.data;
            	if(favoritesList !== null){
            		for (var i = 0; i< favoritesList.length; i++){
            			for(var j = 0; j < self.dishes.items.length; j++){
            				if(favoritesList[i].idPlato === self.dishes.items[j].sys.id){
            				
            					if(self.userFavorites !== null){
            				
            						for (var x = 0; x < self.userFavorites.length; x++) {
            						
            							if(favoritesList[i].idPlato === self.userFavorites[x].idContentful){
            								exist = true;
            								x = self.userFavorites.length;
            							}
            			
            						}
            						if(exist === false){
            							self.userFavorites.push(self.mainDishes[j]);
            						}
            					}else{
            						self.userFavorites.push(self.mainDishes[j]);
            					}
             				}
            			}
            		}
            	}
            }, function (reject){
        });
    };

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

	return self;
}

module.exports = ['$rootScope', '$sce', 'RequestService', 'PreloaderService', ContentfulService];
