module.exports = function forbidden (res,req,data, options) {

    // Get access to `req`, `res`, & `sails`

    // Set status code
    // res.status(401);
    if(data.message){
        res.json({status: 401,error:true,message:data.message});
    }else {
        res.json({status: 401,error:true,data:data});
    }
};