function RestaurantController($scope, $stateParams, contentfulService, $sce) {
	$scope.platilloIndex = $stateParams.platilloIndex;

	if(contentfulService.mainDishes.length !== 0)
	{
		$scope.currentPlatillo = contentfulService.mainDishes[$scope.platilloIndex];

		var dishes = contentfulService.dishes.items;

		$scope.restaurantDishes = [];

		var restaurantContentfulId = dishes[$scope.currentPlatillo.id].fields.restaurante.sys.id;

		for(var i = 0, l = dishes.length; i < l; i++)
		{
			if(dishes[i].fields.restaurante.sys.id === restaurantContentfulId)
			{
				var imgLink= 'http:' +dishes[i].fields.foto.fields.file.url;
				$scope.restaurantDishes.push({
					id: i,
					src: $sce.getTrustedResourceUrl(imgLink),
					title: dishes[i].fields.nombre,
					price:dishes[i].fields.precio, 
					rating:1, 
					distance: '5 kms', 
				});
			}
		}
	}
}

module.exports = ['$scope', '$stateParams', 'ContentfulService', '$sce', RestaurantController];