// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

// var angular = require('angular');
 require('angular-animate');
 require('ng-cordova');
 require('ionic-native-transitions');
// require('ionic');

var loginController = require('./controllers/loginController');
var platillosController = require('./controllers/platillosController');
var masinfoController = require('./controllers/masinfoController');
var favoritesController = require('./controllers/favoritesController');
var restaurantController = require('./controllers/restaurantController');
var searchController = require('./controllers/searchController');
var reviewController = require('./controllers/reviewController');
var friendsController = require('./controllers/friendsController');
var splashController = require('./controllers/splashController');

var contentfulService = require('./services/contentfulService');
var requestService = require('./services/requestService');
var preloaderService = require('./services/preloaderService');
var notificationService = require('./services/notificationService');

var app = angular.module('starter', ['ionic', 'ngAnimate', 'ngCordova', 'ngCordovaOauth', 'ionic-native-transitions']);

var platform = '';

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});

app.controller('AppCtrl', loginController);
app.controller('PlatillosCtrl', platillosController);
app.controller('MasinfoCtrl', masinfoController);
app.controller('FavoritesCtrl', favoritesController);
app.controller('RestaurantCtrl', restaurantController);
app.controller('SearchCtrl', searchController);
app.controller('ReviewCtrl', reviewController);
app.controller('FriendsCtrl', friendsController);
app.controller('SplashCtrl', splashController);

app.factory('ContentfulService',contentfulService);
app.service('RequestService',requestService);
app.factory('PreloaderService', preloaderService);
app.factory('NotificationService', notificationService);
////////////////////WARNING
// app.config(function($sceProvider) {
//    // Completely disable SCE.  For demonstration purposes only!
//    // Do not use in new projects.
//    $sceProvider.enabled(false);
//  });
// $sce();
////////////////////

app.config(function($stateProvider, $urlRouterProvider, $compileProvider, $ionicConfigProvider, $ionicNativeTransitionsProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):\/\//);
    $compileProvider.imgSrcSanitizationWhitelist('http://images.contentful.com/');
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|chrome-extension):/);

    $ionicConfigProvider.scrolling.jsScrolling(false);

    $ionicNativeTransitionsProvider.setDefaultOptions({
        duration: 100, // in milliseconds (ms), default 400, 
        slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4 
        iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1 
        androiddelay: -1, // same as above but for Android, default -1 
        winphonedelay: -1, // same as above but for Windows Phone, default -1, 
        fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android) 
        fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android) 
        triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option 
        backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back 
    });

  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

    .state('app.splash', {
      url: '/splash',
      views: {
        'menuContent': {
          templateUrl: 'templates/splash.html',
          controller: 'SplashCtrl'
        }
      }
    })

  .state('app.search', {
    url: '/search/:platilloId',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl'
      }
    }
  })

    .state('app.platillos', {
      url: '/platillos/:type',
      views: {
        'menuContent': {
          templateUrl: 'templates/platillos.html',
          controller: 'PlatillosCtrl'
        }
      }
    })

    .state('app.masinfo', {
      url: '/masinfo/:platilloId',
      views: {
        'menuContent': {
          templateUrl: 'templates/masinfo.html',
          controller: 'MasinfoCtrl'
        }
      }
    })

    .state('app.restaurant', {
      url: '/restaurant/:platilloId',
      views: {
        'menuContent': {
          templateUrl: 'templates/restaurant.html',
          controller: 'RestaurantCtrl'
        }
      }
    })

    .state('app.favorites', {
      url: '/favorites/:platilloId',
      views: {
        'menuContent': {
          templateUrl: 'templates/favorites.html',
          controller: 'FavoritesCtrl'
        }
      }
    })

    .state('app.share', {
      url: '/share/:platilloId',
      views: {
        'menuContent': {
          templateUrl: 'templates/share.html'
        }
      }
    })

    .state('app.reviews', {
      url: '/reviews/:platilloId',
      views: {
        'menuContent': {
          templateUrl: 'templates/reviews.html',
          controller: 'ReviewCtrl'
        }
      }
    })

    .state('app.friends', {
      url: '/friends',
      views: {
        'menuContent': {
          templateUrl: 'templates/friends.html',
          controller: 'FriendsCtrl'
        }
      }
    })

    .state('app.configurations', {
      url: '/configurations',
      views: {
        'menuContent': {
          templateUrl: 'templates/configurations.html'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/splash');
  $ionicConfigProvider.backButton.text('').icon('ion-chevron-left').previousTitleText(false);
  // $compileProvider.imgSrcSanitizationWhitelist('img/');
});

app.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'http://images.contentful.com/**'
  ]);
});

function initPushwoosh() {
    var pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");
 
    if(platform === 'iOS')
    {
        //set push notification callback before we initialize the plugin
      document.addEventListener('push-notification', function(event) {
                                  //get the notification payload
                                  var notification = event.notification;
   
                                  //display alert to the user for example
                                  alert(notification.aps.alert);
                                 
                                  //clear the app badge
                                  pushNotification.setApplicationIconBadgeNumber(0);
                              });

      //initialize the plugin
      pushNotification.onDeviceReady({pw_appid:"P77614-4AB60"});

      //register for pushes
      pushNotification.registerDevice(
          function(status) {
              var deviceToken = status['deviceToken'];
              console.warn('registerDevice: ' + deviceToken);
          },
          function(status) {
              console.warn('failed to register : ' + JSON.stringify(status));
              alert(JSON.stringify(['failed to register ', status]));
          }
      );
       
      //reset badges on app start
      pushNotification.setApplicationIconBadgeNumber(0);
    }
    else if(platform === 'Android')
    {
      //set push notifications handler
      document.addEventListener('push-notification', function(event) {
          var title = event.notification.title;
          var userData = event.notification.userdata;
                                   
          if(typeof(userData) != "undefined") {
              console.warn('user data: ' + JSON.stringify(userData));
          }
                                       
          alert(title);
      });
      //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_NUMBER", pw_appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
      pushNotification.onDeviceReady({ projectid: "572544632214", pw_appid : "P77614-4AB60" });

      //register for pushes
      pushNotification.registerDevice(
          function(status) {
              var pushToken = status;
              console.warn('push token: ' + pushToken);
          },
          function(status) {
              console.warn(JSON.stringify(['failed to register ', status]));
          }
      );
    }
}

document.addEventListener('deviceready', function () {
    // cordova.plugins.notification.local is now available
    platform = device.platform;

    // initPushwoosh();
}, false);
