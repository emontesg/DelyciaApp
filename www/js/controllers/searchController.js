function SearchController($scope, $stateParams, contentfulService, $sce, $location, $ionicLoading) {
	$scope.platilloId = $stateParams.platilloId;

	var checkedDistance = -1;
	var checkedPrice = -1;

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
			type: 'Comida',
			options: [{option:'Carne'}, {option:'Pastas'}, {option:'Postres'}, {option:'Ensaladas'}, {option:'Hamburguesas'}, 
					  {option:'Sopas'}, {option:'Sushi'}, {option:'Cocteles'}, {option:'Alitas'}, {option:'Pollo'}, 
					  {option:'Cremas'}, {option:'Tacos'}],
			enable: false
		},
		{
			type: 'Ocasión',
			options: [{option:'Desayuno'}, {option:'Almuerzo'}, {option:'Cema'}, {option:'Cafe'}, {option:'Romantica'}, 
					  {option:'Familiar'}],
			enable: false
		},
		{
			type: 'Distancia',
			options: [{option:'1 KM', maxDistance:1}, {option:'2 KMS', maxDistance:2}, {option:'3 KMS', maxDistance:3}, 
					  {option:'5 KMS', maxDistance:5}, {option:'10 KMS', maxDistance:10}],
			enable: false
		},
		{
			type: 'Precio',
			options: [{option:'Menor de 3000', minPrice:0, maxPrice:3000}, 
					  {option:'Menor de 5000', minPrice:0, maxPrice:5000}, 
					  {option:'Menor de 8000', minPrice:0, maxPrice:8000},
					  {option:'Menor de 10000', minPrice:0, maxPrice:10000},
					  {option:'Mayor de 10000', minPrice:10000, maxPrice:100000}],
			enable: false
		}
	];

	$scope.onTypeClick = function(typeIndex)
	{
		for(var i = 0, length = $scope.searchType.length; i < length; i++)
		{
			if(i === typeIndex)
			{
				$scope.searchType[i].enable = !$scope.searchType[i].enable;
			}
			else
			{
				$scope.searchType[i].enable = false;
			}
		}
	};

	$scope.onOptionClick = function(type, index)
	{
		var options = [];
		if(type === 'Distancia')
		{
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
					}
					else
					{
						checkedDistance = -1;
					}
				}
			}
		}
		else if(type === 'Precio')
		{
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
					}
					else
					{
						checkedPrice = -1;
					}
				}
			}
		}
	};

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
				case 'Comida':
					var foodOptions = $scope.searchType[i].options;
					for(var j = 0, l = foodOptions.length; j < l; j++)
					{
						if(foodOptions[j].checked)
						{
							foodTypeArray.push(foodOptions[j].option);
						}
					}
					break;
				case 'Ocasión':
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