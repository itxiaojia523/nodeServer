const Router = require('koa-router')
const router = new Router()
const list = require('./list')
const infobyid = require('./infobyid')
const edit = require('./edit')
const deleteArticle = require('./delete')
const add = require('./add')

// 添加文章


router.use('/list',list.routes(),list.allowedMethods())
router.use('/infobyid',infobyid.routes(),infobyid.allowedMethods())
router.use('/edit',edit.routes(),edit.allowedMethods())
router.use('/delete',deleteArticle.routes(),deleteArticle.allowedMethods())
router.use('/add',add.routes(),add.allowedMethods())

module.exports = router