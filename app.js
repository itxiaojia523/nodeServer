// 首字母大写表构造函数
// koa 轻量一般都需要下载 express比较重
const Koa = require('koa2')
const Router = require('koa-router') //路由中间件
const cors = require('koa2-cors') // 跨域中间件
const static = require('koa-static') // 读取静态资源中间件
const bodyParser = require("koa-bodyparser");//读取请求体body


const {port,host} = require('./utils')
const manage = require('./router/manage')
const web = require('./router/web')
const notfound = require('./router/notfound')

const app = new Koa()
const router = new Router()
const path = require('path')


// 后端路由就是前端接口
// 表get请求 '/'表当前目录路径
router.get('/', async(ctx)=>{
    ctx.body = '首页'
}) 

// 拆分管理路由时配置
// 表访问/manage时，支持所有路由和方式
router.use("/manage",manage.routes(),manage.allowedMethods())
router.use("/web",web.routes(),web.allowedMethods())
router.use("/404",notfound.routes(),notfound.allowedMethods())
// router.redirect('/','/manage') // 重定向 如果前端请求/ 则重定向到/manage

// 前端随意的请求，重定向到404
app.use(async (ctx,next) => {
    await next() //放行下个中间件
    // ctx.status === 404 就重定向
    if(parseInt(ctx.status) === 404){
        // ctx.body 实际上是ctx.response.body的缩写
        ctx.response.redirect('/404')
    }
})
// 这里要针对图片上传 专门设计
//允许跨域，注意在路由（下行代码）之前
// app.use(cors())
app.use(cors({
    orgin: function(ctx){
        if(ctx.url === 'manage/upload'){
            return "*"
            // 特质某个ip
            // return "http://4.32.45.20"
        }
    }
})) 

app.use(bodyParser())
//调用中间价app.use(匹配router里所有路由，允许所有方式)
app.use(router.routes(),router.allowedMethods())

// 优先路由再静态资源 path.join(__dirname) 获取当前文件所在文件夹路径
// 在页面中如何获取404.jpg? 原： http://127.0.0.1:9000/static/images/404.jpg
// 现：http://127.0.0.1:9000/images/404.jpg
app.use(static(path.join(__dirname, 'static')))
app.use(static(path.join(__dirname, 'router/manage/upload')))
// 场景： images/404.jpg 前缀前端拼接

// 监听端口 运行服务 list(port,callback)
app.listen(port,()=>{
    console.log(`server is running at${host}:${port}`);
})
 