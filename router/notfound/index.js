const Router = require('koa-router')
const router = new Router()
// 返回静态资源 需要fs
const fs = require('fs')
const path = require('path')
const mime = require('mime-types')

router.get('/', (ctx)=>{
    let filePath = path.join(__dirname, '../../static/images/404.jpg')
    // 这是一个buffer 文件流，用户进来直接下载了 也没有后缀 响应头是octet-stream字节流
    // 同步读取文件
    let file = fs.readFileSync(filePath) 
    // 根据读取到的文件是什么类型 
    let fileType = mime.lookup(filePath) //读取文件类型
    // 设置响应头content-type类型
    ctx.set("content-type",fileType)
    ctx.body = file
}) 

module.exports = router