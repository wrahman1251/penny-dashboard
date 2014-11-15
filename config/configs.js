'use strict';
(require('rootpath')());

var bodyParser = require('body-parser');
var cookieparser = require('cookie-parser');
var compress = require('compression');
var express = require('express');
var flash = require('connect-flash');
var helmet = require('helmet');
var methodOverride = require('method-override');
var morgan = require('morgan');
var path = require('path');
var passport = require('passport');
var session = require('express-session');
var settings = require('./settings/exports');

//exported configurations
var config = {
  configure: function(app) {
    app.use(helmet());
    app.use(morgan('short'));

    //configure handlebars
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'html');
    app.engine('html', require('ejs').renderFile);

    app.use(express.static(path.join(__dirname, '../public')));
    app.use(compress());
    app.use(bodyParser());
    app.use(cookieparser());
    app.use(methodOverride());
    app.use(session({
      secret: settings.secrets.sessionSecret,
      key: 'sid'
    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
  },
  passport: passport,
  settings: settings
}

module.exports = config;