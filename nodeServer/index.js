// 1.初始项目：npm init -y
// 2.安装依赖：cnpm i -S express body-parser

const express = require("express"); // 一个nodejs的后端框架，类似的还有koa
const app = express();

// 获取本机的ip地址，如果是在线上，那么这个地址就是服务器ip
const os = require("os");
///////////////////获取本机ip///////////////////////
function getIPAdress(os) {
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (
                alias.family === "IPv4" &&
                alias.address !== "127.0.0.1" &&
                !alias.internal
            ) {
                return alias.address;
            }
        }
    }
}
const IPv4 = getIPAdress(os);
app.listen(3003, () =>
    console.log("服务：http://localhost:3003；本机ip" + IPv4)
); // 启动服务 3003是端口号

const bodyParser = require("body-parser"); // 使用中间件可以获取到post-body里的数据
app.use(bodyParser.urlencoded({ extended: true })); // 表单请求
app.use(bodyParser.json()); // json请求--post

// 解决跨域可以自己设置，可以使用中间件cors
// const cors = require('cors') app.use(cors())
app.all("*", function (req, res, next) {
    // 设置跨域白名单 可以使用cors模块，这里没使用
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By", ' 3.2.1');
    // res.header("Content-Type", "application/json;charset=utf-8");
    // next();
    res.header("Access-Control-Allow-Origin", "*"); // 这里的*表示不拦截，可以响应所有地址的请求
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
    );
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    if (req.method === "OPTIONS") {
        // res.send(200)
        res.sendStatus(200);
    } else {
        // 必须有next方法，才能跳出这个方法到下一个请求里去
        next();
    }
});

// 在get里获取请求参数用req.query，在post里获取参数用req.body

// app.get是拦截到get请求
app.get("*", (req, res) => {
    // console.log(req.query);
    // res.json({
    // name: req.query.name ? req.query.name : "匿名"
    // });

    switch (req.path) {
        case '/get':
            res.json({ ip: IPv4, token: "ip+data+md5value" });
            break;
        default:
            res.json("404");

    }
});

// post请求需要额外的处理
app.post("*", (req, res) => {
    // req.path请求的地址
    const data = require("./json/index.json");
    switch (req.path) {
        case "/login":
            // Object.keys(req.body).length ? res.json(data) : res.json(req.body);

            if (req.body.username && req.body.password) {
                res.json(data);
            } else {
                res.json({
                    type: "err"
                });
            }

            break;
        default:
            res.json("404");
    }
});