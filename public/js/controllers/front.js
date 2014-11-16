'use strict';

var front = angular.module('controllers.front', []);

function Front($scope) {
  console.log('hello world');
  $scope.goAway = false;
  $scope.awayToggle = function() {
 	$scope.goAway = true;
  }
}

front.controller('FrontCtrl', ['$scope', Front]);