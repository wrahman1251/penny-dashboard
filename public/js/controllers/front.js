'use strict';

var front = angular.module('controllers.front', [
  'ngCordova.plugins.geolocation','google-maps'.ns()]);

function initFactory($resource) {
  return $resource('/init');
}
front.factory('Init', ['$resource', initFactory]);

function pingFactory($resource) {
  return $resource('/ping');
}

front.factory('Ping', ['$resource', pingFactory]);

function Front($cordovaGeolocation, $scope, Init, Ping) {
  var height = $( window ).height() - $( '.directive' ).outerHeight() - $( '.top-bar' ).outerHeight();
  $( '.angular-google-map-container' ).css( 'height' , height );
    console.log(height);
  $( window ).resize( function(){
    var height = $( window ).height() - $( '.directive' ).outerHeight() - $( '.top-bar' ).outerHeight();
    $( '.angular-google-map-container' ).css( 'height' , height );
    console.log(height);
  });
  var getCurrentPosition = function(callback) {
    $cordovaGeolocation.getCurrentPosition().then(function(position) {
      callback(null, {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    }, function(err) {
      callback(err);
    });
  };
  getCurrentPosition(function(err, results) {
    if (err) { return err; }
    $scope.address;
    $scope.red = false;
    $scope.goAway = false;
    $scope.error1 = null;
    $scope.directions = null;
    $scope.map = { center: { latitude: parseFloat(results.lat), longitude: parseFloat(results.lng) }, zoom: 14 };
    
    $scope.marker = {
      id: 0,
      coords: {
        latitude: results.lat,
        longitude: results.lng
      },
      options: {},
      events: {
      }
    };
    var intervalPing = function() {
      getCurrentPosition(function(err, result) {
        if (err) { console.log(err); }
        Ping.get({
          currentLat: result.lat,
          currentLon: result.lng
        }, function(result) {
          console.log(result);
          if (result.directions) {
            $scope.directions = result.directions.split('<b>').join(' ').split('</b>').join(' ');
          }
          if (result.beep && navigator.vibrate) {
            navigator.vibrate(2000);
          }
        }, function(err) {
          console.log(err);
        });
      });
    }
    $scope.grabDestination = function() {
      getCurrentPosition(function(err, result) {
        if (err) { return $scope.error1 = err; }
        if ($scope.address) {
          Init.get({
            startLat: result.lat,
            startLon: result.lng,
            address: $scope.address
          }, function(result) {
            console.log(result)
            $scope.directions = result.directions.split('<b>').join(' ').split('</b>').join(' ');
            $scope.goAway = true;
            setInterval(function() {
              intervalPing();
            }, 5000);
          }, function(err) {
            $scope.error1 = err;
            $scope.red = true;
          });
        } else {
          $scope.red = true;
        }
      });
    }

  });
  //getCurrentPosition();
}


front.controller('FrontCtrl', ['$cordovaGeolocation', '$scope', 'Init', 'Ping', Front]);
