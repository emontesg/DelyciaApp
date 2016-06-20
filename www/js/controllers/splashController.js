function SplashController($scope, $ionicLoading, contentfulService, $location, $ionicHistory) {
	var navbar =  document.getElementsByClassName("nav-bar-block");
	$ionicLoading.show();
	$scope.isLoading = true;

	$scope.$on('ready',function(data){
		$ionicLoading.hide();
		$scope.isLoading = false;
	});

	$scope.onStartClick = function()
	{
		$ionicHistory.nextViewOptions({
		  disableAnimate: false,
		  disableBack: true
		});
		$location.path('/app/platillos/0');
	};
}

module.exports = ['$scope', '$ionicLoading', 'ContentfulService', '$location', '$ionicHistory', SplashController];