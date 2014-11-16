'use strict';

var front = angular.module('controllers.front', ['ngCordova']);

<<<<<<< HEAD
function Front($scope) {
	$scope.address;
	$scope.red = false;
	$scope.goAway = false;
	$scope.grabDestination = function() {
		if ($scope.address != undefined) {
			$scope.output = $scope.address.replace(' ','+');
			alert($scope.output)
			$scope.goAway = true;
		} else {
			$scope.red = true;
		}
	}
=======
function initFactory($resource) {
  return $resource('/init');
}
front.factory('Init', ['$resource', initFactory]);

function pingFactory($resource) {
  return $resource('/ping');
}
front.factory('Ping', ['$resource', pingFactory]);

function Front($cordovaGeolocation, $scope) {

>>>>>>> c2855b9c257b18dd187aa435f87cfdb2d969d731
}

front.controller('FrontCtrl', ['$cordovaGeolocation', '$scope', Front]);
