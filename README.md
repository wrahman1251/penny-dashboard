~~~ Template Application: Node.js with Expressjs 4.x, AngularJS, MySQL, and Sass~~~
=========

Prerequisites
---------------
- [Node.js](http://nodejs.org)
- [Bower](http://bower.io/)

Getting Started
---------------
Edit the information in config/settings/secrets.js for the database

run these commands before starting server (only need to do once):

npm install

bower install

sudo npm install -g cordova

cordova plugin add org.apache.cordova.geolocation

to run server:

node app.js
#point the browser to localhost:3000 to visit the site
```

Project Structure
-----------------

File structure:

    app.js              --> main point of entry
    config/             --> various configurations for app
    controllers/        --> controllers for api and updating data
    lib/                --> user defined libraries
    models/             --> data model containing CRUD (create update read delete) for database
    node_modules/       --> modules for node npm installed
    package.json        --> for npm
    public/             --> all of the files to be used in on the client side
      css/              --> css files
        main.css         --> default stylesheet
      img/              --> image files
      js/               --> javascript files
        app.js          --> declare top-level app module
        controllers.js  --> application controllers
        directives.js   --> custom angular directives
        filters.js      --> custom angular filters
        services.js     --> custom angular services
        lib/            --> angular and 3rd party JavaScript libraries
          angular/
            angular.js            --> the latest angular js
            angular.min.js        --> the latest minified angular js
            angular-*.js          --> angular add-on modules
            version.txt           --> version number
    routes/
      api.js            --> route for serving JSON
      index.js          --> route for serving HTML pages and partials
    views/
      index.html        --> main page for app
      layout.html       --> doctype, title, head boilerplate
      partials/         --> angular view partials
        partial1.html
        partial2.html
    test/               --> mocha tests


phone ping server ping maps api (get direction) -> send to electric imp, flash led






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