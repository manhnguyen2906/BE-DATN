var resp = require('../response');
var models = require('../models');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const jwtConf = require('../../config/jwt');

module.exports = function checkPermission(req, res, next) {
    const authHeader = req.header('Authorization');
    if (authHeader) {
        //const token = authHeader.split(' ')[1];
        const token = authHeader;
        jwt.verify(token, jwtConf.secret_token, (err, user) => {
            if (err) {
                return resp.forbidden(res, req, user);
            }
            req.user = user;
            next();
        });
    } else {
        resp.babRequest(res, req, 'Khong co tuc cun');
    }
}