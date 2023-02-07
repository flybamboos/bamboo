const Helloapi = require('../api/hello')
const age = require('../api/age')
const usercode = require('../api/usercode')
module.exports = {
    useRouter(app){
        // verificationPhone
        // app.post('/api/usercode',usercode.verificationPhone),
        // 通过手机号获取验证码
        app.post('/api/user/getphonecode',usercode.resPhoneCode),
        // 验证手机号和验证码返回token
        app.post('/api/user/findUserByPhone',usercode.findUserByPhone),
        // 验证手机号和密码返回用户数据
        app.post('/api/user/findUserByPassword',usercode.verPhoneAndPass),
        // 获取用户信息
        app.post('/api/user/getuserinfo',usercode.getUserInfo),
        // 未注册手机号获取验证码
        app.post('/api/user/getnoregcode',usercode.sendNoregCode)
        // 用户注册
        app.post('/api/user/registuser',usercode.regisUser)
    }
}