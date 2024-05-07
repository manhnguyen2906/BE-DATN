var express = require('express');
var loggedIn = require('./loggedIn');
var requestInt = require('./request');


module.exports = function (app) {

  // expose session to views
  app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
  });

  app.use(loggedIn);
  app.use(requestInt);

}
