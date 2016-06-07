var contentful = require('contentful'); 


function ContentfulService($rootScope, $sce, RequestService){
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
			for(var i = 0, l = items.length; i < l; i++)
			{	
				var imgLink= 'http:' +items[i].fields.foto.fields.file.url;

				dishes.push({id:index++, 
							src:$sce.getTrustedResourceUrl(imgLink), 
							title:items[i].fields.nombre, 
							restaurant:items[i].fields.restaurante.fields.nombre, 
							price:items[i].fields.precio, 
							rating:1, 
							distance: '5 kms', 
							status: 'ABIERTO'})
			}

			self.dishes = platos;
			self.mainDishes = dishes;
			self.total = entries.total;

			$rootScope.$broadcast('ready',dishes);
			self.getAllFavorites();
		});

	self.getPlatos = function(){
		
		return platos;
	};

	self.getAllFavorites = function(){
		var exist = false;
		RequestService.getAllFavorites(user).then(function (response){
            var favoritesList = response.data;
            	if(favoritesList != null){
            		for (var i = 0; i< favoritesList.length; i++){
            			for(var j = 0; j < self.dishes.items.length; j++){
            				if(favoritesList[i].idPlatillo === self.dishes.items[j].sys.id){
            					if(self.userFavorites != null){
            						for (var x = 0; x < self.userFavorites.length; x++) {
            							if(favoritesList[i].idPlatillo === self.userFavorites[x].sys.id){
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

module.exports = ['$rootScope', '$sce', 'RequestService',ContentfulService];