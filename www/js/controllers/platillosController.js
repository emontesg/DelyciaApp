function PlatillosController($scope, $ionicGesture) {
	$scope.delyciaBanner = 'img/158453881.png';
	$scope.menuImagesSrc = [
		{src:'img/158358533.png', title:'Josefino con Sorbeto', restaurant:'cafe miel curridabat', price:0, rating:0, distance: '0 mts', status: 'Abierto'}, 
		{src:'img/158358536.png', title:'Spagguetti Madre Nostra', restaurant:'pane vino', price:0, rating:0, distance: '0 mts', status: 'Abierto'}, 
		{src:'img/158358537.png', title:'Sangría Primavera', restaurant:'new depot bar', price:0, rating:0, distance: '0 mts', status: 'Abierto'},
		{src:'img/158358540.png', title:'Tacos de alambre con salsa bbq', restaurant:'otto\'s tacos', price:0, rating:0, distance: '0 mts', status: 'Abierto'},
		{src:'img/158358542.png', title:'Maduritos en salsa almibar', restaurant:'otto\'s tacos', price:0, rating:0, distance: '0 mts', status: 'Abierto'},
		{src:'img/158358546.png', title:'Sandwich de pavo con crema de brócoli', restaurant:'cosi', price:0, rating:0, distance: '0 mts', status: 'Abierto'}];

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