//routes for serving JSON
'use strict';
(require('rootpath')());

var map = require('lib/map');

module.exports = function(app) {
  var route = require('controllers/route');
  app.get('/init1', route.init);
  app.get('/ping', route.ping);
  app.get('/init', function(req, res, next) {
    map.getLatAndLng(req.query.address, function(err, result) {
      if (err) { return next(err); }
      // req.query.startlan = '40.3514267';
      // req.query.startLon = '-74.6582797';
      req.query.endLat = result.lat;
      req.query.endLon = result.lng;
      route.init(req, res, next);
    })
  });
}