function SplashController($scope, $ionicLoading, contentfulService, $location, $ionicHistory) {
	var navbar =  document.getElementsByClassName("nav-bar-block");
	navbar[0].classList.add('splash-header-bar');
	navbar[1].classList.add('splash-header-bar');

	$ionicLoading.show();
	$scope.isLoading = true;

	$scope.$on('ready',function(data){
		$ionicLoading.hide();
		$scope.isLoading = false;
	});

	$scope.onStartClick = function()
	{
		navbar[0].classList.remove('splash-header-bar');
		navbar[1].classList.remove('splash-header-bar');
		$ionicHistory.nextViewOptions({
		  disableAnimate: false,
		  disableBack: true
		});
		$location.path('/app/platillos/0');
	};
}

module.exports = ['$scope', '$ionicLoading', 'ContentfulService', '$location', '$ionicHistory', SplashController];