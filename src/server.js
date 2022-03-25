const Koa = require('koa');
const cors = require('koa2-cors')
const bodyParser = require('koa-bodyparser') // 用来解析post请求的formData
const router = require('./router')

const app = new Koa();

app.use(cors())
app.use(bodyParser());
app.use(router.routes())


app.listen(3000, () => {
    console.log("服务器已启动，3000端口监听中");
});