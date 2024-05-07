var resp = require('../response');

module.exports = function (req, res, next) {

        const Joi = require('joi');

        const schema = Joi.object().keys({
            limit: Joi.number().min(0).max(500),
            offset: Joi.number().min(0),
            fields: Joi.string().regex(/^[a-zA-Z0-9/,/_]{2,30}$/),
            desc: Joi.string().regex(/^[a-zA-Z0-9/,/_]{2,30}$/),
            asc: Joi.string().regex(/^[a-zA-Z0-9/,/_]{2,30}$/)
        });

        console.log(req.originalUrl,req.method);

        const {error, result} = schema.validate(req.query,{allowUnknown:true});
        if(error){
            console.log(error);
            resp.babRequest(res,req,error.message);
        }else {
            next();
        }

}
