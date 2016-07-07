var contentful = require('contentful'); 
var DelyciaConstants = require('../delyciaConstants');
var moment = require('moment');

function ContentfulService($rootScope, $sce, RequestService, preloaderService, $cordovaGeolocation){
	var self = this;
	var user = localStorage.getItem('idUser');
	self.dishes = [];
	self.mainDishes = [];
	
	var allReviews = [];
	self.promedioRating = 0;
	var ratingList = {};
	var distanceList = {};
	var userlocation = [];
	
	var pagesArray = [];
	var lastLoadedPageIndex = -1;
	self.currentViewedPageIndex = 0;

	self.searchDishes = [];
	var searchPagesCount = 0;

	moment().format();

	var client = contentful.createClient({
		// This is the space ID. A space is like a project folder in Contentful terms
		space: 'jeecg2rod0h5',
		// This is the access token for this space. Normally you get both ID and the token in the Contentful web app
		accessToken: 'e1e84ff039e7a97a5dd97ba4104682f57f10ca912016f42d000bf22cd4f0ceee'
	});

	function randomizePages()
	{
		client.getEntries({
			'content_type':'plato',
			'limit': 1
		})
		.then(function(entries){
			var total = entries.total;
			var pagesCount = Math.ceil(total / DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT);
			for(var i = 0; i < pagesCount; i++)
			{
				pagesArray.push(i);
			}
			pagesArray = shuffleArray(pagesArray);
			getPageItems(true, true);
		});
	}

	function getPageItems(isNext, isFirstLoad)
	{
		var skip = 0;
		if(isNext)
		{
			if(lastLoadedPageIndex < pagesArray.length-1)
			{
				lastLoadedPageIndex++;
				skip = (pagesArray[lastLoadedPageIndex]) * DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT;
			}
			else
				return;
		}
		else
		{
			if(lastLoadedPageIndex >= 0)
			{
				lastLoadedPageIndex--;
				skip = (pagesArray[lastLoadedPageIndex]) * DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT;
			}
			else
				return;
		}
		client.getEntries({
			'content_type':'plato',
			'limit': DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT,
			'skip': skip
		})
		.then(function(entries){
			var items = entries.items;
			var images = [];
			self.dishes = entries;
			for(var i = 0, l = items.length; i < l; i++)
			{	
				var imgLink= $sce.getTrustedResourceUrl('http:' +items[i].fields.foto.fields.file.url);

				self.mainDishes.push(self.getDishJson(self.mainDishes.length, items[i])); 
				images.push(imgLink);
			}

			var first = lastLoadedPageIndex * DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT;

			preloaderService.preloadImages(images).then(isFirstLoad ? finishFirstLoadCallback : finishLoadCallback ,
                function handleReject( imageLocation ) {
                    $rootScope.$broadcast('error');
                },
                function handleNotify( event ) {
                }
                
            );
		});
	}

	self.getContentfulItemById = function(id)
	{
		var entryId = self.mainDishes[id].idContentful;
		client.getEntries({
			'content_type':'plato',
			'sys.id': entryId
		})
		.then(function(entries){
			currentJson = self.getDishJson(id, entries.items[0]);
			$rootScope.$broadcast('getItemByIdReady', currentJson);
		});
	};

	self.getItemById = function(id)
	{
		return self.mainDishes[id];
	}

	self.getItemsByRestaurant = function(id)
	{ 
		client.getEntries({
			'content_type':'plato',
			'fields.restaurante.sys.id': id
		})
		.then(function(entries){
			self.searchDishes = [];
			var items = entries.items;
			for(var i = 0, l = items.length; i < l; i++)
			{
				var item = self.getDishJson(i, items[i]);
				self.searchDishes.push(item);
			}
			var photoCount = items[0].fields.restaurante.fields.fotos.length;
			var restaurantPhoto = '';
			if(photoCount > 1)
			{
				var index = Math.floor((Math.random() * photoCount) + 1);
				restaurantPhoto = $sce.getTrustedResourceUrl('http:' +items[0].fields.restaurante.fields.fotos[index-1].fields.file.url);
			}
			else
			{
				restaurantPhoto = $sce.getTrustedResourceUrl('http:' +items[0].fields.restaurante.fields.fotos[0].fields.file.url);
			}
			// var restaurantPhoto = $sce.getTrustedResourceUrl(items[0].fields.restaurante.fields.fotos.fields.file.url);
			$rootScope.$broadcast('getItemsByRestaurantReady', self.searchDishes, restaurantPhoto, items[0].fields.restaurante);
		});
	};

	function shuffleArray(array)
	{
		var arrayResult = [];
		for(var i = 0, l = array.length; i < l; i++)
		{
			if(i === l-1)
			{
				arrayResult.push(array[0]);
			}
			else
			{
				var random = Math.floor((Math.random() * (array.length-1)));
				arrayResult.push(array[random]);
				array.splice(random, 1);
			}
		}
		return arrayResult;
	}

	self.getNextPage = function(type)
	{
		if(type === 0 && self.currentViewedPageIndex === lastLoadedPageIndex)
		{
			getPageItems(true, false);
		}
		else if(self.currentViewedPageIndex === 1)
		{
			var first2 = (self.currentViewedPageIndex + 1) * DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT;
			var last2 = first2 + DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT;
			for(var j = first2; j < last2; j++)
			{
				if(type === 0)
				{
					if(last >= self.mainDishes.length)
						break;

					self.mainDishes[j].show = true;
				}
				else
				{
					if(last >= self.searchDishes.length)
						break;

					self.searchDishes[j].show = true;
				}
				
			}
		}
		else if(self.currentViewedPageIndex < (type === 0 ? lastLoadedPageIndex : self.searchDishes.length-1))
		{
			var first = (self.currentViewedPageIndex + 1) * DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT;
			var last = first + DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT;
			for(var i = first; i < last; i++)
			{
				if(type === 0)
				{
					if(last >= self.mainDishes.length)
						break;

					self.mainDishes[i].show = true;
				}
				else
				{
					if(last >= self.searchDishes.length)
						break;

					self.searchDishes[i].show = true;
				}
			}
		}
	};

	self.getPreviousPage = function(type)
	{
		if(self.currentViewedPageIndex > 0)
		{
			var first = (self.currentViewedPageIndex - 1) * DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT;
			var last = first + DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT;
			for(var i = first; i < last; i++)
			{
				if(type === 0)
				{
					if(last >= self.mainDishes.length)
						break;

					self.mainDishes[i].show = true;
				}
				else
				{
					if(last >= self.searchDishes.length)
						break;

					self.searchDishes[i].show = true;
				}
			}
		}
	};

	function hideItems(isNext, type)
	{
		archivePageArray = [];
		if(isNext)
		{
			if(self.currentViewedPageIndex < pagesArray.length-2)
			{
				var first = (self.currentViewedPageIndex + 2) * DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT;
				var last = first + DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT;
				for(var i = first; i < last; i++)
				{
					if(type === 0)
					{
						if(last >= self.mainDishes.length)
							break;

						self.mainDishes[i].show = false;
					}
					else
					{
						if(last >= self.searchDishes.length)
							break;

						self.searchDishes[i].show = false;
					}
				}
			}
		}
		else
		{
			var first2 = (self.currentViewedPageIndex - 2) * DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT;
			var last2 = first2 + DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT;
			for(var j = first2; j < last2; j++)
			{
				if(type === 0)
				{
					if(last >= self.mainDishes.length)
						break;

					self.mainDishes[j].show = false;
				}
				else
				{
					if(last >= self.searchDishes.length)
						break;

					self.searchDishes[j].show = false;
				}
			}
		}
	}

	self.hideNextPage = function(type)
	{
		hideItems(true, type);
	};

	self.hidePreviousPage = function(type)
	{
		hideItems(false, type);
	};

	self.getDishJson = function(index, dish){
		var id = dish.sys.id;
		var imgLink= 'http:' +dish.fields.foto.fields.file.url;
		var ratingValue = 0;
		if(ratingList[id] !== undefined){
			ratingValue = ratingList[id];
		}
		if(userlocation !== null)
		{
			var distance = Math.round(calculateDistance(userlocation.lat,userlocation.long,
				dish.fields.restaurante.fields.ubicacion.lat,
				dish.fields.restaurante.fields.ubicacion.lon));
			distanceList[id] = distance;
		}
		return {id:index, src:$sce.getTrustedResourceUrl(imgLink), title:dish.fields.nombre, 
			restaurant:dish.fields.restaurante.fields.nombre,
			restaurantId: dish.fields.restaurante.sys.id, price:dish.fields.precio, 
			rating: ratingValue, distance: userlocation == null ? 'N/A' : distanceList[id] + ' kms', 
			status: 'ABIERTO', lat: dish.fields.restaurante.fields.ubicacion.lat,
			lon: dish.fields.restaurante.fields.ubicacion.lon,
			idContentful:id, show: true};
	};

	self.hideSearchItems = function(index)
	{
		var length = self.searchDishes.length;
		var page = Math.floor(index / DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT);
		searchPagesCount = Math.ceil(length / DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT);
		var first = page * DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT;
		var last = page === (searchPagesCount-1) ? length : first + DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT;
		var lastPageCount = length % DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT;
		if(page > 0)
		{
			first = first - DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT;
		}
		if(page < searchPagesCount-1)
		{
			if(page < (searchPagesCount - 1) || lastPageCount === 0)
			{
				last = last + DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT;
			}
			else
			{
				last = last + lastPageCount;
			}
		}
		for(var i = 0; i < length; i++)
		{
			if(i < first || i > last)
			{
				self.searchDishes[i].show = false;
			}
		}
		self.currentViewedPageIndex = page;
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

	function finishFirstLoadCallback()
	{
		$rootScope.$broadcast('ready',self.mainDishes);
		getPageItems(true, false);
	}

	function finishLoadCallback()
	{

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

	self.updateRating = function(id, rating){
		if(self.mainDishes !== null){
			for(var i = 0; i < self.mainDishes.length; i++){
				if(id === self.mainDishes[i].idContentful){
					self.mainDishes[i].rating = rating;
					i = self.mainDishes.length;
				}
			}
		}

	};

	self.loadList = function(){
		RequestService.getAverageRatings().then(function (response){  
			if(response.data !== null){
				for(i = 0; i < response.data.length; i ++){
					ratingList[response.data[i].idPlato] = response.data[i].promedio;
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
		      	randomizePages();
		      	// getEntry();
			}, function(err) {
				userlocation = null;
				randomizePages();
		      	// getEntry();
		    });
	}


	return self;
}

module.exports = ['$rootScope', '$sce', 'RequestService', 'PreloaderService', '$cordovaGeolocation', ContentfulService];
