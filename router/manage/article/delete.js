const Router = require('koa-router')
const router = new Router()
const { querySQL, returnMsg, jwtVerify } = require('../../../utils')
const moment = require('moment') //数据库
// 删除文章
router.post('/', async ctx => {

    // 1.鉴权
    let token = ctx.request.headers['cms-token']
    // 鉴权 除非了注册和登录其他基本都需要鉴权
    if (!jwtVerify(token)) {
        ctx.body = returnMsg(2, "token过期或不存在该用户")
        return
    }
    // 先判断文章是否存在，再判断id字段是否存在 
    // 再判断权限
    // 再根据id 删除文章 

    // 判断id字段
    let {id} = ctx.request.body 
    if(!id){
        ctx.body = returnMsg(2,"缺少id字段")
        return
    }
    // 判断是否有删除权限
    let sql1 = `SELECT editable FROM user WHERE token="${token}"`
    let result1 = await querySQL(sql1)
    if(result1[0].editable === 0){
        ctx.body = returnMsg(2,"该用户没有删除权限")
        return
    }

    // 查询文章是否存在
    let sql = `SELECT * FROM article WHERE id="${id}"`
    let result = await querySQL(sql)
    if(result.length > 0){   
        // 删除文章 
        let sql2 = `DELETE FROM article WHERE id="${id}"`
        await querySQL(sql2)
        ctx.body = returnMsg(0,"删除成功")
    }else{
        ctx.body = returnMsg(2,"改文章不存在")
    }
})

module.exports = router