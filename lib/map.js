// var map = require('googlemaps');
// console.log(map.directions);
// map.directions('(40.3472894,-74.657003)', '(40.3528412,-74.6541169)', function(err, result) {
//   //err ? console.log(err) : console.log(result);
//   console.log(result.routes[0].legs[0].steps);
// }, false, 'walking');
var map = require('googlemaps');
var steps, currentLatitude, currentLongitude, endLatitude, endLongitude;
var nextStepIndex = 0;
var previousLat = null, previousLon = null;
var thresholdDistance = 0.001;
var thresholdDistance1 = thresholdDistance1*1.5;

//callback result: lat, lng
function getLatAndLng(address, callback) {
  map.geocode(address, function(err, result) {
    if (err) { return callback(err); }
    callback(null, result.results[0].geometry.location);
  });
}

function createCoords(lat, lon) {
  return '('+lat+','+lon+')';
}

function leftOrRight(instructions) {
  var rightOrLeft = instructions.split('<b>');
  if (rightOrLeft && rightOrLeft[1]) {
    rightOrLeft = rightOrLeft[1].split('</b>')[0];
  } else {
    rightOrLeft = null;
  }
  return rightOrLeft;
}
/**
 * [init description]
 * @param  {string}   startLat  [description]
 * @param  {string}   startLong [description]
 * @param  {[type]}   endLat    [description]
 * @param  {[type]}   endLong   [description]
 * @param  {Function} callback  [description]
 * @return {[type]}             [description]
 */
function init(startLat, startLon, endLat, endLon, callback) {
  endLatitude = parseFloat(endLat);
  endLongitude = parseFloat(endLon);
  previousLat = parseFloat(startLat);
  previousLon = parseFloat(startLon);
  map.directions(
    createCoords(startLat, startLon),
    createCoords(endLat, endLon),
    function(err, result) {
      if (err || !result) { return callback(err); }
      currentLatitude = parseFloat(startLat);
      currentLongitude = parseFloat(startLon);
      steps = result.routes[0].legs[0].steps;
      console.log(steps);
      callback(null, steps[0].html_instructions);
    },
    false,
    'walking');
}

var getDistance = function (lat1, lon1, lat2, lon2) {
  return Math.sqrt((lat2 - lat1)*(lat2 - lat1) + (lon2-lon1)*(lon2-lon1));
}

//returns bool
function isFartherAwayNow() {
  if (previousLon && previousLat) {
    if (getDistance(
      previousLat,
      previousLon,
      steps[nextStepIndex].end_location.lat,
      steps[nextStepIndex].end_location.lng) + thresholdDistance
      < getDistance(
        currentLatitude, 
        currentLongitude, 
        steps[nextStepIndex].end_location.lat, 
        steps[nextStepIndex].end_location.lng)) {
        return true;
      } else {
        return false;
      }
  }
}

function ping(currentLat, currentLon, callback) {
  previousLat = currentLat;
  previousLon = currentLon;
  //console.log(currentLon);
  currentLat = parseFloat(currentLat);
  currentLon = parseFloat(currentLon);
  if (getDistance(currentLat, currentLon, endLatitude, endLongitude) < thresholdDistance) {
    return callback(null, {
      beep: true,
      message: 'You\'ve arrived at your destination',
    });
  } else if (getDistance(currentLat, currentLon, steps[nextStepIndex].end_location.lat, steps[nextStepIndex].end_location.lng) < thresholdDistance) {
    ++nextStepIndex;
    return callback(null, {
      beep: true, 
      message: steps[nextStepIndex].html_instructions,
      leftOrRight: leftOrRight(steps[nextStepIndex].html_instructions)
    });
  } else if (isFartherAwayNow()) {
    return callback(null, {
      beep: true,
      message: 'You\'re moving farther away from your destination'
    });
  } else {
    callback(null);
  }
}

exports.getLatAndLng = getLatAndLng;
exports.init = init;
exports.ping = ping;

