function LoginController($scope, $ionicModal, $timeout, $cordovaFacebook, $cordovaOauth) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

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

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    $cordovaFacebook.login(["public_profile", "email", "user_friends"])
   .then(function(success) {
     if (success.authResponse) {
              facebookConnectPlugin.api('/me', null,
                  function(response) {
                      alert('Good to see you, ' +
                          response.email + response.name + '.');
                          console.log(response);
                  });
                

          }
   }, function (error) {
     // error
   });
  };
}
module.exports = ['$scope', '$ionicModal', '$timeout', '$cordovaFacebook', '$cordovaOauth', LoginController];