var DelyciaConstants = require('./../delyciaConstants');

function FavoritesController($scope, $stateParams) {
	$scope.platilloId = $stateParams.platilloId;
	$scope.platilloIndex = $stateParams.platilloIndex;

	$scope.platillos = DelyciaConstants.PLATILLOS;
	$scope.currentPlatillo = $scope.platillos[$scope.platilloIndex];
}

module.exports = ['$scope', '$stateParams', FavoritesController];