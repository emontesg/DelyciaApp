var contentful = require('contentful'); 


function ContentfulService($rootScope, $sce){
	var self = this;
	var platos = [];

	self.dishes = [];
	self.mainDishes = [];
	self.total = 0;
	self.searchDishes = [];

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
			var dishes = [];
			var index = 0;
			var items = entries.items;
			for(var i = 0, l = items.length; i < l; i++)
			{	

				//var imgLink= 'http:' +plato.fields.foto.fields.file.url;
				var abierto = false;
				var estado = 'cerrado';

				var dateAbierto = new Date(items[i].fields.restaurante.fields.horarioInicio);
				var dateCierre = new Date(items[i].fields.restaurante.fields.horarioFinal);
				
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
				var imgLink= 'http:' +items[i].fields.foto.fields.file.url;

				dishes.push({id:index++, 
							src:$sce.getTrustedResourceUrl(imgLink), 
							title:items[i].fields.nombre, 
							restaurant:items[i].fields.restaurante.fields.nombre, 
							price:items[i].fields.precio, 
							rating:1, 
							distance: '5 kms', 
							status: estado});
			}

			self.dishes = entries;
			self.mainDishes = dishes;
			self.total = entries.total;

			$rootScope.$broadcast('ready',dishes);
		});

	self.getDishJson = function(index)
	{
		var dish = self.dishes.items[index];
		var imgLink= 'http:' +dish.fields.foto.fields.file.url;
		return {id:index, src:$sce.getTrustedResourceUrl(imgLink), title:dish.fields.nombre, 
			restaurant:dish.fields.restaurante.fields.nombre, price:dish.fields.precio, 
			rating:1, distance: '5 kms', status: 'ABIERTO'};
	}

	return self;
}

module.exports = ['$rootScope', '$sce',ContentfulService];