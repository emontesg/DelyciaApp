function ReviewController($scope, $stateParams, contentfulService) {
	$scope.platilloId = $stateParams.platilloId;

	$scope.hearts = [{id: 0, active: false},
					 {id: 1, active: false},
					 {id: 2, active: false},
					 {id: 3, active: false},
					 {id: 4, active: false}];

	$scope.onHeartClick = function(id)
	{
		for(var i = 0, l = $scope.hearts.length; i < l; i++)
		{
			if(i <= id)
			{
				$scope.hearts[i].active = true;
			}
			else
			{
				$scope.hearts[i].active = false;
			}
		}
	}

	// if(contentfulService.mainDishes.length === 0)
	// {
	// 	$scope.currentPlatillo = {id:'0', src:'', title:'', restaurant:'', price:0, rating:0, distance: '', status: ''};

	// }
	// else
	// {
	// 	$scope.currentPlatillo = contentfulService.getDishJson($scope.platilloId);
	// }
	

	// $scope.$on('ready',function(data,items){
	// 	$scope.currentPlatillo = contentfulService.getDishJson($scope.platilloId);
	// });
}

module.exports = ['$scope', '$stateParams', 'ContentfulService', ReviewController];