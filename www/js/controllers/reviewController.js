var DelyciaConstants = require('./../delyciaConstants');
function ReviewController($scope, $stateParams, contentfulService, RequestService, $rootScope) {
	$scope.platilloId = $stateParams.platilloId;
    $scope.islogged = window.localStorage.getItem("idUser") !== null;
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

	$scope.getAllReviews = function(){
		RequestService.getAllReviews($scope.realId).then(function (response){
            $scope.allReviews = response.data;
             $scope.calculateAverageRating()
            }, function (reject){
        });
    };
    $scope.getAllReviews();

    $scope.addReview = function(pcomentario){
        $scope.allReviews = [];
    	var obj ={
    		idPlatillo : $scope.realId,
    		rating : $scope.heartCount,
    		comentario : pcomentario,
    		idUsuario : $scope.user,
    		visible : 0
    	};
        if(obj !== null){
            $scope.allReviews.push(obj);
            RequestService.addReview(obj);
        }
    };

    $scope.calculateAverageRating = function(){
    	if($scope.allReviews !== null){
    		var suma = 0;
    		var promedio = 0;
    		var cant = $scope.allReviews.length;
    		var num = 0;

    		for(var i = 0; i < $scope.allReviews.length; i++){
    			num = parseInt($scope.allReviews[i].rating);
    			suma = suma + num;
    		}
    		promedio = Math.round(suma / cant);
    	}
    	return promedio;
    };

}

module.exports = ['$scope', '$stateParams', 'ContentfulService', 'RequestService', '$rootScope', ReviewController];