function PlatillosController($scope, $ionicGesture, contentfulService, $sce, RequestService) {
	$scope.delyciaBanner = 'img/158453881.png';
	if(contentfulService.mainDishes.length === 0)
	{
		$scope.platillos = [{id:'0', src:'', title:'', restaurant:'', price:0, rating:0, distance: '', status: ''}];
	}
	else
	{
		$scope.platillos = contentfulService.mainDishes;
	}
	
	$scope.dishes = [];
	$scope.currentImageIndex = 0;

    $scope.options = {
	  loop: true,
	  pager: false,
	  speed: 500
	};

	//console.log(contentfulService.getPlatos());
	$scope.$on('ready',function(data,items){
		//console.log(items);
		$scope.platillos = items;
	});

	$scope.getTrustedResourceUrl = function(url){
   		return $sce.getTrustedResourceUrl(url);
	};

	$scope.infoEnable = true;

	$scope.$on("$ionicSlides.sliderInitialized", function(event, data){
	});

	$scope.$on("$ionicSlides.slideChangeStart", function(event, data){
	});

	$scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
		$scope.currentImageIndex = data.activeIndex;
		console.log($scope.currentImageIndex);

	});

	$scope.gesture = {
		used: ''
	};  

	$scope.onGesture = function(gesture) {
		$scope.gesture.used = gesture;
		console.log(gesture);
	};


	var element = angular.element(document.querySelector('#platilloContent')); 

	$ionicGesture.on('tap', function(e){
		$scope.$apply(function() {
			$scope.gesture.used = 'Tap';
			$scope.infoEnable = !$scope.infoEnable;
		});
	}, element);
}

module.exports = ['$scope', '$ionicGesture','ContentfulService','$sce','RequestService', PlatillosController];