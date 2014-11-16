'use strict';

var front = angular.module('controllers.front', ['ngCordova']);

function initFactory($resource) {
  return $resource('/init');
}
front.factory('Init', ['$resource', initFactory]);

function pingFactory($resource) {
  return $resource('/ping');
}
front.factory('Ping', ['$resource', pingFactory]);

function Front($cordovaGeolocation, $scope) {

}

front.controller('FrontCtrl', ['$cordovaGeolocation', '$scope', Front]);