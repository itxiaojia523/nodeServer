// 图片上传
// 后端逻辑
// 鉴权！
// 1. 接收到图片
// 2. 判断是否超出大小限制（20k）
// 3. 设置单图上传
// 修改图片的名字 aaa-时间戳.jpg
// 4. 存储图片
// 5. 读取图片路径，替换avatar字段
// 6. 读取用户信息，返回新信息

// 前端逻辑
// 1.调用组件
// 2.发送请求 带token
// 3.修改localstorage 更新header

const Router = require('koa-router')
const multer = require('@koa/multer');
const router = new Router()
const { querySQL, returnMsg, jwtVerify } = require('../../utils')
const path = require('path')

let myfilename = ""
// 存储配置
var storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'upload/'))
    },
    //修改文件名称
    filename: function (req, file, cb) {
        let type = file.originalname.split('.')[1]
        // logo.png -> logo.xxx.png
        myfilename = `${file.fieldname}-${Date.now().toString(16)}.${type}`
        cb(null, myfilename)
    }
})
// 限制大小
const limits = {
    fieldSize: 1024 * 200, //单位byte  1k*200
    fields: 1,
    files: 1
}

let upload = multer({ storage, limits }); // note you can pass `multer` options here

router.post(
    '/',
    // single单图 fields多图
    // upload.fields([
    //   {
    //     name: 'avatar',
    //     maxCount: 1
    //   },
    //   {
    //     name: 'boop',
    //     maxCount: 2
    //   }
    // ]),
    upload.single('avatar'),
    async ctx => {
        let token = ctx.request.headers['cms-token']
        // 鉴权 除非了注册和登录其他基本都需要鉴权
        if (!jwtVerify(token)) {
            ctx.body = returnMsg(2, "token过期或不存在该用户")
            return
        }
        // 修改数据库avatar
        let sql = `UPDATE user SET avatar='${myfilename}' WHERE token = "${token}"`
        await querySQL(sql)
        // 重新查找并返回
        let sql1 = `SELECT username,avatar,token FROM user WHERE token = "${token}"`
        let result1 = await querySQL(sql1)
        ctx.body = returnMsg(0,"修改成功",{
            avatar: result1[0].avatar,
            username: result1[0].username,
            "cms-token":result1[0].token
        })
    }
);
module.exports = router
