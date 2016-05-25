function MasinfoController($scope, $stateParams) {
	$scope.platilloId = $stateParams.platilloId;
	$scope.platilloIndex = $stateParams.platilloIndex;

	
}

module.exports = ['$scope', '$stateParams', MasinfoController];