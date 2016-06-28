function MasinfoController($scope, $stateParams, contentfulService) {
	$scope.platilloId = $stateParams.platilloId;

	if(contentfulService.mainDishes.length === 0)
	{
		$scope.currentPlatillo = {id:'0', src:'', title:'', restaurant:'', price:0, rating:0, distance: '', status: ''};

	}
	else
	{
		$scope.currentPlatillo = contentfulService.getDishJson($scope.platilloId);

		if(ionic.Platform.isIOS())
		{
			$scope.mapUrl = 'maps://?q='+$scope.currentPlatillo.lat+', '+$scope.currentPlatillo.lon;
		}
		else
		{
			$scope.mapUrl = 'geo://0,0?q='+$scope.currentPlatillo.lat+', '+$scope.currentPlatillo.lon;
		}
	}
	

	$scope.$on('ready',function(data,items){
		$scope.currentPlatillo = contentfulService.getDishJson($scope.platilloId);

		if(ionic.Platform.isIOS())
		{
			$scope.mapUrl = 'maps://?q='+$scope.currentPlatillo.lat+', '+$scope.currentPlatillo.lon;
		}
		else
		{
			$scope.mapUrl = 'geo://0,0?q='+$scope.currentPlatillo.lat+', '+$scope.currentPlatillo.lon;
		}
	});
	
}

module.exports = ['$scope', '$stateParams', 'ContentfulService', MasinfoController];