var express = require('express');
var app = express();

var port = process.env.port_server || 3838;
var server = require('http').createServer(app);
var middleware = require('./app/middleware');
var routes = require('./app/routes');
var path = require('path');
var colors = require('colors');
var bodyParser = require('body-parser')
const databaseMongoose = require('./config/connect')
const cors = require('cors');

const _ = require('underscore');
// const moment = require('moment');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

global._ = _;
global.path = path
// global._moment = moment;
global.mongodb = require('mongodb');
_.mixin(_.extend(require('underscore.string').exports(), require(path.join(__dirname, 'app', 'lib', 'utils'))));

databaseMongoose()

middleware(app);
try {
    routes(app);
} catch (err) {
    console.log(err);
}

server.listen(port);
console.log('Server is running on '.red + port);
exports = module.exports = app;