/**

http://localhost:3000/init1?startLat=40.3472894&startLon=-74.657003&endLat=40.3449501&endLon=-74.6507596
http://localhost:3000/ping?currentLat=40.3467508&currentLon=-74.6569248
http://localhost:3000/ping?currentLat=40.3467209&currentLon=-74.6572882
http://localhost:3000/ping?currentLat=40.3464169&currentLon=-74.6568455
http://localhost:3000/ping?currentLat=40.3463783&currentLon=-74.6568526
http://localhost:3000/ping?currentLat=40.3460509&currentLon=-74.6559683
http://localhost:3000/ping?currentLat=40.3458492&currentLon=-74.6559085
http://localhost:3000/ping?currentLat=40.345616&currentLon=-74.6550474
http://localhost:3000/ping?currentLat=40.3445167&currentLon=-74.6541769
http://localhost:3000/ping?currentLat=40.3442933&currentLon=-74.65402809999999
http://localhost:3000/ping?currentLat=40.3439859&currentLon=-74.6528275
http://localhost:3000/ping?currentLat=40.3449501&currentLon=-74.6507596

[ { distance: { text: '102 ft', value: 31 },
    duration: { text: '1 min', value: 22 },
    end_location: { lat: 40.3467209, lng: -74.6572882 },
    html_instructions: 'Head <b>west</b> on <b>Class of 1975 Walk</b>',
    polyline: { points: 'efguFvltfMDhA' },
    start_location: { lat: 40.3467508, lng: -74.6569248 },
    travel_mode: 'WALKING' },
  { distance: { text: '171 ft', value: 52 },
    duration: { text: '1 min', value: 33 },
    end_location: { lat: 40.3464169, lng: -74.6568455 },
    html_instructions: 'Turn <b>left</b> toward <b>Guyot Ln</b>',
    maneuver: 'turn-left',
    polyline: { points: '_fguF`otfMNKLMHKHM@K@E@CBM' },
    start_location: { lat: 40.3467209, lng: -74.6572882 },
    travel_mode: 'WALKING' },
  { distance: { text: '13 ft', value: 4 },
    duration: { text: '1 min', value: 3 },
    end_location: { lat: 40.3463783, lng: -74.6568526 },
    html_instructions: 'Turn <b>right</b> toward <b>Guyot Ln</b>',
    maneuver: 'turn-right',
    polyline: { points: 'cdguFhltfMF?' },
    start_location: { lat: 40.3464169, lng: -74.6568455 },
    travel_mode: 'WALKING' },
  { distance: { text: '279 ft', value: 85 },
    duration: { text: '1 min', value: 50 },
    end_location: { lat: 40.3460509, lng: -74.6559683 },
    html_instructions: 'Turn <b>left</b> toward <b>Guyot Ln</b>',
    maneuver: 'turn-left',
    polyline: { points: '{cguFhltfM@C@EDMX{@HQDI@KBIHc@AE' },
    start_location: { lat: 40.3463783, lng: -74.6568526 },
    travel_mode: 'WALKING' },
  { distance: { text: '108 ft', value: 33 },
    duration: { text: '1 min', value: 19 },
    end_location: { lat: 40.3458492, lng: -74.6559085 },
    html_instructions: 'Slight <b>right</b> toward <b>Guyot Ln</b>',
    maneuver: 'turn-slight-right',
    polyline: { points: 'yaguFxftfMV_@BA@?@BFP' },
    start_location: { lat: 40.3460509, lng: -74.6559683 },
    travel_mode: 'WALKING' },
  { distance: { text: '282 ft', value: 86 },
    duration: { text: '1 min', value: 51 },
    end_location: { lat: 40.345616, lng: -74.6550474 },
    html_instructions: 'Turn <b>left</b> toward <b>Guyot Ln</b>',
    maneuver: 'turn-left',
    polyline: { points: 'q`guFlftfM@_@@C?ABCXSFE@E@I?UAW?EAU?E@C@C' },
    start_location: { lat: 40.3458492, lng: -74.6559085 },
    travel_mode: 'WALKING' },
  { distance: { text: '472 ft', value: 144 },
    duration: { text: '2 mins', value: 92 },
    end_location: { lat: 40.3445167, lng: -74.6541769 },
    html_instructions: 'Continue onto <b>Guyot Ln</b>',
    polyline: { points: 'c_guF`atfM^Wf@_@RMZUj@_@p@c@@A@A@A?A?A?A?A' },
    start_location: { lat: 40.345616, lng: -74.6550474 },
    travel_mode: 'WALKING' },
  { distance: { text: '92 ft', value: 28 },
    duration: { text: '1 min', value: 18 },
    end_location: { lat: 40.3442933, lng: -74.65402809999999 },
    html_instructions: 'Slight <b>right</b> toward <b>Streicker Bridge</b>',
    maneuver: 'turn-slight-right',
    polyline: { points: 'gxfuFr{sfMl@]' },
    start_location: { lat: 40.3445167, lng: -74.6541769 },
    travel_mode: 'WALKING' },
  { distance: { text: '374 ft', value: 114 },
    duration: { text: '1 min', value: 75 },
    end_location: { lat: 40.3439859, lng: -74.6528275 },
    html_instructions: 'Turn <b>left</b> toward <b>Streicker Bridge</b>',
    maneuver: 'turn-left',
    polyline: { points: 'yvfuFtzsfMCSAGAc@@YB]D[FSHULSJQFEBE' },
    start_location: { lat: 40.3442933, lng: -74.65402809999999 },
    travel_mode: 'WALKING' },
  { distance: { text: '495 ft', value: 151 },
    duration: { text: '2 mins', value: 116 },
    end_location: { lat: 40.34456309999999, lng: -74.65133399999999 },
    html_instructions: 'Take the pedestrian overpass',
    polyline: { points: '}tfuFdssfMAYCSAOAKG_@KUEOEKAAEEEGKOGGSQGGEECEAEAG?K?WBO' },
    start_location: { lat: 40.3439859, lng: -74.6528275 },
    travel_mode: 'WALKING' } ]


 */