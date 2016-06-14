var contentful = require('contentful'); 


function ContentfulService($rootScope, $sce, preloaderService){
	var self = this;
	var platos = [];

	self.dishes = [];
	self.mainDishes = [];
	self.total = 0;
	self.searchDishes = [];

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
							status: 'ABIERTO'});
				
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
							status: 'ABIERTO'});
				
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
							status: 'ABIERTO'});
				
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

	self.getDishJson = function(index)
	{
		var dish = self.dishes.items[index];
		var imgLink= 'http:' +dish.fields.foto.fields.file.url;
		return {id:index, src:$sce.getTrustedResourceUrl(imgLink), title:dish.fields.nombre, 
			restaurant:dish.fields.restaurante.fields.nombre, price:dish.fields.precio, 
			rating:1, distance: '5 kms', status: 'ABIERTO'};
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

module.exports = ['$rootScope', '$sce', 'PreloaderService', ContentfulService];