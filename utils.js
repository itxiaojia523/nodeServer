// 功能函数模块 以及 设置端口

const mysql = require("mysql"); //引入mysql
const jwt = require('jsonwebtoken') //引入jwt
// 开发环境的host
// let host = 'http://localhost'
// let host = 'http://127.0.0.1'
// 生产环境的host ip
let host = 'http://144.202.27.38/'

// 开发环境的port
let port = 9000
// 生产环境的port 8080 80等等
// let port = 8080 

// 创建数据库连接池
const pool = mysql.createPool({
    host: "localhost",  // 连接的服务器(代码托管到线上后，需改为内网IP，而非外网)
    port: 3306, // mysql服务运行的默认端口
    database: "cms", // 选择某个数据库
    user: "root",   // 用户名
    password: "123456", // 用户密码  服务器端我的密码不一样MyPass123!
    // password: "MyPass123!"
})

//对数据库进行增删改查操作的基础
const query = (sql,callback) => {
    pool.getConnection(function(err,connection){
        connection.query(sql, function (err,rows) {
            callback(err,rows)
            connection.release()
        })
    })
}

// 封装数据库操作 promise封装
const querySQL = (sql)=>{
    return new Promise((resolve,reject)=>{
        query(sql,(err,rows)=>{
            if(err) reject(err) // 返回[]
            resolve(rows) // 返回[{}]
        })
    })
}

// 封装返回消息
const returnMsg = (errCode,message,data)=>{
    return {
        errCode: errCode || 0 , //0表成功 1表参数字段错误 2表其他错误
        message: message || "",
        data: data || {}
    }
}



// 鉴权函数
const jwtVerify = (token)=>{
    try {
        jwt.verify(token,'ITxiaojia523') //可以得到username和password
    } catch (error) {
        // 鉴权失败
        return false
    }
    return true
}


module.exports = {
    host,port,querySQL,returnMsg,jwtVerify
}

