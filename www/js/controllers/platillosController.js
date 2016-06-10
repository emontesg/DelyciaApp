function PlatillosController($scope, $stateParams, $ionicGesture, contentfulService, $ionicLoading, RequestService) {
	$ionicLoading.show();
	var type = parseInt($stateParams.type);

	$scope.showSearchButton = type === 0 ? true : false;

	$scope.hasReview = false;

	$scope.delyciaBanner = 'img/158453881.png';
	if(contentfulService.mainDishes.length === 0)
	{
		$scope.platillos = [{id:'0', src:'', title:'', restaurant:'', price:0, rating:0, distance: '', status: ''}];
	}
	else if(type === 0)
	{
		$scope.platillos = contentfulService.mainDishes;
		$ionicLoading.hide();
	}
	else
	{
		$scope.platillos = contentfulService.searchDishes;
		$ionicLoading.hide();
	}

	$scope.dishes = [];

	var initialSlide = type >= 2 ? type-2 : 0;

    $scope.options = {
	  loop: true,
	  pager: false,
	  speed: 500,
	  initialSlide: initialSlide
	};

	//console.log(contentfulService.getPlatos());
	$scope.$on('ready',function(data,items){
		//console.log(items);
		$scope.platillos = items;
		$ionicLoading.hide();
	});

	$scope.infoEnable = true;


	$scope.onImageClick = function()
	{
		$scope.infoEnable = !$scope.infoEnable;
	}

}

module.exports = ['$scope', '$stateParams', '$ionicGesture','ContentfulService', '$ionicLoading', 'RequestService', PlatillosController];
