module.exports = function(res,req,data,options){
    if(data.message){
        res.json({
            error:true,
            message:data.message
        });
    }else {
        res.json({
            error:true,
            data:data
        });
    }

}