const Router = require('koa-router')
const { querySQL, returnMsg,jwtVerify } = require('../../utils')
const router = new Router()

// 获取小编列表
router.get('/', async (ctx) => {
    // 鉴权
    let token = ctx.request.headers['cms-token']
    if (!jwtVerify(token)) {
        ctx.body = returnMsg(2, "token过期或不存在该用户")
        return
    }
    // 读取数据库
    let sql = `SELECT id,avatar,editable,player,username FROM user WHERE player = "normal"`;
    let result = await querySQL(sql)
    ctx.body = returnMsg(0, "列表请求成功", result);
})

// 修改编辑权限
router.post('/', async (ctx) => {
    // 鉴权
    let token = ctx.request.headers['cms-token']
    if (!jwtVerify(token)) {
        ctx.body = returnMsg(2, "token过期或不存在该用户")
        return
    }
    // 根据id修改编辑权限
    let {id,open} = ctx.request.body
    if(!id && !open){
        ctx.body = returnMsg(1,"字段错误")
        return
    }
    // 查询编辑权限
    let sql = `SELECT editable FROM user WHERE id=${id}`
    let result1 = await querySQL(sql)
    // 与前端协约 开通和编辑权限 open:1 close:0
    if(result1[0].editable === 1 && open === 1){
        // 已有编辑权限，还想开通
        ctx.body = returnMsg(2,"该用户已有编辑权限")
        return
    }
    if(result1[0].editable === 0 && open === 0){
        // 已有编辑权限，还想开通
        ctx.body = returnMsg(2,"该用户未有编辑权限")
        return
    }else{
        // 修改权限
        let sql2 = `UPDATE user SET editable=${open}`
        let result2 = await querySQL(sql2)
        ctx.body = returnMsg(0,"修改用户编辑权限成功")
    }

})

module.exports = router