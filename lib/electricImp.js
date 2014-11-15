'use strict';
(require('rootpath')());

var request = require('request');
var baseUrl = require('config/settings/secrets').baseUrl;

function sendRequest(arg, callback) {
  request(baseUrl+arg, function(err, response) {
    !err && response === 200 ? callback(null) : callback(err);
  });
}

exports.turnOnLeft = function(callback) {
  sendRequest('left=1', callback);
}

exports.turnOnRight = function(callback) {
  sendRequest('right=1', callback);
}

exports.turnOffLeft = function(callback) {
  sendRequest('left=0', callback);
}

exports.turnOffRight = function(callback) {
  sendRequest('right=0', callback);
}