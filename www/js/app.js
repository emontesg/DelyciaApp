// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

// var angular = require('angular');
 require('angular-animate');
 require('ng-cordova');
// require('ionic');

var loginController = require('./controllers/loginController');
var platillosController = require('./controllers/platillosController');
var masinfoController = require('./controllers/masinfoController');
var favoritesController = require('./controllers/favoritesController');
var restaurantController = require('./controllers/restaurantController');
var searchController = require('./controllers/searchController');
var reviewController = require('./controllers/reviewController');


var contentfulService = require('./services/contentfulService');
var requestService = require('./services/requestService');

var app = angular.module('starter', ['ionic', 'ngAnimate', 'ngCordova']);

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

app.factory('ContentfulService',contentfulService);
app.service('RequestService',requestService);
////////////////////WARNING
// app.config(function($sceProvider) {
//    // Completely disable SCE.  For demonstration purposes only!
//    // Do not use in new projects.
//    $sceProvider.enabled(false);
//  });
// $sce();
////////////////////



app.config(function($stateProvider, $urlRouterProvider, $compileProvider, $ionicConfigProvider, $cordovaFacebookProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):\/\//);
    $compileProvider.imgSrcSanitizationWhitelist('http://images.contentful.com/');

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):\/\//);

  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
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
          templateUrl: 'templates/friends.html'
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
  $urlRouterProvider.otherwise('/app/platillos/0');
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
