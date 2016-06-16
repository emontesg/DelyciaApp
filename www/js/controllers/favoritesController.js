var DelyciaConstants = require('./../delyciaConstants');

function FavoritesController($scope, $stateParams, RequestService, ContentfulService, $rootScope) {
	
	$scope.platilloId = $stateParams.platilloId;
	$scope.platillos = DelyciaConstants.PLATILLOS;
	$scope.currentPlatillo = $scope.platillos[$scope.platilloIndex];
	$scope.realId = ContentfulService.mainDishes[$scope.platilloId].idContentful;
	$scope.myFavoritesList = ContentfulService.userFavorites;
	$scope.user = localStorage.getItem('idUser');

	$scope.addToFavorites = function(){
		ContentfulService.getAllFavorites();
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
				}
			}
		}
	};
}
module.exports = ['$scope', '$stateParams','RequestService', 'ContentfulService', '$rootScope', FavoritesController];
