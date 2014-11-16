'use strict';

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
  $scope.address;
  $scope.red = false;
  $scope.goAway = false;
  $scope.grabDestination = function() {
    if ($scope.address != undefined) {
      Init.get({address: $scope.address.replace(' ','+')}, function(result) {
        $scope.direction = result.message;
        $scope.goAway = true;
      }, function(err) {
        $scope.error1 = err;
      });
    } else {
      $scope.red = true;
    }
  }

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
