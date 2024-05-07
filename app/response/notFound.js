module.exports = function notFound (res,req,data, options) {

    // Set status code
    // res.status(200);
    res.json({status: 404, error:true});
};