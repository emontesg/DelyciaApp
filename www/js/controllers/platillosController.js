var DelyciaConstants = require('../delyciaConstants');

function PlatillosController($scope, $stateParams, contentfulService) {

	var type = parseInt($stateParams.type);

	var block2 = DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT;
	var block3 = DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT * 2;

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
		contentfulService.hideSearchItems(type-2);
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
	  loop: false,
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
	
	$scope.$on("$ionicSlides.slideChangeStart", function(event, data){
	  var activeIndex = data.slider.activeIndex;
	  if(activeIndex > data.slider.previousIndex)
	  {
	  	if(activeIndex === block2)
	  	{
	  		contentfulService.currentViewedPageIndex = 1; 
	  		contentfulService.getNextPage(type);
	  	}
	  	else
	  	{
	  		var multiplo = activeIndex / DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT;
	  		if(Number.isInteger(multiplo))
	  		{
	  			contentfulService.currentViewedPageIndex = multiplo;
	  			contentfulService.getNextPage(type);
	  			contentfulService.hidePreviousPage(type);
	  			$scope.$apply(function() {
	  				if(type === 0)
					{
		  				$scope.platillos = contentfulService.mainDishes;
		  			}
		  			else
		  			{
		  				$scope.platillos = contentfulService.searchDishes;
		  			}
		  		});
	  		}
	  	}
	  }
	  else
	  {
	  	var multiplo2 = (activeIndex+1) / DelyciaConstants.DISHES_PAGE_ITEMS_LIMIT;
	  	if(Number.isInteger(multiplo2))
	  	{
	  		contentfulService.currentViewedPageIndex = multiplo2-1;
	  		contentfulService.getPreviousPage(type);
	  		contentfulService.hideNextPage(type);
	  		$scope.$apply(function() {
	  			if(type === 0)
				{
	  				$scope.platillos = contentfulService.mainDishes;
	  			}
	  			else
	  			{
	  				$scope.platillos = contentfulService.searchDishes;
	  			}
	  		});
	  	}
	  }
	});

}

module.exports = ['$scope', '$stateParams', 'ContentfulService', PlatillosController];