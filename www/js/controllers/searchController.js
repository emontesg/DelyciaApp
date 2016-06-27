function SearchController($scope, $stateParams, contentfulService, $sce, $location, $ionicLoading) {
	$scope.platilloId = $stateParams.platilloId;

	var checkedDistance = -1;
	var checkedPrice = -1;

	$scope.disableButtons = true;

	$scope.message = '';

	if(contentfulService.mainDishes.length === 0)
	{
		$scope.currentPlatillo = {id:'0', src:'', title:'', restaurant:'', price:0, rating:0, distance: '', status: ''};

	}
	else
	{
		$scope.currentPlatillo = contentfulService.getDishJson($scope.platilloId);
	}
	
	$scope.$on('ready',function(data,items){
		$scope.currentPlatillo = contentfulService.getDishJson($scope.platilloId);
	});

	$scope.searchType = [
		{
			type: 'Tipos de Comida',
			class: 'ion-android-restaurant',
			options: [{option:'Carne'}, {option:'Pescado'}, {option:'Pollo'}, {option:'Mariscos'}, {option:'Sopas'}, 
					  {option:'Cremas'}, {option:'Ensaladas'}, {option:'Pastas'}, {option:'Criolla'}, {option:'Postres'}, 
					  {option:'Vegetariano'}, {option:'Hamburguesas'}, {option:'Sandwich'}, {option:'Pan & reposteria'}, 
					  {option:'Desayuno'}, {option:'Pizza'}, {option:'Cerveza'}, {option:'Sushi'}, {option:'Vino'}, 
					  {option:'Otros'}],
			enableCount: 0
		},
		{
			type: 'Por ocasión',
			class: 'ion-coffee',
			options: [{option:'Desayuno'}, {option:'Almuerzo'}, {option:'Cena'}, {option:'Cafe'}, {option:'Romantica'}, 
					  {option:'Familiar'}],
			enableCount: 0
		},
		{
			type: 'Distancia',
			class: 'ion-map',
			options: [{option:'1 KM', maxDistance:1}, {option:'2 KMS', maxDistance:2}, {option:'3 KMS', maxDistance:3}, 
					  {option:'5 KMS', maxDistance:5}, {option:'10 KMS', maxDistance:10}],
			enableCount: 0
		},
		{
			type: 'Precio',
			class: 'ion-cash',
			options: [{option:'Menor de 3000', minPrice:0, maxPrice:3000}, 
					  {option:'Menor de 5000', minPrice:0, maxPrice:5000}, 
					  {option:'Menor de 8000', minPrice:0, maxPrice:8000},
					  {option:'Menor de 10000', minPrice:0, maxPrice:10000},
					  {option:'Mayor de 10000', minPrice:10000, maxPrice:100000}],
			enableCount: 0
		}
	];

	$scope.options = {
	  loop: false,
	  pager: false,
	  speed: 500,
	}

	$scope.$on("$ionicSlides.sliderInitialized", function(event, data){
	  // data.slider is the instance of Swiper
	  $scope.slider = data.slider;
	});

	$scope.onTypeClick = function(typeIndex)
	{
		$scope.slider.slideTo(typeIndex + 1, 500);
	};

	$scope.onOptionClick = function(type, index)
	{
		var options = [];
		switch(type)
		{
			case 'Tipos de Comida':
				if($scope.searchType[0].options[index].checked)
				{
					$scope.searchType[0].enableCount++;
				}
				else
				{
					$scope.searchType[0].enableCount--;
				}
				break;
			case 'Por ocasión':
				if($scope.searchType[1].options[index].checked)
				{
					$scope.searchType[1].enableCount++;
				}
				else
				{
					$scope.searchType[1].enableCount--;
				}
				break;
			case 'Distancia':
				options = $scope.searchType[2].options;
				for(var i = 0, l = options.length; i < l; i++)
				{
					if(i !== index)
					{
						options[i].checked = false;
					}
					else
					{
						if(options[i].checked)
						{
							checkedDistance = index;
							$scope.searchType[2].enableCount = 1;
						}
						else
						{
							checkedDistance = -1;
							$scope.searchType[2].enableCount = 0;
						}
					}
				}
				break;
			case 'Precio':
				options = $scope.searchType[3].options;
				for(var i = 0, l = options.length; i < l; i++)
				{
					if(i !== index)
					{
						options[i].checked = false;
					}
					else
					{
						if(options[i].checked)
						{
							checkedPrice = index;
							$scope.searchType[3].enableCount = 1;
						}
						else
						{
							checkedPrice = -1;
							$scope.searchType[3].enableCount = 0;
						}
					}
				}
				break;
		}

		if($scope.searchType[0].enableCount <= 0 &&
			$scope.searchType[1].enableCount <= 0 &&
			$scope.searchType[2].enableCount <= 0 &&
			$scope.searchType[3].enableCount <= 0)
		{
			$scope.disableButtons = true;
		}
		else
		{
			$scope.disableButtons = false;
		}
	};

	$scope.onResetClick = function()
	{
		for(var i = 0, l = $scope.searchType.length; i < l; i++)
		{
			var options = $scope.searchType[i].options;
			for(var j = 0, lj = options.length; j < lj; j++)
			{
				options[j].checked = false;
			}
			$scope.searchType[i].enableCount = 0;	
		}

		checkedDistance = -1;
		checkedPrice = -1;
		$scope.disableButtons = true;
	}

	$scope.onSearchClick = function()
	{
		var foodTypeArray = [];
		var ocassionArray = [];
		var maxDistance = -1;
		var minPrice = 0;
		var maxPrice = -1;
		for(var i = 0, length = $scope.searchType.length; i < length; i++)
		{
			switch($scope.searchType[i].type)
			{
				case 'Tipos de Comida':
					var foodOptions = $scope.searchType[i].options;
					for(var j = 0, l = foodOptions.length; j < l; j++)
					{
						if(foodOptions[j].checked)
						{
							foodTypeArray.push(foodOptions[j].option);
						}
					}
					break;
				case 'Por ocasión':
					var ocassionOptions = $scope.searchType[i].options;
					for(var j = 0, l = ocassionOptions.length; j < l; j++)
					{
						if(ocassionOptions[j].checked)
						{
							ocassionArray.push(ocassionOptions[j].option);
						}
					}
					break;
				case 'Distancia':
					if(checkedDistance > -1)
					{
						maxDistance = $scope.searchType[i].options[checkedDistance].maxDistance;
					}
					break;
				case 'Precio':
					if(checkedPrice > -1)
					{
						minPrice = $scope.searchType[i].options[checkedPrice].minPrice;
						maxPrice = $scope.searchType[i].options[checkedPrice].maxPrice;
					}
					break;
			}
		}

		search(foodTypeArray, ocassionArray, maxDistance, minPrice, maxPrice);
	};

	/*  foodType: array of strings
	 *  ocansion: array of strings
	 *  maxDistance: int
	 *  minPrice: int
	 *  maxPrice: int
	 */
	function search(foodType, ocassion, maxDistance, minPrice, maxPrice)
	{
		var dishes = contentfulService.dishes.items;
		var foodTypeLength = foodType.length;
		var ocassionLength = ocassion.length;
		var length = foodTypeLength > ocassionLength ? foodTypeLength : ocassionLength;
		var foundDishes = [];

		if(length === 0 && maxDistance < 0 && maxPrice < 0)
		{
			$scope.message = 'Por favor seleccionar criterios de búsqueda';
			return;
		}

		for(var i = 0, l = dishes.length; i < l; i++)
		{
			if(dishes[i].fields.precio > maxPrice || dishes[i].fields.precio < minPrice)
			{
				if(maxPrice > 0)
				{
					continue;
				}
			}

			//TODO: checked distance

			var foodTypeAccepted = foodTypeLength > 0 ? false : true;
			var ocassionAccepted = ocassionLength > 0 ? false : true;
			for(var j = 0, lj = length; j < lj; j++)
			{
				if(j < foodTypeLength)
				{
					if(dishes[i].fields.ComidaTags.indexOf(foodType[j]) !== -1)
					{
						foodTypeAccepted = true;
					}
				}

				if(j < ocassionLength)
				{
					if(dishes[i].fields.ocasionTags.indexOf(ocassion[j]) !== -1)
					{
						ocassionAccepted = true;
					}
				}
			}

			if(foodTypeAccepted && ocassionAccepted)
			{
				var imgLink= 'http:' +dishes[i].fields.foto.fields.file.url;
				foundDishes.push({
					id: i,
					src: $sce.getTrustedResourceUrl(imgLink),
					title: dishes[i].fields.nombre,
					price:dishes[i].fields.precio, 
					restaurant:dishes[i].fields.restaurante.fields.nombre, 
					rating:1, 
					distance: '5 kms', 
					status: 'ABIERTO'
				});
			}
		}

		if(foundDishes.length !== 0)
		{
			contentfulService.searchDishes = foundDishes;
			$location.path('/app/platillos/1');
			$scope.message = '';
		}
		else
		{
			$scope.message = 'No hubo resultados en su búsqueda';
		}
	}
}

module.exports = ['$scope', '$stateParams', 'ContentfulService', '$sce', '$location', '$ionicLoading', SearchController];