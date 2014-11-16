'use strict';
(require('rootpath')());

var request = require('request');
var baseUrl = require('config/settings/secrets').baseUrl;

function sendRequest(arg) {
  request(baseUrl+arg);
}

exports.turnOnLeft = function() {
  sendRequest('left=1');
}

exports.turnOnRight = function() {
  sendRequest('right=1');
}

exports.turnOffLeft = function() {
  sendRequest('left=0');
}

exports.turnOffRight = function() {
  sendRequest('right=0');
}

