var DelyciaConstants = require('./../delyciaConstants');

function RestaurantController($scope, $stateParams) {
	$scope.restaurantId = $stateParams.restaurantId;
	$scope.platilloIndex = $stateParams.platilloIndex;

	$scope.platillos = DelyciaConstants.PLATILLOS;
	$scope.currentPlatillo = $scope.platillos[$scope.platilloIndex];
}

module.exports = ['$scope', '$stateParams', RestaurantController];