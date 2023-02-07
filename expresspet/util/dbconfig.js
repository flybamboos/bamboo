const mysql = require('mysql');
module.exports = {
    // 配置数据库
    config:{
        host:'localhost',
        port:'3306',
        user:'root',
        password:'123456',
        database:'petadopt',
    },
    // 连接数据库，使用连接池的方式
    sqlConnect:function(sql,sqlArr,callBack){
        var pool = mysql.createPool(this.config)
        pool.getConnection((err,conn)=>{
            if(err){
                console.log(err);
                return;
            }
            // 事件驱动回调
            conn.query(sql,sqlArr,callBack);
            // 释放连接
            conn.release();
        })
    },
    SySqlConnect:function(sySql,sqlArr){
        return new Promise((resolve,reject)=>{
            var pool = mysql.createPool(this.config)
            pool.getConnection((err,conn)=>{
            if(err){
                reject(err)
            }else{
                conn.query(sySql,sqlArr,(err,data)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(data)
                    }
                });
                conn.release();
            }
        })
        }).catch((err)=>{
            console.log(err)
        })
    }
}