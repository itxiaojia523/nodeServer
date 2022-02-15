const Router = require('koa-router')
const router = new Router()
const { querySQL, returnMsg, jwtVerify } = require('../../../utils')
const moment = require('moment') //数据库
// 文章修改（编辑） 和 文章添加
router.post('/', async ctx => {
    // 前端传文章的id过来，返回 title sub content，date
    let token = ctx.request.headers['cms-token']
    // 鉴权 除非了注册和登录其他基本都需要鉴权
    if (!jwtVerify(token)) {
        ctx.body = returnMsg(2, "token过期或不存在该用户")
        return
    }
    // 1.判断是否有编辑权限 同时获取修改人信息 现在的逻辑是谁修改谁就是作者  数据库应该拆字段 作者 和 修改者 或者无法修改他人文章
    let sql1 = `SELECT editable,username FROM user WHERE token="${token}"`
    let result1 = await querySQL(sql1)

    if (result1[0].editable === 1) {
        let { id,title,subTitle,content } = ctx.request.body
        // if(id && title){
        //     
        // }else{
            // ctx.body = returnMsg(1,"缺少id或title")
        //     return
            // }
        // 2.查询是否存在该文章
        let sql = `SELECT * FROM article WHERE id="${id}"`
        let result = await querySQL(sql)
        if (result.length > 0) {
            //更新字段 日期是前端还是后端设置
            let myDate = moment().format('YYYY-MM-DD hh:mm:ss')
            let sql2 = `UPDATE article SET title="${title || ""}",subTitle="${subTitle || ""}",date="${myDate}",content="${content || ""}",author="${result1[0].username}" WHERE id="${id}"`
            await querySQL(sql2)
            // 重新返回文章列表 前端做好一点 见仁见智
            // let sql3 = `SELECT id,title,subTitle,date FROM article`
            // let result3 = await querySQL(sql3)
            ctx.body = returnMsg(0, "更新成功")

        }else{
            ctx.body = returnMsg(2,"当前修改的文章不存在")
        }
        // ctx.body= returnMsg(0,"123",result)
    } else {
        ctx.body = returnMsg(2, "该用户没有编辑权限")
    }





})

module.exports = router