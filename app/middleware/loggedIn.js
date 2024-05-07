var resp = require('../response');
var jwt = require('jsonwebtoken');
var config = require('../../config/jwt');
// var db = require('../../config/database');
// var models = require('../models');
var crypto = require('crypto');

module.exports = function isLoggedIn(req, res, next) {
    let token = req.header('authorization');
    try {
        if (token) {
            let decoded = null;
            try {
                decoded = jwt.verify(token, config.secret_token);
                req.user = {
                    email: decoded.email,
                    tenant_id: decoded.tenant_id,
                    user_id: decoded.user_id,
                    role: decoded.role,
                    agent_id: decoded.agent_id,
                    access: decoded.access ? decoded.access : {}
                };
                req.log = {
                    activity: crypto.createHash('md5').update(Date.now().toString() + Math.random()).digest('hex').substring(0, 24),
                }
                next();
            } catch (err) {
                resp.forbidden(res, req, { message: err.message });
            }
        } else {
            next();
        }
    } catch (err) {
        resp.throws(res, req, err);
    }

}

