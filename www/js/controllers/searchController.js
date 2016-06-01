function SearchController($scope, $stateParams, contentfulService) {
	$scope.platilloIndex = $stateParams.platilloIndex;

	if(contentfulService.mainDishes.length === 0)
	{
		$scope.platillos = [];
		$scope.currentPlatillo = {id:'0', src:'', title:'', restaurant:'', price:0, rating:0, distance: '', status: ''};

	}
	else
	{
		$scope.platillos = contentfulService.mainDishes;
		$scope.currentPlatillo = $scope.platillos[$scope.platilloIndex];
	}
	

	$scope.$on('ready',function(data,items){
		$scope.platillos = items;
		$scope.currentPlatillo = $scope.platillos[$scope.platilloIndex];
	});

	$scope.searchType = [
		{
			type: 'Comida',
			options: ['Carne', 'Pastas', 'Postres', 'Ensaladas', 'Hamburguesas', 'Sopas', 
					  'Sushi', 'Cocteles', 'Alitas', 'Pollo', 'Cremas', 'Tacos'],
			enable: false
		},
		{
			type: 'Ocasión',
			options: ['Ocasion 1', 'Ocasion 2', 'Ocasion 3'],
			enable: false
		},
		{
			type: 'Distancia',
			options: ['Distancia 1', 'Distancia 2', 'Distancia 3'],
			enable: false
		},
		{
			type: 'Precio',
			options: ['Precio 1', 'Precio 2', 'Precio 3'],
			enable: false
		}
	];

	$scope.onTypeClick = function(typeIndex)
	{
		for(var i = 0, length = $scope.searchType.length; i < length; i++)
		{
			if(i === typeIndex)
			{
				$scope.searchType[i].enable = !$scope.searchType[i].enable;
			}
			else
			{
				$scope.searchType[i].enable = false;
			}
		}
	};
}

module.exports = ['$scope', '$stateParams', 'ContentfulService', SearchController];