var contentful = require('contentful'); 

function ContentfulService($rootScope, $sce, RequestService, $ImageCacheFactory){
	var self = this;
	var platos = [];
	var user = localStorage.getItem('userLogged');
	self.dishes = [];
	self.mainDishes = [];
	self.total = 0;
	self.userFavorites = [];

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
			for(var i = 0, l = items.length; i < l; i++)
			{	

				var imgLink= $sce.getTrustedResourceUrl('http:' +items[i].fields.foto.fields.file.url);

				dishes.push({id:index++, 
							src:imgLink, 
							title:items[i].fields.nombre, 
							restaurant:items[i].fields.restaurante.fields.nombre, 
							price:items[i].fields.precio, 
							rating:1, 
							distance: '5 kms', 
							status: getState(items[i])
						});

				// images.push(imgLink);
			}

			// $ImageCacheFactory.Cache(images);

			self.dishes = entries;
			self.mainDishes = dishes;
			self.total = entries.total;

			$rootScope.$broadcast('ready',dishes);
			self.getAllFavorites();
		});

	self.getDishJson = function(index)
	{
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
            							if(favoritesList[i].idPlato === self.userFavorites[x].sys.id){
            								exist = true;
            								x = self.userFavorites.length;
            							}
            						}
            						if(exist === false){
            							self.userFavorites.push(self.dishes.items[j]);
            						}
            					}else{
            						self.userFavorites.push(self.dishes.items[j]);
            					}
             				}
            			}
            		}
            	}
            }, function (reject){
        });
    };

	return self;
}

module.exports = ['$rootScope', '$sce', 'RequestService', '$ImageCacheFactory', ContentfulService];
