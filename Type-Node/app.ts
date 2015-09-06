
import express = require('express');
import morgan = require('morgan');
import bodyParser = require('body-parser');
import mongoose = require('mongoose');

import routes = require('./routes/index');
import myRoutes = require('./routes/myIndex');
import user = require('./routes/user');
import http = require('http');
import path = require('path');
import config = require("./config");


var app = express();

mongoose.connect(config.database, err => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to the database");
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// all environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


import stylus = require('stylus');
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

var api = require('./routes/api')(app, express);
app.use('/api', api);

app.get('/', myRoutes.myIndex);
//app.get('/users', user.list);


http.createServer(app).listen(config.port, function()  {
    console.log('Express server listening on port ' + config.port);
});
