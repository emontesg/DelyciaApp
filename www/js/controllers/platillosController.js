var DelyciaConstants = require('./../delyciaConstants');

function PlatillosController($scope, $ionicGesture, contentfulService,$sce) {
	$scope.delyciaBanner = 'img/158453881.png';
	$scope.platillos = DelyciaConstants.PLATILLOS;
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
		createJSONItems(items);
	});

	$scope.getTrustedResourceUrl = function(url){
   		return $sce.getTrustedResourceUrl(url);
	};

	function createJSONItems(items){
		//{id:'1', src:'img/158358533.png', title:'Sorbeto', restaurant:'cafe miel', price:50000, rating:1, distance: '5 kms', status: 'op'}, 
		var dishes = [];
		var index = 1;
		items.forEach(function(plato){
			var imgLink= 'http:' +plato.fields.foto.fields.file.url;
			console.log($sce.getTrustedResourceUrl(imgLink));

			dishes.push({id:index++, src:$sce.getTrustedResourceUrl(imgLink), title:plato.fields.nombre, restaurant:plato.fields.restaurante.fields.nombre, price:plato.fields.precio, rating:1, distance: '5 kms', status: 'op'});
		});
		console.log(dishes);
		console.log($scope.platillos);

		$scope.platillos = dishes;
	}


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

module.exports = ['$scope', '$ionicGesture','ContentfulService','$sce', PlatillosController];