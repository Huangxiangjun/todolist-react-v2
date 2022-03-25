const Router = require('koa-router')
const dayjs = require("dayjs")
const sql = require('./mysql/mysql')

const router = new Router();


// ----------------指定路由匹配----------------
// 首屏响应数据库数据
router.get('/', async(ctx) => {
    let getData = await sql.selectAll(`select * from todo_items order by time desc`);
    // 要对数据库返回的数据进行处理之后再resolve
    getData.forEach(item => {
        // 根据isCheck，0表示false，1表示true
        if (item.isCheck === 0) item.isCheck = false
        else item.isCheck = true

        // 时间按指定格式
        item.time = dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')
    })
    ctx.response.body = getData;
})

// 添加一条数据
router.post('/add', async(ctx) => {
    let data = ctx.request.body;
    let item = JSON.parse(Object.keys(data)[0])
    console.log(item);
    // 处理数据格式
    item.isCheck = item.isCheck == false ? 0 : 1;
    // ---这里就写插入数据库的过程(还要对数据做处理，布尔类型改成0或1)
    let res = await sql.addSql('insert into todo_items SET ?', item)

    ctx.response.body = res
})

// 删除一条数据
router.post('/del', async(ctx) => {
    let data = ctx.request.body;
    let id = JSON.parse(Object.keys(data)[0])
    console.log(id);
    // 去数据库根据id删数据
    let res = await sql.delSql(`delete from todo_items where id = ${id}`)
    ctx.response.body = res
})

// 单个item改变状态
router.post('/changeStatus', async(ctx) => {
    let data = ctx.request.body;
    let info = JSON.parse(Object.keys(data)[0])
    console.log(info);
    // 处理数据格式
    info.isCheck = info.isCheck == false ? 0 : 1;
    // 去数据库根据id更新状态
    // let res = await sql.modSql(`update todo_items set isCheck = ${info.isCheck} where id = ${info.id}`, info)
    let res = await sql.modSql(`update todo_items set isCheck = ? where id = ?`, [info.isCheck, info.id])
    ctx.response.body = res
})

// 取消所有选中
router.post('/cancelAll', async(ctx) => {
    let data = ctx.request.body;
    let status = JSON.parse(Object.keys(data)[0])
    console.log(status);
    // 处理数据格式
    status.isCheck = status.isCheck == false ? 0 : 1;
    // 去数据库根据id更新状态
    let res = await sql.modSql(`update todo_items set isCheck = ?`, status.isCheck)
    ctx.response.body = res
})

// 全选
router.post('/selectAll', async(ctx) => {
    let data = ctx.request.body;
    let status = JSON.parse(Object.keys(data)[0])
    console.log(status);
    // 处理数据格式
    status.isCheck = status.isCheck == false ? 0 : 1;
    // 去数据库根据id更新状态
    let res = await sql.modSql(`update todo_items set isCheck = ?`, status.isCheck)
    ctx.response.body = res
})

// 内容为空就删除这条
router.post('/blurDel', async(ctx) => {
    let data = ctx.request.body;
    let id = JSON.parse(Object.keys(data)[0])
    console.log(id);
    // 去数据库根据id删数据
    let res = await sql.delSql(`delete from todo_items where id = ${id}`)
    ctx.response.body = res
})

// 更新内容
router.post('/blurUpdate', async(ctx) => {
    let data = ctx.request.body;
    let info = JSON.parse(Object.keys(data)[0])
    console.log(info);
    // 去数据库根据id更新状态
    let res = await sql.modSql(`update todo_items set text = ? where id = ?`, [info.text, info.id])
    ctx.response.body = res
})

module.exports = router