'use strict';
(require('rootpath')());

var async = require('async');
var map = require('lib/map');
var imp = require('lib/electricImp');
var timeout = require('config/settings/secrets').timeout;
imp.turnOffLeft();
imp.turnOffRight();

//get request must have params: startLat, startLon, endLat, endLon
//sends message to client with initial directions

function init(req, res, next) {
  if (req.query.address) {
    imp.sendAddressWithUnderscores(req.query.address);
  }
  map.init(req.query.startLat, req.query.startLon, req.query.endLat, req.query.endLon, function(err, result) {
    if (err) { return next(err); }
    res.send({directions: result, endLat: req.query.endLat, endLon: req.query.endLon});
  });
}

//send obj with fields beep and instructions
function ping(req, res, next) {
  map.ping(req.query.currentLat, req.query.currentLon, function(err, result) {
    if (err) { return next(err); }
    if (!result) {
      res.send(null)
    } else {
      if (!result.leftOrRight) {
        imp.turnOffLeft();
        imp.turnOffRight();
      } if (result.leftOrRight === 'left') {
        var f1 = function(callback) {
          imp.turnOnLeft();
          setTimeout(function() {imp.turnOffLeft(); 
            setTimeout(function() {
              callback(null);
            }, timeout); }, timeout)
        };
        async.waterfall(
        [
          f1, f1, f1, f1, f1
        ],
        function(err) {

        });
      } else if (result.leftOrRight === 'right') {
        var f2 = function(callback) {
          imp.turnOnRight();
          setTimeout(function() {imp.turnOffRight(); setTimeout(function() {
              callback(null);
            }, timeout);}, timeout)
        };
        async.waterfall(
        [
          f2, f2, f2, f2, f2
        ],
        function(err) {

        });
      }
      var sendObj = {};
      if (result.beep) {
        sendObj.beep = result.beep;
      }
      if (result.message) {
        sendObj.directions = result.message;
      }
      res.send(sendObj);
    }
  });
}

exports.init = init;
exports.ping = ping;