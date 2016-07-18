function RestaurantController($scope, $stateParams, contentfulService, $sce, $cordovaGeolocation, $location, $window) {
	$scope.platilloId = $stateParams.platilloId;

	$scope.mapShow = false;
	$scope.map = null;
	$scope.address = '';
	$scope.schedule = [];

	var moment = require('moment');

	var center = null;
	var restaurant = null;

	$scope.number = '';

	if(contentfulService.mainDishes.length === 0)
	{
		$scope.currentPlatillo = {id:'0', src:'', title:'', restaurant:'', price:0, rating:0, distance: '', status: ''};

	}
	else
	{
		$scope.currentPlatillo = contentfulService.mainDishes[$scope.platilloId];
		contentfulService.getItemsByRestaurant($scope.currentPlatillo.restaurantId);
	}
	

	$scope.$on('ready',function(data,items){
		$scope.currentPlatillo = contentfulService.mainDishes[$scope.platilloId];
		contentfulService.getItemsByRestaurant($scope.currentPlatillo.restaurantId);
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

	$scope.$on('getItemsByRestaurantReady', function(data, items, image, rest) {
		$scope.restaurantImage = image;
		$scope.restaurantDishes = items;
		restaurant = rest;
		$scope.number = restaurant.fields.telefono;
	});

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
		setSchedule(restaurant);
	}

	function setAdress(address)
	{
		$scope.address = address;
	}

	function setSchedule(restaurant){
		console.log(restaurant);
		//var actualDay = new Date().getDay();
		
		var days = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

		domingoDe = new Date(restaurant.fields.horarioInicioDomingo);
		domingoA = new Date(restaurant.fields.horarioFinalDomingo);
		lunesDe = new Date(restaurant.fields.horarioInicioLunes);
		lunesA = new Date(restaurant.fields.horarioFinalLunes);
		martesDe = new Date(restaurant.fields.horarioInicioMartes);
		martesA = new Date(restaurant.fields.horarioFinalMartes);
		miercolesDe = new Date(restaurant.fields.horarioInicioMiercoles);
		miercolesA = new Date(restaurant.fields.horarioFinalMiercoles);
		juevesDe = new Date(restaurant.fields.horarioInicioJueves);
		juevesA = new Date(restaurant.fields.horarioFinalJueves);
		viernesDe = new Date(restaurant.fields.horarioInicioViernes);
		viernesA = new Date(restaurant.fields.horarioFinalViernes);
		sabadoDe = new Date(restaurant.fields.horarioInicioSabado);
		sabadoA = new Date(restaurant.fields.horarioFinalSabado);

		var schedule = [];

		schedule.push(moment(lunesDe).format('h:mm a') + ' a ' + moment(lunesA).format('h:mm a'));
		schedule.push(moment(martesDe).format('h:mm a') + ' a ' + moment(martesA).format('h:mm a'));
		schedule.push(moment(miercolesDe).format('h:mm a') + ' a ' + moment(miercolesA).format('h:mm a'));
		schedule.push(moment(juevesDe).format('h:mm a') + ' a ' + moment(juevesA).format('h:mm a'));
		schedule.push(moment(viernesDe).format('h:mm a') + ' a ' + moment(viernesA).format('h:mm a'));
		schedule.push(moment(sabadoDe).format('h:mm a') + ' a ' + moment(sabadoA).format('h:mm a'));
		schedule.push(moment(domingoDe).format('h:mm a') + ' a ' + moment(domingoA).format('h:mm a'));

		// schedule.domingo = {};
		// schedule.domingo.time = moment(domingoDe).format('h:mm a') + ' a ' + moment(domingoA).format('h:mm a');
		// schedule.domingo.day = domingoDe.getDay();

		// schedule.lunes = {};
		// schedule.lunes.time = moment(lunesDe).format('h:mm a') + ' a ' + moment(lunesA).format('h:mm a');
		// schedule.lunes.day = lunesDe.getDay();
		
		// schedule.martes = {};
		// schedule.martes.time = moment(martesDe).format('h:mm a') + ' a ' + moment(martesA).format('h:mm a');
		// schedule.martes.day = martesDe.getDay();

		// schedule.miercoles = {};		
		// schedule.miercoles.time = moment(miercolesDe).format('h:mm a') + ' a ' + moment(miercolesA).format('h:mm a');
		// schedule.miercoles.day = miercolesDe.getDay();

		// schedule.jueves = {};		
		// schedule.jueves.time = moment(juevesDe).format('h:mm a') + ' a ' + moment(juevesA).format('h:mm a');
		// schedule.jueves.day = juevesDe.getDay();

		// schedule.viernes = {};		
		// schedule.viernes.time = moment(viernesDe).format('h:mm a') + ' a ' + moment(viernesA).format('h:mm a');
		// schedule.viernes.day = viernesDe.getDay();
		
		// schedule.sabado = {};
		// schedule.sabado.time = moment(sabadoDe).format('h:mm a') + ' a ' + moment(sabadoA).format('h:mm a');
		// //$scope.schedule.sabado.time = sabadoDe.getHours()+':'+ sabadoDe.getMinutes()+' a '+ sabadoA.getHours()+':'+sabadoA.getMinutes();
		// schedule.sabado.day = sabadoDe.getDay();

		console.log(schedule);
		//0123456
		var from = [0];
		var to = [0];
		var toIndex = 0;

		for (var i = 0; i < schedule.length-1; i++) {
			if(schedule[i] == schedule[i+1]){
				++to[toIndex];
			}else{
				from.push(to[toIndex]+1);
				to.push(to[toIndex]+1);
				++toIndex;
			}
		}

		for (var i = 0; i < from.length; i++) {
			if(days[from[i]] == days[to[i]]){
				$scope.schedule.push(days[from[i]] +' '+schedule[from[i]]);
			}else{
				$scope.schedule.push(days[from[i]] + ' - ' + days[to[i]]+' '+schedule[from[i]]);
			}
		}

		console.log(from);
		console.log(to);
		console.log($scope.schedule);

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