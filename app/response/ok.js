module.exports = function(res,req,data,options){
    res.json({
        error: false,
        status:200,
        data: data ? data : null,
        meta:options
    })

}