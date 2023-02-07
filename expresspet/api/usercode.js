// 引入数据库连接
var dbConfig = require('../util/dbconfig')
// import { nanoid } from 'nanoid';
// 验证手机号和密码
verPhoneAndPass=(req,res)=>{
    let phone=req.query.phone;
    let password=req.query.password;
    let sql = 'select * from user where phone=? and password=?';
    let sqlArr =[phone,password]
    let callBack = (err,data)=>{
        if(err){
            res.send({
                'code':400,
                'msg':'出错'
            })
        }else if(data==''){
            res.send({
                'code':400,
                'msg':'用户名或者密码错误'
            })
        }else{
            res.send({
                'code':200,
                'msg':'登录成功',
                'token':data[0].id
            })
        }
    }
    dbConfig.sqlConnect(sql,sqlArr,callBack);
}
// 通过token获取用户数据
getUserInfo=(req,res)=>{
    let userid=req.query.token;
    let sql = 'select * from user where id=?';
    let sqlArr =[userid]
    let callBack = (err,data)=>{
        if(err){
            res.send({
                'code':400,
                'msg':'出错'
            })
        }else if(data==''){
            res.send({
                'code':400,
                'msg':'获取失败'
            })
        }else{
            res.send({
                'code':200,
                'msg':'获取成功',
                'user':data[0]
            })
        }
    }
    dbConfig.sqlConnect(sql,sqlArr,callBack);
}
// 生成四位随机数
function rand(min,max){
    return Math.floor(Math.random()*(max-min))+min
}
// 未注册的手机号和验证码
validatePhoneCode = []
// 已注册手机号和验证码、id
reguserPhoneCode=[]
// 发送注册验证码
sendCode=(req,res)=>{
    let phone = req.query.phone;
        let code = rand(1000,9999);
        validatePhoneCode.push({
            'phone':phone,
            'code':code,
        })
        res.send({
            'code':200,
            'msg':'获取成功',
            'data':code
        })
}
// 发送未注册手机验证码
sendNoregCode=(req,res)=>{
    let phone= req.query.phone;
    let sql = 'select * from user where phone=?';
    let sqlArr = [phone];
    let callBack = (err,data)=>{
        if(err){
            res.send({
                'code':400,
                'msg':'出错'
            })
        }else if(data==''){
            sendCode(req,res);
        }else{
            res.send({
                'code':400,
                'msg':'号码已注册',
            })
        }
    }
    dbConfig.sqlConnect(sql,sqlArr,callBack);
}
// 发送已注册验证码
sendRegCode=(res,phone,userid)=>{
    let code = rand(1000,9999)
    reguserPhoneCode.push({
        'phone':phone,
        'code':code,
        'userid':userid,
    })
    // console.log(reguserPhoneCode[0])
    res.send({
        'code':200,
        'phone':phone,
        'data':code,
    })
}
// 已注册的手机号直接返回验证码
resPhoneCode=(req,res)=>{
    let phone = req.query.phone;
    var sql = "select * from user";
    var sqlArr = [];
    var user;
    var callBack = (err,data)=>{
        if(err){
            console.log('连接出错')
        }else{
            user=data;
            for(let i=0;i<user.length;i++){
                    if(user[i].phone==phone){
                        // 发送验证码并进行保存
                        sendRegCode(res,phone,user[i].id)
                        return
                    }
                }
                res.send({
                    'code':200,
                    'phone':phone,
                    'data':'该手机未注册',
                })
        }
    }
    dbConfig.sqlConnect(sql,sqlArr,callBack);

}
// 验证手机号和验证码
findUserByPhone=(req,res)=>{
    let phone = req.query.phone;
    let code = req.query.code;
    // console.log(reguserPhoneCode[0])
    for(let i=0;i<reguserPhoneCode.length;i++){
        if(reguserPhoneCode[i].phone==phone && reguserPhoneCode[i].code==code){
            res.send({
                'code':200,
                'msg':'验证成功',
                'token':reguserPhoneCode[i].userid
            })
            return
        }
    }
    res.send({
        'code':200,
        'msg':'验证失败',
    })
}
// 注册
regisUser=(req,res)=>{
    
    var ress = async (req)=>{
        let name=req.query.name;
        let phone = req.query.phone;
        let password = req.query.password;
        let id=req.query.userid;
        let time=new Date()
        let sql = 'insert into user(id,username,password,phone,createtime) values(?,?,?,?,?)' ;
        let sqlArr = [id,name,password,phone,time];
        let results = await dbConfig.SySqlConnect(sql,sqlArr);
        if(results.affectedRows == 1){
            // 注册成功获取用户信息返回
            let user = await getuserinfobyphone(phone,password);
            if(user.affectedRows == 1){
                return user[0].id;
            }else{
                return false;
            }
        }else{
            return false
        }
    }
    
    let token = ress(req).then;
    console.log(token[0])
    res.send({
                'code':200,
                'msg':'注册成功',
                'token':token[0]
            })
    // if(token[0].id){
    //     res.send({
    //         'code':200,
    //         'msg':'注册成功',
    //         'token':token
    //     })
    // }else{
    //     res.send({
    //         'code':400,
    //         'msg':'注册失败'
    //     })
    // }
}
// 直接通过账号密码获取用户信息
getuserinfobyphone=(phone,password)=>{
    let sql = 'select * from user where phone=? and password=?';
    let sqlArr = [phone,password];
    return dbConfig.SySqlConnect(sql,sqlArr);
}
module.exports = {
    sendCode,
    resPhoneCode,
    findUserByPhone,
    verPhoneAndPass,
    getUserInfo,
    sendNoregCode,
    regisUser
}