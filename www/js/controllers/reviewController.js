var DelyciaConstants = require('./../delyciaConstants');

function ReviewController($scope, $stateParams, contentfulService, RequestService, $rootScope) {
	$scope.platilloId = $stateParams.platilloId;
    $scope.islogged = window.localStorage.getItem("idUser") !== null;
    $scope.isMac = window.localStorage.getItem("isMac");
	$scope.realId = contentfulService.dishes.items[$scope.platilloId].sys.id;
	$scope.allReviews = [];
	$scope.user = localStorage.getItem('userLogged');
	$scope.hearts = [{id: 0, active: false},
					 {id: 1, active: false},
					 {id: 2, active: false},
					 {id: 3, active: false},
					 {id: 4, active: false}];
	$scope.heartCount = 0;

	$scope.testReviews = [{name: 'Valeria Ramirez', comment: 'Estaba deli, vivi Sarchitouille, me encantó. Volvería siempre!', date: '14 junio, 2016', rating: 5},
						{name: 'Yi Huang', comment: 'No son como los que hacen en Taiwan, pero bueno, se la juegan', date: '9 junio, 2016', rating: 3},
						{name: 'Esteban Montes', comment: 'Si a Yi no le gustan, que nos invite a unos taiwanes. Estos son solo good.', date: '9 junio, 2016', rating: 4},
						{name: 'Jimmi Vila', comment: 'Viva Peru. Tomen brasileiros pura tuza! Viva Wendy Sulca!', date: '9 junio, 2016', rating: 5}];

	$scope.testRating = 4.9;
	$scope.ratingRound = Math.round($scope.testRating);

	$scope.makeRating = false;

	$scope.onHeartClick = function(id)
	{
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

	$scope.getHeartClass = function(index, rating)
	{
		if(index < rating)
		{
			return 'ion-heart active';
		}
		else
		{
			return 'ion-heart inactive';
		}
	};

	$scope.getReviewColor = function(index)
	{
		var lastDigit = (index+1) % 10;
		switch (lastDigit)
		{
			case 1:
			case 6:
				return 'decoration1';
			case 2:
			case 7:
				return 'decoration2';
			case 3:
			case 8:
				return 'decoration3';
			case 4:
			case 9:
				return 'decoration4';
			case 5:
			case 0:
				return 'decoration5';
		}
	};

	$scope.onTastedButtonClick = function()
	{
		if(!$scope.makeRating)
		{
			$scope.makeRating = true;
		}
	};

	$scope.onReturnButtonClick = function()
	{
		$scope.makeRating = false;
	};

	$scope.onSubmitButtonClick = function()
	{
		$scope.makeRating = false;
	};


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

module.exports = ['$scope', '$stateParams', 'ContentfulService', 'RequestService', '$rootScope', ReviewController];