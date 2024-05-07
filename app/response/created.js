module.exports = function created (res,req,data, options) {

    // Set status code
    // res.status(200);

    res.json({status: 200, error:false, data: data});

};