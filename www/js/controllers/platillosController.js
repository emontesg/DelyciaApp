function PlatillosController($scope, $stateParams, $ionicGesture, contentfulService, RequestService, $rootScope) {

	var type = parseInt($stateParams.type);

	$scope.showSearchButton = type === 0 ? true : false;
	$scope.hasReview = false;
	$scope.hearts = [0,1,2,3,4];

	if(contentfulService.mainDishes.length === 0)
	{
		$scope.platillos = [{id:'0', src:'', title:'', restaurant:'', price:0, rating:0, distance: '', status: ''}];
	}
	else if(type === 0)
	{
		$scope.platillos = contentfulService.mainDishes;
	}
	else
	{
		$scope.platillos = contentfulService.searchDishes;
	}

	if(ionic.Platform.isIOS())
	{
		$scope.isIOS = true;
	}
	else
	{
		$scope.isIOS = false;
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
	});

	$scope.$on('error', function(data) {

	});

	$scope.getHeartClass = function(index, rating)
	{
		if(index < parseInt(rating))
		{
			return 'ion-ios-heart active';
		}
		else
		{
			return 'ion-ios-heart';
		}
	};

	$scope.infoEnable = true;


	$scope.onImageClick = function()
	{
		$scope.infoEnable = !$scope.infoEnable;
	}
	

	

}

module.exports = ['$scope', '$stateParams', '$ionicGesture','ContentfulService', 'RequestService','$rootScope', PlatillosController];