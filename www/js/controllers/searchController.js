var DelyciaConstants = require('./../delyciaConstants');

function SearchController($scope, $stateParams) {
	$scope.platilloIndex = $stateParams.platilloIndex;

	$scope.platillos = DelyciaConstants.PLATILLOS;
	$scope.currentPlatillo = $scope.platillos[$scope.platilloIndex];

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

module.exports = ['$scope', '$stateParams', SearchController];