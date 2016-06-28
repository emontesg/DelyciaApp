var DelyciaConstants = require('./../delyciaConstants');

function FavoritesController($scope, $stateParams, RequestService, ContentfulService, $rootScope, NotificationService) {
	
	$scope.platilloId = $stateParams.platilloId;
	$scope.platillos = DelyciaConstants.PLATILLOS;
	$scope.currentPlatillo = $scope.platillos[$scope.platilloIndex];
	$scope.realId = 0;
	$scope.myFavoritesList = ContentfulService.userFavorites;
	$scope.user = window.localStorage.getItem('idUser');
	ContentfulService.getAllFavorites();
	var bdList = ContentfulService.bdFavList;
	var notficationId = 0;

	$scope.addToFavorites = function(){
		ContentfulService.getAllFavorites();
		if($scope.platilloId != -1){
			$scope.realId = ContentfulService.mainDishes[$scope.platilloId].idContentful;
			var exist = false;
			var obj = {
					idUsuario : $scope.user,
					idPlatillo : $scope.realId
			};

			if($scope.myFavoritesList.length > 0){
				for(var i = 0; i < $scope.myFavoritesList.length; i++){
					if(obj.idPlatillo === $scope.myFavoritesList[i].idContentful){
						exist = true;
						add = i;
						i = $scope.myFavoritesList.length;
					}
				}
			}

			if(exist === false){
				RequestService.addFavorite(obj);
				$scope.myFavoritesList.push(ContentfulService.mainDishes[$scope.platilloId]);
			}
		}
	};
	$scope.addToFavorites();

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
        			NotificationService.cancelNotification(bdList[pidPlatillo].id);
				}
			}
		}
	};

	var options = {
    date: new Date(),
    mode: 'datetime'
	};

	function onSuccess(date) {
	    alert('Selected date: ' + date);
	   	var id = bdList[notficationId].id;
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
		//console.log(bdList[id].reminder);
		if(bdList[id].reminder != undefined){
			if(bdList[id].reminder == 1){
			result = true;
			}
		}
		return result;
	}
}
module.exports = ['$scope', '$stateParams','RequestService', 'ContentfulService', '$rootScope', 'NotificationService', FavoritesController];
