const Router = require('koa-router')
const router = new Router()
const { querySQL, returnMsg, jwtVerify } = require('../../../utils')
const moment = require('moment')
// 文章添加
router.post('/', async ctx => {
    let token = ctx.request.headers['cms-token']
    // 鉴权 除非了注册和登录其他基本都需要鉴权
    if (!jwtVerify(token)) {
        ctx.body = returnMsg(2, "token过期或不存在该用户")
        return
    }
    // 判断是否有编辑权限 同时获取修改人信息 现在的逻辑是谁修改谁就是作者  数据库应该拆字段 作者 和 修改者 或者无法修改他人文章
    let sql1 = `SELECT editable,username FROM user WHERE token="${token}"`
    let result1 = await querySQL(sql1)
    if (result1[0].editable === 1) {
        let {title, content, subTitle } = ctx.request.body
        // 判断字段
        if (!title && !content) {
            ctx.body = returnMsg(1, "缺少title或content")
            return
        }
        //添加文章 日期是前端还是后端设置
        let myDate = moment().format('YYYY-MM-DD hh:mm:ss')
        let sql2 = `INSERT INTO article VALUES (null,"${title}","${subTitle || ""}","${result1[0].username}","${myDate}","${content}")`
        await querySQL(sql2)    
        ctx.body = returnMsg(0, "文章列表添加成功")
    } else {
        ctx.body = returnMsg(2, "该用户没有编辑权限")
    }
})

module.exports = router