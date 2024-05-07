module.exports = function serverError (res,req,data, options) {

    // Get access to `req`, `res`, & `sails`
    
    res.json({ 
        error: true,
        status:500,
        data: data ? data : null,
        });



};
