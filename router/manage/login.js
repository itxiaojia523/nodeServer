const Router = require('koa-router')
const router = new Router()
const { querySQL, returnMsg } = require("../../utils")
const jwt = require('jsonwebtoken')

// 此时/ 表login
router.post('/', async ctx => {
    // console.log(ctx.request.body)
    let { username, password } = ctx.request.body
    // 登录逻辑 1.判断参数字段
    if (username, password) {
        // 2.查询 判断是否有该用户
        let sql = `SELECT * FROM user WHERE username = "${username}"`
        const result = await querySQL(sql) // [{}]
        if (result.length > 0) {
            // 3.存在用户 判断密码
            if (result[0].password === password) {
                // 根据username password生成token 并存储
                let token = jwt.sign(
                    { username, password }, //携带信息
                    'ITxiaojia523',//签名
                    { expiresIn: '1h' } //有效期
                )
                let sql1 = `UPDATE user SET token= '${token}' WHERE username='${username}'`
                await querySQL(sql1)
                // 4.重新查询获取信息并返回 不该返回password 等
                const result1 = await querySQL(sql)
                let obj = {
                    username:result1[0].username,
                    // 防止token冲突
                    "cms-token":result1[0].token,
                    avatar:result1[0].avatar,
                    player:result1[0].player,
                    editable:result1[0].editable
                }
                ctx.body = returnMsg(0, "登录成功",obj)

            } else {
                ctx.body = returnMsg(2, "用户名或密码错误")
            }

        } else {
            ctx.body = returnMsg(2, "该用户不存在，请先注册")
        }

    } else {
        ctx.body = returnMsg(1, "参数字段错误")
    }

})

module.exports = router