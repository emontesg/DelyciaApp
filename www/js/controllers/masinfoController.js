function MasinfoController($scope, $stateParams, contentfulService,RequestService) {
	$scope.platilloId = $stateParams.platilloId;

	$scope.islogged = window.localStorage.getItem("idUser") !== null;

	if(contentfulService.mainDishes.length === 0)
	{
		$scope.currentPlatillo = {id:'0', src:'', title:'', restaurant:'', price:0, rating:0, distance: '', status: ''};

	}
	else
	{
		$scope.currentPlatillo = contentfulService.getDishJson($scope.platilloId);
	}
	

	$scope.$on('ready',function(data,items){
		$scope.currentPlatillo = contentfulService.getDishJson($scope.platilloId);
	});

}

module.exports = ['$scope', '$stateParams', 'ContentfulService', 'RequestService', MasinfoController];