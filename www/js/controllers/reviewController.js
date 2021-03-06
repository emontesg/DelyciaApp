var DelyciaConstants = require('./../delyciaConstants');

function ReviewController($scope, $stateParams, contentfulService, RequestService, $rootScope, $cordovaToast) {
	$scope.platilloId = $stateParams.platilloId;
    $scope.islogged = window.localStorage.getItem("idUser") !== null;
    $scope.isMac = window.localStorage.getItem("isMac");
    $scope.type = $stateParams.type;
	$scope.allReviews = [];
	$rootScope.promedio = 0;
	$scope.numPromedio = 0;
	$scope.cantReviews = 0;
	$scope.userReview = [];
	$scope.comentario = "";
	var moment = require('moment');
	moment().format();
	$scope.user = window.localStorage.getItem('idUser');
	$scope.isHearted = true;


	if(contentfulService.mainDishes.length === 0)
	{
		$scope.currentPlatillo = {id:'0', src:'', title:'', restaurant:'', price:0, rating:0, distance: '', status: ''};

	}
	else
	{
		if($scope.type === '0')
		{
			$scope.currentPlatillo = contentfulService.mainDishes[$scope.platilloId];
		}
		else
		{
			$scope.currentPlatillo = contentfulService.searchDishes[$scope.platilloId];
		}
		$scope.realId = $scope.currentPlatillo.idContentful;
	}
	

	$scope.$on('ready',function(data,items){
		if($scope.type === '0')
		{
			$scope.currentPlatillo = contentfulService.mainDishes[$scope.platilloId];
		}
		else
		{
			$scope.currentPlatillo = contentfulService.searchDishes[$scope.platilloId];
		}
		$scope.realId = $scope.currentPlatillo.idContentful;
	});

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
	
		$scope.isHearted = false;

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

		$scope.allReviews = [];
		RequestService.getAllReviews($scope.realId).then(function (response){
			if( response.data !== null){
            	for(var i = 0; i < response.data.length; i++){
            		var date = response.data[i].fecha;
            		response.data[i].fecha = $scope.getRealDate(date);
            		$scope.allReviews.push(response.data[i]);
            	}
				$scope.calculateAverageRating();
				$rootScope.promedio = $scope.calculateAverageRating(); 
				var ratingObj = {
					idPlatillo : $scope.realId,
					promedio : $rootScope.promedio,
					cantReviews: $scope.cantReviews
				};
				RequestService.addAverageRating(ratingObj);
				$scope.getCantReviews(); 
			}
			
            }, function (reject){
        });
    };
    $scope.getAllReviews();

    $scope.getCantReviews = function(){
		RequestService.getCantReviews($scope.realId).then(function (response){
			$scope.cantReviews = response.data;
			contentfulService.updateRating($scope.realId,$rootScope.promedio, $scope.cantReviews);
            }, function (reject){
        });
    };
 	$scope.getCantReviews();
    
    $scope.addReview = function(pcomentario){
    	var obj ={
    		idPlatillo : $scope.realId,
    		rating : $scope.heartCount,
    		comentario : pcomentario,
    		idUsuario : $scope.user,
    		visible : 0
    	};
         if(obj !== null){
           	RequestService.addReview(obj).then(function (response){
				$scope.getAllReviews();
				$scope.getCantReviews();
            }, function (reject){
        });
		$scope.getCantReviews();
         }
    };

    $scope.calculateAverageRating = function(){
    	if($scope.allReviews !== null){
    		var suma = 0;
    		var promedio = 0;
    		var cant = $scope.allReviews.length;
    		var num = 0;
    		var notRounded = 0;

    		for(var i = 0; i < $scope.allReviews.length; i++){
    			num = parseInt($scope.allReviews[i].rating);
    			suma = suma + num;
    		}
    		notRounded = suma / cant;
    		promedio = Math.floor(notRounded);
    		$scope.numPromedio = notRounded.toFixed(1);
    	}
    	return promedio;
    };

    $scope.getUserRating = function(){
    	var obj = {
    		idPlatillo : $scope.realId,
    		idUsuario: $scope.user
    	};

    	RequestService.getUserReview(obj).then(function (response){
    		if(response.data !== null){
    			$scope.userReview = response.data;
    			$scope.comentario =  $scope.userReview[0].comentario;
    			$scope.onHeartClick($scope.userReview[0].rating -1);
    		}
            }, function (reject){
        });
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
			if($scope.islogged)
			{
				$scope.makeRating = true;
				$scope.getUserRating();
			}
			else
			{
				$cordovaToast
		      .show('Por favor iniciar sesión primero', 'long', 'bottom')
		      .then(function(success) {
		        // success
		      }, function (error) {
		        // error
		      });
			}
		}
	};

	$scope.onReturnButtonClick = function()
	{
		$scope.makeRating = false;
	};

	$scope.onSubmitButtonClick = function(comentario)
	{
		$scope.makeRating = false;
		$scope.addReview(comentario);
	};

	$scope.getRealDate = function (pfecha){
		moment.updateLocale('en', {
    		months : [
        			"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
        			"Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    			]
		});
		return moment(pfecha).format('LL');
	};

}

module.exports = ['$scope', '$stateParams', 'ContentfulService', 'RequestService', '$rootScope', '$cordovaToast', ReviewController];