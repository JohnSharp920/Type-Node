
import express = require('express');
import morgan = require('morgan');
import bodyParser = require('body-parser');
import mongoose = require('mongoose');
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

app.use(express.static(__dirname + '/public'));

var api = require('./routes/api')(app, express);
app.use('/api', api);

app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/app/views/index.html');
});

http.createServer(app).listen(config.port, function()  {
    console.log('Express server listening on port ' + config.port);
});
