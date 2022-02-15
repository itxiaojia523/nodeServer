const Router = require('koa-router')
const router = new Router()
const { querySQL, returnMsg } = require('../../../utils')
// 获取文章列表接口
router.post('/', async ctx => {
    // 得到有多少条数据
    let sql1 = `SELECT COUNT(*) ROWS FROM article`
    let result1 = await querySQL(sql1)
    let totalRows = result1[0].ROWS
    // 获取前端传来的 当前页码current以及每页条数counts
    let {current,counts} = ctx.request.body
    // 判断字段
    if(!current || !counts){
        ctx.body = returnMsg(1,"字段错误")
        return
    } 
    // 查询对应的10条
    let sql = `SELECT id,title,subTitle,date FROM article LIMIT ${(current-1)*counts},${counts}`
    let result = await querySQL(sql)
    ctx.body = returnMsg(0, "分页查询成功", {
        current,
        counts,
        totalRows,
        result
    })
})

module.exports = router