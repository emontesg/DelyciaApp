var DelyciaConstants = require('./../delyciaConstants');

function FavoritesController($scope, $stateParams) {
	$scope.platilloId = $stateParams.platilloId;

	$scope.platillos = DelyciaConstants.PLATILLOS;
	$scope.currentPlatillo = $scope.platillos[$scope.platilloId];
}

module.exports = ['$scope', '$stateParams', FavoritesController];