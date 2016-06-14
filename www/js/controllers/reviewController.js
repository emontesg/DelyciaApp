var DelyciaConstants = require('./../delyciaConstants');
function ReviewController($scope, $stateParams, contentfulService, RequestService) {
	$scope.platilloId = $stateParams.platilloId;
	$scope.realId = contentfulService.dishes.items[$scope.platilloId].sys.id;
	$scope.allReviews = [];
	$scope.user = localStorage.getItem('userLogged');
	$scope.hearts = [{id: 0, active: false},
					 {id: 1, active: false},
					 {id: 2, active: false},
					 {id: 3, active: false},
					 {id: 4, active: false}];
	$scope.heartCount = 0;

	$scope.onHeartClick = function(id){
		$scope.heartCount = id + 1;
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
	};

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

	$scope.getAllReviews = function(){
		RequestService.getAllReviews($scope.realId).then(function (response){
            $scope.allReviews = response.data;
            }, function (reject){
        });
    };
    $scope.getAllReviews();

    $scope.addReview = function(pcomentario){
    	var obj ={
    		idPlatillo : $scope.realId,
    		rating : $scope.heartCount,
    		comentario : pcomentario,
    		idUsuario : $scope.user,
    		visible : 0
    	};
    	$scope.allReviews.push(obj);
    	RequestService.addReview(obj);
    };

}

module.exports = ['$scope', '$stateParams', 'ContentfulService', 'RequestService', ReviewController];