'use strict';
/*global angular*/

var app = angular.module('pennyDash', [
  'controllers.front',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'http-auth-interceptor',
  'ui.bootstrap'
]);

function configApp($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/front.html',
      controller: 'FrontCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
}

app.config([
  '$routeProvider', 
  '$locationProvider', 
  configApp
]);