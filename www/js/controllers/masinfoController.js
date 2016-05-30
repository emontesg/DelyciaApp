function MasinfoController($scope, $stateParams, contentfulService) {
	$scope.platilloId = $stateParams.platilloId;
	$scope.platilloIndex = $stateParams.platilloIndex;

	if(contentfulService.dishes.length === 0)
	{
		$scope.platillos = [];
		$scope.currentPlatillo = {id:'0', src:'', title:'', restaurant:'', price:0, rating:0, distance: '', status: ''};

	}
	else
	{
		$scope.platillos = contentfulService.dishes;
		$scope.currentPlatillo = $scope.platillos[$scope.platilloIndex];
	}
	

	$scope.$on('ready',function(data,items){
		$scope.platillos = items;
		$scope.currentPlatillo = $scope.platillos[$scope.platilloIndex];
	});
}

module.exports = ['$scope', '$stateParams', 'ContentfulService', MasinfoController];