'use strict';$

var front = angular.module('controllers.front', ['ngCordova.plugins.geolocation']);

function initFactory($resource) {
  return $resource('/init');
}
front.factory('Init', ['$resource', initFactory]);

function pingFactory($resource) {
  return $resource('/ping');
}
front.factory('Ping', ['$resource', pingFactory]);

function Front($cordovaGeolocation, $scope, Init, Ping) {
  var getCurrentPositionAndPing = function() {
    $cordovaGeolocation.getCurrentPosition().then(function(position) {
      Ping.get({}, function(data) {

      }, function(err) {
        console.log(err.data);
      });
    }, function(err) {
      console.log(err);
    });
  };

}

front.controller('FrontCtrl', ['$cordovaGeolocation', '$scope', 'Init', 'Ping', Front]);