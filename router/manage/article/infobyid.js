const Router = require('koa-router')
const router = new Router()
const { querySQL, returnMsg, jwtVerify } = require('../../../utils')

// 根据id获取文章
router.post('/', async ctx=>{
    // 鉴权
    let token = ctx.request.headers['cms-token']
    // 鉴权 除非了注册和登录其他基本都需要鉴权
    if (!jwtVerify(token)) {
        ctx.body = returnMsg(2, "token过期或不存在该用户")
        return
    }
    // 得到id
    let {id} = ctx.request.body
    // 查询id对应文章
    let sql = `SELECT * FROM article WHERE id="${id}"`
    let result = await querySQL(sql)
    if(result.length > 0){
        ctx.body = returnMsg(0,"文章获取成功",result[0])
    }else{
        ctx.body = returnMsg(2,"改文章不存在")
    }
    
})

// 根据id获取文章 get请求形式 /infobyid/{id}
// router.get('/:id', async ctx=>{
//     let id = ctx.url.split('/')[ ctx.url.split('/').length-1] 
//     ctx.body = id
// })

module.exports = router