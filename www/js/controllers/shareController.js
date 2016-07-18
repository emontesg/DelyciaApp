function ShareController($scope, $stateParams, contentfulService, $location, $ionicHistory) {
	$scope.platilloId = $stateParams.platilloId;
	$scope.type = $stateParams.type;

	$scope.doShare = function(){
		var name = '';
		var rest = '';
		var image = '';
		if($scope.type === '0')
		{
			name = contentfulService.mainDishes[$scope.platilloId].title;
			rest = contentfulService.mainDishes[$scope.platilloId].restaurant;
			image = contentfulService.mainDishes[$scope.platilloId].src;
		}
		else
		{
			name = contentfulService.searchDishes[$scope.platilloId].title;
			rest = contentfulService.searchDishes[$scope.platilloId].restaurant;
			image = contentfulService.searchDishes[$scope.platilloId].src;
		}
		var url = "http://koko-test.com/testing/doc.html";
		facebookConnectPlugin.showDialog({
					method: "share",
					href: "http://koko-test.com/testing/doc.html",
					caption: rest,
					description: name,
					picture: image,
			}, function (postId) {
								console.log(postId);
					}, function(error){
							 console.log(error);
					 });
	}
}

module.exports = ['$scope', '$stateParams', 'ContentfulService', '$location', '$ionicHistory', ShareController];
