'use strict';

// var user = require('./users');
// var comment = require('./comment');
var product = require('./product');
var brand = require('./brand');
var user = require('./user');
var size = require('./size');
var cart = require('./cart');
var oder = require('./oder');
var statistical = require('./statistical');

module.exports = function (app) {

    // user(app);
    // comment(app)

    app._router.stack.forEach(function (r) {
        if (r.route && r.route.path) {
            var keys = Object.keys(r.route.methods);
            keys.forEach(function (key) {
                console.log(key + ' - ' + r.route.path);
            })
        }
    })
    product(app)
    brand(app)
    user(app)
    size(app)
    cart(app)
    oder(app)
    statistical(app)

};