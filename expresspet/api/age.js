var dbConfig = require('../util/dbconfig')
module.exports = {
    getage:function(req,res){
        var sql = "select * from user";
        var sqlArr = [];
        var callBack = (err,data)=>{
            if(err){
                console.log('连接出错')
            }else{
                res.send({
                    'list':data
                })
            }
        }
        dbConfig.sqlConnect(sql,sqlArr,callBack)

    }
}