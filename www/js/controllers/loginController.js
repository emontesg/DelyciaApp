function LoginController($scope, $ionicModal, $timeout, $cordovaFacebook, RequestService) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  $scope.islogged = window.localStorage.getItem("idUser") !== null;

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };
  $scope.logout = function() {
    facebookConnectPlugin.logout(function(success){
      window.localStorage.clear();
      $scope.islogged = false;
      alert("logOut");
      $scope.closeLogin();
    }, function (failure){
      console.log(failure);
    });
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    $cordovaFacebook.login(["public_profile", "email", "user_friends"])
   .then(function(success) {
     if (success.authResponse) {
       facebookConnectPlugin.api('/me?fields=id,email,name,last_name,picture', null,
           function(response) {
             window.localStorage.setItem("idUser", response.id);
             $scope.islogged = true;
             var picture= response.picture;
             var pic = picture.data.url;
             console.log(response);
             var obj = {
                id : response.id,
                name : response.name,
                last_name : response.last_name,
                email : response.email,
                pic : pic
            };
            console.log(obj);
            RequestService.loginUser(obj);
            $scope.closeLogin();
           });

          }
   }, function (error) {
     console.log(error);
   });
  };
}
module.exports = ['$scope', '$ionicModal', '$timeout', '$cordovaFacebook','RequestService', LoginController];
