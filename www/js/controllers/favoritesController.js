var DelyciaConstants = require('./../delyciaConstants');

function FavoritesController($scope, $stateParams) {
	$scope.platilloId = $stateParams.platilloId;

	$scope.platillos = DelyciaConstants.PLATILLOS;
	$scope.currentPlatillo = $scope.platillos[$scope.platilloId];

	var options = {
    date: new Date(),
    mode: 'datetime'
	};

	function onSuccess(date) {
	    alert('Selected date: ' + date);
	}

	function onError(error) { // Android only
	    alert('Error: ' + error);
	}

	$scope.showDatePicker = function()
	{
		options.date = new Date();
		datePicker.show(options, onSuccess, onError);
	}
}

module.exports = ['$scope', '$stateParams', FavoritesController];