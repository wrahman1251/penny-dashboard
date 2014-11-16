//file used to load other routes
'use strict';
(require('rootpath')());

var express = require('express');
var app = module.exports = express();
var configs = require('config/configs');
configs.configure(app);

//configure endpoints:
require('routes/api')(app);
require('routes/index')(app);

var errorHandler = require('controllers/errorhandler').errorHandler;
app.use(errorHandler);

app.listen(configs.settings.secrets.port);
console.log('listening on port ' + configs.settings.secrets.port);