'use strict';

var login = angular.module('controllers.front', []);

function Front() {
  console.log('hello world');
}

login.controller('FrontCtrl', [Front])