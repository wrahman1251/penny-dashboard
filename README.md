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

sass public/css/main.scss > public/css/main.css

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