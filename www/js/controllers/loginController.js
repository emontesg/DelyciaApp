function LoginController($scope, $ionicModal, $timeout, $cordovaFacebook, RequestService, $cordovaToast, $ionicSideMenuDelegate, $ionicHistory, $sce) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  $scope.islogged = window.localStorage.getItem("idUser") !== null;

  $scope.isMac = window.localStorage.getItem("isMac");

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
      window.localStorage.setItem("isMac", $scope.isMac);
      window.localStorage.setItem("nameUser", "Invitado");
      $scope.nameUser = window.localStorage.getItem("nameUser");
      window.localStorage.setItem("userPhoto", "img/portrait_placeholder.png");
      $scope.userPhoto = window.localStorage.getItem("userPhoto");
      $scope.islogged = false;
      // alert("logOut");
      // $scope.closeLogin();
    }, function (failure){

    });
    $scope.closeMenu();
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
             window.localStorage.setItem("nameUser", response.name);
             $scope.nameUser = window.localStorage.getItem("nameUser");
             console.log(response);
             $scope.islogged = true;
             var pic= "https://graph.facebook.com/"+response.id +"/picture?width=200&height=200";
             window.localStorage.setItem("userPhoto", pic);
             $scope.userPhoto = window.localStorage.getItem("userPhoto");
             var obj = {
                id : response.id,
                name : response.name,
                last_name : response.last_name,
                email : response.email,
                pic : pic
            };

            RequestService.loginUser(obj);
            // $scope.closeLogin();
           });

          }
   }, function (error) {

   });
  };

  $scope.showNotLoggedMessage = function()
  {
    if(!$scope.islogged)
    {
      $cordovaToast
      .show('Por favor iniciar sesión primero', 'long', 'bottom')
      .then(function(success) {
        // success
      }, function (error) {
        // error
      });
    }
  };

  $scope.closeMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
    $ionicHistory.nextViewOptions({
        disableAnimate: true
    });
  };

  //-- menu
  $scope.userPhoto = $scope.islogged ? window.localStorage.getItem("userPhoto") : 'img/portrait_placeholder.png';
  $scope.nameUser = $scope.islogged ? window.localStorage.getItem("nameUser") : 'Invitado';
}

module.exports = ['$scope', '$ionicModal', '$timeout', '$cordovaFacebook','RequestService', '$cordovaToast', '$ionicSideMenuDelegate', '$ionicHistory', '$sce', LoginController];
