'use strict';

var front = angular.module('controllers.front', ['ngCordova.plugins.geolocation','ui.map','ui.event']);

function initFactory($resource) {
  return $resource('/init');
}
front.factory('Init', ['$resource', initFactory]);

function pingFactory($resource) {
  return $resource('/ping');
}

front.factory('Ping', ['$resource', pingFactory]);

function Front($cordovaGeolocation, $scope, Init, Ping) {
  // $(window).resize(function(){
  //   var height = $(window).height() - $('.directive').outerHeight() - $('.top-bar').outerHeight();
  //   $('.map iframe').attr('height',height);
  // });
  $scope.address;
  $scope.red = false;
  $scope.goAway = false;
  $scope.error1 = null;
  $scope.directions = null;
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
    })
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

    var ll;
    $scope.mapOptions;
    getCurrentPosition(function(err, result) {
      if (err) {return err; }
      ll = new google.maps.LatLng(parseFloat(result.lat), parseFloat(result.lng));
      $scope.mapOptions = {
        center: ll,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
    });

    //Markers should be added after map is loaded
    $scope.onMapIdle = function() {
        if ($scope.myMarkers === undefined){    
            var marker = new google.maps.Marker({
                map: $scope.myMap,
                position: ll
            });
            $scope.myMarkers = [marker, ];
        }
    };

    $scope.markerClicked = function(m) {
        window.alert("clicked");
    };
  }

  //getCurrentPosition();
}


front.controller('FrontCtrl', ['$cordovaGeolocation', '$scope', 'Init', 'Ping', Front]);
