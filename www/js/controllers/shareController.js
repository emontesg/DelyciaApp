function ShareController($scope, $stateParams, contentfulService, $location, $ionicHistory) {
	$scope.platilloId = $stateParams.platilloId;

	$scope.doShare = function(){
		var name = contentfulService.mainDishes[$scope.platilloId].title;
		var rest = contentfulService.mainDishes[$scope.platilloId].restaurant;
		var image = contentfulService.mainDishes[$scope.platilloId].src;
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
