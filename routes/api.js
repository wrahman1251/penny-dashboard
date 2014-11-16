//routes for serving JSON
'use strict';
(require('rootpath')());

module.exports = function(app) {
  var route = require('controllers/route');
  app.get('/init', route.init);
  app.get('/ping', route.ping);
}