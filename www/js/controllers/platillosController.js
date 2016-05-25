function PlatillosController($scope, $ionicGesture) {
	$scope.delyciaBanner = 'img/158453881.png';
	$scope.menuImagesSrc = [
		{id:'1', src:'img/158358533.png', title:'Josefino con Sorbeto', restaurant:'cafe miel curridabat', price:2450, rating:4, distance: '4.3 kms', status: 'Abierto'}, 
		{id:'2', src:'img/158358536.png', title:'Spagguetti Madre Nostra', restaurant:'pane vino', price:4125, rating:4, distance: '4.3 kms', status: 'Abierto'}, 
		{id:'3', src:'img/158358537.png', title:'Sangría Primavera', restaurant:'new depot bar', price:1950, rating:4, distance: '4.3 kms', status: 'Abierto'},
		{id:'4', src:'img/158358540.png', title:'Tacos de alambre con salsa bbq', restaurant:'otto\'s tacos', price:3195, rating:4, distance: '4.3 kms', status: 'Abierto'},
		{id:'5', src:'img/158358542.png', title:'Maduritos en salsa almibar', restaurant:'otto\'s tacos', price:1650, rating:4, distance: '4.3 kms', status: 'Abierto'},
		{id:'6', src:'img/158358546.png', title:'Sandwich de pavo con crema de brócoli', restaurant:'cosi', price:3185, rating:4, distance: '4.3 kms', status: 'Abierto'}];

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