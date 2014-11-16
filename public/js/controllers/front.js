'use strict';

var front = angular.module('controllers.front', []);

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
}

front.controller('FrontCtrl', ['$scope', Front]);