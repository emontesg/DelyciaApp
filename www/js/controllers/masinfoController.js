function MasinfoController($scope, $stateParams, contentfulService,RequestService, $cordovaToast, $location) {
	$scope.platilloId = $stateParams.platilloId;

	$scope.islogged = window.localStorage.getItem("idUser") !== null;

	if(contentfulService.mainDishes.length === 0)
	{
		$scope.currentPlatillo = {id:'0', src:'', title:'', restaurant:'', price:0, rating:0, distance: '', status: ''};

	}
	else
	{
		$scope.currentPlatillo = contentfulService.getDishJson($scope.platilloId);

		if(ionic.Platform.isIOS())
		{
			$scope.mapUrl = 'maps://?q='+$scope.currentPlatillo.lat+', '+$scope.currentPlatillo.lon;
		}
		else
		{
			$scope.mapUrl = 'geo://0,0?q='+$scope.currentPlatillo.lat+', '+$scope.currentPlatillo.lon;
		}
	}


	$scope.$on('ready',function(data,items){
		$scope.currentPlatillo = contentfulService.getDishJson($scope.platilloId);

		if(ionic.Platform.isIOS())
		{
			$scope.mapUrl = 'maps://?q='+$scope.currentPlatillo.lat+', '+$scope.currentPlatillo.lon;
		}
		else
		{
			$scope.mapUrl = 'geo://0,0?q='+$scope.currentPlatillo.lat+', '+$scope.currentPlatillo.lon;
		}
	});

	$scope.goToLocation = function(location)
	{
		if($scope.islogged)
		{
			$location.path(location);
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

	$scope.share = function(location)
	{
		if($scope.islogged)
		{
			var name = contentfulService.mainDishes[$scope.platilloId].title;
      var rest = contentfulService.mainDishes[$scope.platilloId].restaurant;
      var image = contentfulService.mainDishes[$scope.platilloId].src;
      var url = "http://koko-test.com/testing/doc.html";
      facebookConnectPlugin.showDialog({
            method: "share",
            href: "http://koko-test.com/testing/doc.html",
            caption: rest,
            description: name,
            picture: image,
        }, function (postId) {
                  console.log(postId);
            }, function(error){
                 console.log(error);
             });
			$location.path(location);
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

  $scope.showNotLoggedMessage = function()
  {
    if(!$scope.islogged)
    {
      $cordovaToast
      .show('Por favor loggearse primero', 'long', 'bottom')
      .then(function(success) {
        // success
      }, function (error) {
        // error
      });
    }
  };
}

module.exports = ['$scope', '$stateParams', 'ContentfulService', 'RequestService', '$cordovaToast', '$location', MasinfoController];
