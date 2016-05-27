var DelyciaConstants = require('./../delyciaConstants');

function PlatillosController($scope, $ionicGesture) {
	$scope.delyciaBanner = 'img/158453881.png';
	$scope.platillos = DelyciaConstants.PLATILLOS;

	$scope.currentImageIndex = 0;

    $scope.options = {
	  loop: true,
	  pager: false,
	  speed: 500
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

module.exports = ['$scope', '$ionicGesture', PlatillosController];