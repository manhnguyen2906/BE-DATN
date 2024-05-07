'use strict';

const ok = require('./ok');
const badRequest = require('./badRequest');
const created = require('./created');
const forbidden = require('./forbidden');
const accessDenied = require('./accessDenied');
const notFound = require('./notFound');
const serverError = require('./serverError');

var throws = function(res, req, err, options) {
    var useragent = require('useragent');
    var agent = useragent.parse(req.headers['user-agent']);
    if(err && typeof err.show != 'undefined'){
        badRequest(res,req,err,options);
    }else {
        serverError(res,req,err,options);
    }
};

module.exports = {
    sendOK: ok,
    babRequest:badRequest,
    accessDenied:accessDenied,
    created:created,
    forbidden:forbidden,
    notFound:notFound,
    serverError:serverError,
    throws:throws
}