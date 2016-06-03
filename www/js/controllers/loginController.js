function LoginController($scope, $ionicModal, $timeout) {

  console.log('logiin :)');// With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1186835011381116',
      xfbml      : true,
      version    : 'v2.6'
    });
    
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
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
    console.log('Doing login', $scope.loginData);

    FB.login(function(response){
      if (response.status=='connected') {
        $scope.closeLogin();
        FB.api('/me', 'GET', {fields: 'first_name, last_name, name, id'}, function(response){
          console.log(response);
        });
      }else if(response.status=='not_authorized'){
        //document.getElementById('status').innerHTML = 'We are not logged in';
      }else{
        //document.getElementById('status').innerHTML = 'You are not legged into facebook';
      }
    });


  };
}
module.exports = ['$scope', '$ionicModal', '$timeout', LoginController];






/*
     function login(){
       FB.login(function(response){
         if (response.status=='connected') {
           document.getElementById('status').innerHTML = 'We are connneted.';
         }else if(response.status=='not_authorized'){
           document.getElementById('status').innerHTML = 'We are not logged in';
         }else{
           document.getElementById('status').innerHTML = 'You are not legged into facebook';
         }
       });
     }
     function getInfo(){
       FB.api('/me', 'GET', {fields: 'first_name, last_name, name, id'}, function(response){
         document.getElementById('status').innerHTML = response.id;
         console.log(response);
       });
     }
     function getPic(){
       FB.api("/me/picture?width=180&height=180",  function(response) {
      console.log(response.data.url);
      document.getElementById('login').innerHTML = '<img src="'+response.data.url+'" />';
      });
     }
*/
