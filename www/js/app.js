// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
// var angular = require('angular');
 require('angular-animate');
// require('ionic');

var loginController = require('./controllers/loginController');
var playlistsController = require('./controllers/playlistsController');
var playlistController = require('./controllers/playlistController');
var platillosController = require('./controllers/platillosController');
var masinfoController = require('./controllers/masinfoController');

var contentfulService = require('./services/contentfulService');

var app = angular.module('starter', ['ionic', 'ngAnimate']);

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
app.controller('PlaylistsCtrl', playlistsController);
app.controller('PlaylistCtrl', playlistController);
app.controller('PlatillosCtrl', platillosController);
app.controller('MasinfoCtrl', masinfoController);

app.factory('ContentfulService',contentfulService);
////////////////////WARNING
// app.config(function($sceProvider) {
//    // Completely disable SCE.  For demonstration purposes only!
//    // Do not use in new projects.
//    $sceProvider.enabled(false);
//  });
// $sce();
////////////////////



app.config(function($stateProvider, $urlRouterProvider, $compileProvider) {
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
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

    .state('app.platillos', {
      url: '/platillos',
      views: {
        'menuContent': {
          templateUrl: 'templates/platillos.html',
          controller: 'PlatillosCtrl'
        }
      }
    })

    .state('app.masinfo', {
      url: '/platillos/:platilloId/:platilloIndex',
      views: {
        'menuContent': {
          templateUrl: 'templates/masinfo.html',
          controller: 'MasinfoCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/platillos');
  //$compileProvider.imgSrcSanitizationWhitelist('img/');
});

app.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'http://images.contentful.com/**'
  ]);

});
