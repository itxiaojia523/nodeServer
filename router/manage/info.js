// 用户信息接口 包括（查询 修改）
const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const router = new Router()
const {querySQL,returnMsg, jwtVerify} = require('../../utils')
// 查询用户信息
router.get('/',async ctx => {
    // 1. 获取token 从请求头获取
    // 读取图片和文件 要设置响应头 其他时候基本不用
    let token = ctx.request.headers['cms-token']
    // 鉴权 除非了注册和登录其他基本都需要鉴权
    if (!jwtVerify(token)){
        ctx.body = returnMsg(2,"token过期或不存在该用户")
        return
    }
    // 查询用户信息
    let sql = `SELECT username,avatar,token FROM user WHERE token = "${token}"`
    let result = await querySQL(sql)
    ctx.body = result[0]
})

// 修改用户信息
router.post('/', async ctx =>{
    // 收到username, password, token
    // 1.鉴权
    let token = ctx.request.headers['cms-token']
    console.log(token);
    if(!jwtVerify(token)){
        ctx.body = returnMsg(2,"token过期或该用户不存在")
        return;
    }
    // 2.校验字段
    let {username,password} = ctx.request.body;
    // 检索防止重名
    let sql22 = `SELECT * FROM user WHERE username = "${username}"`
    let result22 = await querySQL(sql22)
    if(result22.length > 0){
        ctx.body = returnMsg(2,"用户名已存在")
        return
    }

    // 最好强制要求必须传 不然其中一个是undefined
    // 或者后端根据获取 1.jwt（不靠谱） 2.根据字段username/password
    let sql2 = `SELECT username,password FROM user WHERE token = "${token}"`
    let result2 = await querySQL(sql2)
    let user = result2[0]

    let sql = `UPDATE user SET username='${username || user.username}',password='${password || user.username}' WHERE token='${token}'`
    await querySQL(sql)

    // 3.修改用户名或密码 重新查询
    let sql1 = `SELECT username,token,avatar FROM user WHERE token = "${token}"`
    let result1 = await querySQL(sql1)
    
    ctx.body = returnMsg(0,"修改成功",{
        avatar: result1[0].avatar,
        username: result1[0].username,
        "cms-token":result1[0].token
    })
})

module.exports = router