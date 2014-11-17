~~~ Penny Skateboard Navigation Dashboard~~~
=========

HackPrinceton Fall 2014 Awards
------------------------------
- [3rd place hardware hack](http://challengepost.com/software/dash-lqumf)
- [Best use of Twitter Api](http://challengepost.com/software/dash-lqumf)

Prerequisites
---------------
- [Node.js](http://nodejs.org)
- [Bower](http://bower.io/)

Getting Started (just for the UI)
---------------
Edit the information in config/settings/secrets.js

run these commands before starting server (only need to do once):

npm install

bower install

to run server:

node app.js
#point the browser to localhost:3000 to visit the site
```

Getting Started (Full Functionality)
-----------------
need: electric imp, penny board, some leds
currently only supports 1 user (didn't have time for multiple users)
tba


Project Structure
-----------------

File structure:

    app.js              --> main point of entry
    config/             --> various configurations for app
    controllers/        --> controllers for api and updating data
    lib/                --> user defined libraries
    node_modules/       --> modules for node npm installed
    package.json        --> for npm
    public/             --> all of the files to be used in on the client side
      css/              --> css files
        style.css         --> default stylesheet
      img/              --> image files
      js/               --> javascript files
        controllers/    --> controllors
        vendor/         --> 3rd party libraries
        bower_components/        --> angular and its add-on modules
    routes/
      api.js            --> route for serving JSON
      index.js          --> route for serving HTML pages and partials
    views/
      index.html        --> main page for app
      partials/         --> angular view partials
        partial1.html
        partial2.html
    test/               --> mocha tests


phone ping server ping maps api (get direction) -> send to electric imp, flash led






