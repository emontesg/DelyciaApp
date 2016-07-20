var DelyciaConstants = require('./../delyciaConstants');
var contentful = require('contentful');
function FavoritesController($scope, $stateParams, RequestService, ContentfulService, $rootScope, NotificationService) {
	$scope.type = $stateParams.type;
	$scope.platilloId = $stateParams.platilloId;
	$scope.realId = 0;
	$scope.myFavoritesList = [];
	$scope.user = window.localStorage.getItem('idUser');
	//ContentfulService.getAllFavorites();
	var notficationId = 0;

  	var contentfulList = [];
  	var bdList = {};
console.log(contentfulList);
	$scope.addToFavorites = function(){
			if($scope.type === '0' || $scope.type === 0)
			{
				$scope.realId = ContentfulService.mainDishes[$scope.platilloId].idContentful;
			}
			else
			{
				$scope.realId = ContentfulService.searchDishes[$scope.platilloId].idContentful;
			}
			var isEmpty = false;
			var obj = {
					idUsuario : $scope.user,
					idPlatillo : $scope.realId
			};
			RequestService.addFavorite(obj).then(function (response){
				var list = {};
				var empty = false;
				if(response.data != undefined){
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

				}else{
					$scope.getAllFavorites();
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
		//console.log(bdList);
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
	var client = ContentfulService.client;
	// $scope.execute = function(){
	//   	if(contentfulList == null){
	//   		testingContent();
	//   	}else if($scope.platilloId == -1){
	// 		$scope.getAllFavorites();
	// 	}else{
	// 		scope.addToFavorites();
	// 	}
 //  	};
 //  	$scope.execute();

	function testingContent(){
		client.getEntries({
				'content_type':'plato'
			})
			.then(function(entries){
				var totalList = entries.items;
					for(var i = 0; i < totalList.length; i++){
						contentfulList.push(ContentfulService.getDishJson(i, totalList[i]));
					}
				  	if($scope.platilloId == -1){
				  		$scope.getAllFavorites();
				  	}else{
				  		$scope.addToFavorites();
				  	}
			});
	};
	testingContent();
//NotificationService.knowIsNotified();
	$scope.updateNotification = function(id){
		if($scope.myFavoritesList != undefined){
			for(var i = 0; i < $scope.myFavoritesList.length; i ++){
				if(bdList[$scope.myFavoritesList[i].idContentful].idFavorito == id){
					bdList[$scope.myFavoritesList[i].idContentful].reminder = 0;
					var obj = {
						idPlatillo : $scope.myFavoritesList[i].idContentful,
						reminder : 0
					};
					RequestService.setReminder(obj);
					i = $scope.myFavoritesList.length;
				}
			}
		}
	};
	$scope.share = function(id, title, name, image){
		var url = "http://delycia.com/";
		facebookConnectPlugin.showDialog({
					method: "share",
					href: "http://delycia.com/",
					caption: name,
					description: "Disfruta de "+title+", junto con los mejores platos de Costa Rica gracias a Delycia, el app que te lleva a disfrutar de la gastronomía nacional. Descargala ya.",
					picture: image,
			}, function (postId) {
								console.log(postId);
					}, function(error){
							 console.log(error);
					 });
	}
	$scope.$on('updateState', function(event, args){
		$scope.updateNotification(args.id);
	});

}
module.exports = ['$scope', '$stateParams','RequestService', 'ContentfulService', '$rootScope', 'NotificationService', FavoritesController];
