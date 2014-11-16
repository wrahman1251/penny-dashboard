//var maps = require("/lib/map.js");
var map = require('googlemaps');


//globals:
//full path (just incase)
//current path data (steps) initialized by endpoint initialization
//current location (lat/long)
//header
var path;
var currstep;
var stepIdx = 0;
var startplace, endplace;
var lat, lng, head;


function getcurrPosition(latitude, longitude, heading) {
	var geo = cordovaGeolocation.getCurrentPosition();
	latitude = geo.coords.latitude;
	longitued = geo.coords.longitude;
	heading = geo.coords.heading;
}

//endpoint initialization:
//begin route
//get begin (current location), endpoint, reset current path
function init(startCoords, endCoords) {
	if (startCoords == null) {
		var startlat, startlng, heading;
		getcurrPosition(startlat, startlng, heading);
		startplace = '(' + startlat + ',' + startlng + ')';
	}
	else {
		startplace = startCoords;
	}

	endlace = endCoords;
	map.directions(startplace, endplace, result);
	path = result.routes[0].legs[0].steps;
	currstep = path[stepIdx];
}

//function
//post geolocation info (header and lat/long)
//compare against next step and current header of step
//send out to imp update & myo buzz
function {
	
}
