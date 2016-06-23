function RestaurantController($scope, $stateParams, contentfulService, $sce, $cordovaGeolocation, $location, $window) {
	$scope.platilloId = $stateParams.platilloId;

	$scope.mapShow = false;
	$scope.map = null;
	$scope.address = '';

	var center = null;
	var restaurant = null;

	$scope.number = '';

	if(contentfulService.mainDishes.length === 0)
	{
		$scope.currentPlatillo = {id:'0', src:'', title:'', restaurant:'', price:0, rating:0, distance: '', status: ''};

	}
	else
	{
		$scope.currentPlatillo = contentfulService.getDishJson($scope.platilloId);

		loadRestaurant();
	}
	

	$scope.$on('ready',function(data,items){
		$scope.currentPlatillo = contentfulService.getDishJson($scope.platilloId);

		loadRestaurant();
	});

	var options = {timeout: 10000, enableHighAccuracy: true};

	$scope.onDishClick = function(index)
	{
		contentfulService.searchDishes = $scope.restaurantDishes;
		$location.path('/app/platillos/' + (index + 2));
	};

	$scope.loadMap = function()
	{
		if(!$scope.mapShow)
		{
			$scope.mapShow = true;
			if($scope.map === null)
			{
				load();
			}
			else
			{
				setTimeout(reload, 100);
			}
		}
	};

	$scope.showDishes = function()
	{
		$scope.mapShow = false;
	};

	function loadRestaurant()
	{
		if(contentfulService.dishes.length !== 0)
		{
			$scope.currentPlatillo = contentfulService.getDishJson($scope.platilloId);

			var dishes = contentfulService.dishes.items;

			restaurant = dishes[$scope.currentPlatillo.id].fields.restaurante;
			$scope.number = restaurant.fields.telefono;

			var photoCount = restaurant.fields.fotos.length;
			if(photoCount > 1)
			{
				var index = Math.floor((Math.random() * photoCount) + 1);
				$scope.restaurantImage = $sce.getTrustedResourceUrl(restaurant.fields.fotos[index-1].fields.file.url);
			}
			else
			{
				$scope.restaurantImage = $sce.getTrustedResourceUrl(restaurant.fields.fotos[0].fields.file.url);
			}

			$scope.restaurantDishes = [];

			var restaurantContentfulId = restaurant.sys.id;

			for(var i = 0, l = dishes.length; i < l; i++)
			{
				if(dishes[i].fields.restaurante.sys.id === restaurantContentfulId)
				{
					var imgLink= 'http:' +dishes[i].fields.foto.fields.file.url;
					$scope.restaurantDishes.push({
						id: i,
						src: $sce.getTrustedResourceUrl(imgLink),
						title: dishes[i].fields.nombre,
						price:dishes[i].fields.precio, 
						rating:1, 
						distance: '5 kms',
						status: 'ABIERTO' 
					});
				}
			}
		}
	}

	function load()
	{
		var latLng = new google.maps.LatLng(restaurant.fields.ubicacion.lat, restaurant.fields.ubicacion.lon);
		center = latLng;

		var mapOptions = {
		  center: latLng,
		  zoom: 17,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

		google.maps.event.addListenerOnce($scope.map, 'idle', function(){

			var marker = new google.maps.Marker({
				  map: $scope.map,
				  animation: google.maps.Animation.DROP,
				  position: latLng
				});   
			google.maps.event.trigger($scope.map, 'resize');
			$scope.map.panTo(center);

			var geocoder = new google.maps.Geocoder;
			geocoder.geocode({'location': latLng}, function(results, status) {
			    if (status === google.maps.GeocoderStatus.OK) {
			      if (results[1]) {
			      	$scope.$apply(function()
					{
						$scope.address = results[1].formatted_address;
					});
			      } else {
			        console.log('No results found');
			      }
			    } else {
			      console.log('Geocoder failed due to: ' + status);
			    }
			});
		});
	}

	function setAdress(address)
	{
		$scope.address = address;
	}

	function reload()
	{
		$scope.map.panTo(center);
	}

	function onSuccess(result){
	  console.log("Success:"+result);
	}
	 
	function onError(result) {
	  console.log("Error:"+result);
	}
}

module.exports = ['$scope', '$stateParams', 'ContentfulService', '$sce', '$cordovaGeolocation', '$location', '$window', RestaurantController];