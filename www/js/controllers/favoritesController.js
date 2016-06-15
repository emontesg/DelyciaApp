var DelyciaConstants = require('./../delyciaConstants');

function FavoritesController($scope, $stateParams, RequestService, ContentfulService, $rootScope) {
	
	$scope.platilloId = $stateParams.platilloId;
	$scope.platillos = DelyciaConstants.PLATILLOS;
	$scope.currentPlatillo = $scope.platillos[$scope.platilloIndex];
	$scope.realId = ContentfulService.dishes.items[$scope.platilloId].sys.id;
	$scope.myFavoritesList = ContentfulService.userFavorites;
	$scope.user = localStorage.getItem('userLogged');

	$scope.addToFavorites = function(){
		ContentfulService.getAllFavorites();
		var exist = false;
		var obj = {
				idUsuario : $scope.user,
				idPlatillo : $scope.realId
		};

		if($scope.myFavoritesList.length > 0){
			for(var i = 0; i < $scope.myFavoritesList.length; i++){
				if(obj.idPlatillo === $scope.myFavoritesList[i].sys.id){
					exist = true;
					add = i;
					i = $scope.myFavoritesList.length;
				}
			}
		}

		if(exist === false){
			console.log("here i am");
			console.log(obj);
			RequestService.addFavorite(obj);
			$scope.myFavoritesList.push(ContentfulService.dishes.items[$scope.platilloId]);
		}
	};
	$scope.addToFavorites();

	$scope.removeFavorites = function(pidPlatillo){

		if($scope.myFavoritesList.length > 0){
			for(var i = 0; i < $scope.myFavoritesList.length; i++){
				if($scope.myFavoritesList[i].sys.id === pidPlatillo){
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
}
}
module.exports = ['$scope', '$stateParams','RequestService', 'ContentfulService', '$rootScope', FavoritesController];
