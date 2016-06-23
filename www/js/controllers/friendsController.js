function FriendsController($scope) {
	$scope.testFriends = [
		{photo: 'http://ionicframework.com/docs/v2/demos/item-sliding/avatar-cher.png', name: 'Valeria Ramirez'},
		{photo: 'http://ionicframework.com/docs/v2/demos/item-sliding/avatar-dionne.png', name: 'Esteban Montes'},
		{photo: 'http://ionicframework.com/docs/v2/demos/item-sliding/avatar-murray.png', name: 'Jimmi Vila'}
	];

	$scope.testNoFriends = [
		{photo: 'http://ionicframework.com/docs/v2/demos/item-sliding/avatar-cher.png', name: 'Yi Chuan Huang'},
		{photo: 'http://ionicframework.com/docs/v2/demos/item-sliding/avatar-cher.png', name: 'Oscar Taylor'},
		{photo: 'http://ionicframework.com/docs/v2/demos/item-sliding/avatar-cher.png', name: 'Roger Leiton'},
		{photo: 'http://ionicframework.com/docs/v2/demos/item-sliding/avatar-cher.png', name: 'Test'},
		{photo: 'http://ionicframework.com/docs/v2/demos/item-sliding/avatar-cher.png', name: 'Test'},
		{photo: 'http://ionicframework.com/docs/v2/demos/item-sliding/avatar-cher.png', name: 'Test'},
		{photo: 'http://ionicframework.com/docs/v2/demos/item-sliding/avatar-cher.png', name: 'Test'}

	];

	$scope.onAddClick = function(index){
		var item = $scope.testNoFriends.slice(index, index+1);
		$scope.testNoFriends.splice(index, 1);
		$scope.testFriends.push(item[0]);
	};

	$scope.onRemoveClick = function(index){
		var item = $scope.testFriends.slice(index, index+1);
		$scope.testFriends.splice(index, 1);
		$scope.testNoFriends.push(item[0]);
	};
}

module.exports = ['$scope', FriendsController];