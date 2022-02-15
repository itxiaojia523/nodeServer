const Router = require('koa-router')
const router = new Router()
const { querySQL, returnMsg } = require("../../utils")

router.post('/', async ctx => {
    // console.log(ctx.request.body)
    // 注册逻辑
    let { username, password } = ctx.request.body;
    // 1. 参数字段是否错误
    if (username && password) {
        // 2.查询是否存在该用户  封装数据库操作
        let sql = `SELECT * FROM user WHERE username = "${username}"` //注意此处需要""，node识别不出来是字符串 
        let result = await querySQL(sql)
        // 判断是否存在
        if (result.length > 0){
        ctx.body = returnMsg(2,"注册失败","该用户名已存在")
        }else{
            // 3.开始注册 头像一般让前置拼接 http://localhost:9000/images/avatar.jpg 
            // 0表不可编辑
            // normal表普通用户 manager表管理员
            let sql1 = `INSERT INTO user VALUES (null,"${username}","${password}",null,"avatar.jpg","normal",0)`
            await querySQL(sql1) //这个返回结果没用
            ctx.body = returnMsg(0,"注册成功")
            
        }
    } else {
        ctx.body = returnMsg(1, "请求失败", "参数字段有误")  //返回消息封装 应该返回{ message: '参数字段错误',...}
    }
})

module.exports = router