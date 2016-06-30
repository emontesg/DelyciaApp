var DelyciaConstants = require('./../delyciaConstants');

function FavoritesController($scope, $stateParams, RequestService, ContentfulService, $rootScope, NotificationService) {

	$scope.platilloId = $stateParams.platilloId;
	$scope.platillos = DelyciaConstants.PLATILLOS;
	$scope.currentPlatillo = $scope.platillos[$scope.platilloIndex];
	$scope.realId = 0;
	$scope.myFavoritesList = [];
	$scope.user = window.localStorage.getItem('idUser');
	//ContentfulService.getAllFavorites();
	var notficationId = 0;

  	var contentfulList = ContentfulService.mainDishes;
  	var bdList = {};

	$scope.addToFavorites = function(){
			$scope.realId = ContentfulService.mainDishes[$scope.platilloId].idContentful;
			var isEmpty = false;
			var obj = {
					idUsuario : $scope.user,
					idPlatillo : $scope.realId
			};
			RequestService.addFavorite(obj).then(function (response){            
				var list = {};
				var empty = false;
				if(response != undefined){
					for(var i = 0; i < response.data.length; i++){
						list[response.data[i].idPlato]=
						{
							idFavorito : response.data[i].idFavorito,
            				idUsuario : response.data[i].idUsuario,
            				fecha : response.data[i].fecha,
            				recordatorio : response.data[i].recordatorio
						};
					}
					isEmpty = $scope.existInContentful(list);

				}
			}, function (reject){ });
	};
	

	$scope.removeFavorites = function(pidPlatillo){
		if($scope.myFavoritesList.length > 0){
			for(var i = 0; i < $scope.myFavoritesList.length; i++){
				if($scope.myFavoritesList[i].idContentful === pidPlatillo){
					$scope.myFavoritesList.splice(i,1);
					i = $scope.myFavoritesList.length;

					var obj ={
							idPlatillo : pidPlatillo,
							idUsuario : $scope.user
					};
					RequestService.removeFavorite(obj).then(function (response){
					}, function (reject){
        			});
        			if(bdList[pidPlatillo] != undefined){
        				if(bdList[pidPlatillo].reminder == 1){
        					NotificationService.cancelNotification(bdList[pidPlatillo].idFavorito);
        				}
        			}
				}
			}
		}
	};

	$scope.getAllFavorites = function(){
		RequestService.getAllFavorites($scope.user).then(function (response){
          		var favoritesList = {};
            	if(response.data !== null){
            		for (var i = 0; i < response.data.length; i++){
            			favoritesList[response.data[i].idPlato] = 
            			{
            				idFavorito : response.data[i].idFavorito,
            				idUsuario : response.data[i].idUsuario,
            				fecha : response.data[i].fecha,
            				recordatorio : response.data[i].recordatorio
            			};
            		}
            	}

            	if(favoritesList !== null){
            		$scope.existInContentful(favoritesList);
            	}
            	
            }, function (reject){
        });
    };

	var options = {
    date: new Date(),
    mode: 'datetime'
	};

	function onSuccess(date) {
	    alert('Selected date: ' + date);
	   	var id = bdList[notficationId].idFavorito;
	    var name = bdList[notficationId].title;
	   	var obj = {
	    	    idPlatillo : notficationId,
                reminder : 1
	    };
	    if(bdList[notficationId].reminder == 0){
	    	NotificationService.createNotification(id,name,date);
	    	RequestService.setReminder(obj);
	    	bdList[notficationId].reminder = 1;

	    }else{
	    	NotificationService.updateNotification(id,name,date);
	    }
	}

	function onError(error) { // Android only
	    alert('Error: ' + error);
	}

	$scope.showDatePicker = function(idPlatillo)
	{
		options.date = new Date();
		datePicker.show(options, onSuccess, onError);
		notficationId = idPlatillo;

	}

	$scope.isNotified = function(id){
		var result = false;
		if(bdList[id] != undefined){
			if(bdList[id].reminder == 1){
			result = true;
			}
		}
		return result;
	};

	$scope.existInContentful = function (list){
		var exist = true;
		if(contentfulList !== null){
			for(var i = 0; i < contentfulList.length; i++){
				if(list[contentfulList[i].idContentful] != undefined){
					if(bdList[contentfulList[i].idContentful] == undefined){
						bdList[contentfulList[i].idContentful] =
						{
							idFavorito : list[contentfulList[i].idContentful].idFavorito,
							title: contentfulList[i].title, 
							reminder: list[contentfulList[i].idContentful].recordatorio
						};
						exist = false;
					}
					if(exist == false){
						$scope.myFavoritesList.push(contentfulList[i]);
					}
				 }
			}
		}
	};

	$scope.execute = function(){
	  	if($scope.platilloId == -1){
	  		$scope.getAllFavorites();
	  	}else{
	  		$scope.addToFavorites();
	  	}
  	};
  	$scope.execute();


}
module.exports = ['$scope', '$stateParams','RequestService', 'ContentfulService', '$rootScope', 'NotificationService', FavoritesController];
