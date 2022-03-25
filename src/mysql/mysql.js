const mysql2 = require('mysql2');
const config = require('./mysqlConfig')

// 连接提示信息
function connectInfo(err) {
    if (err) {
        console.log("连接失败");
        console.log('---:' + err);
        return;
    }
    console.log('连接成功');
}
// 关闭连接提示信息
function endInfo(err) {
    if (err) {
        console.log("关闭失败");
        console.log('---:' + err);
        return;
    }
    console.log('关闭成功');
}

module.exports = {
    mysql: {
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port
            // host: 'localhost',
            // user: 'root',
            // password: '123456',
            // database: 'todolist',
            // port: 3306
    },
    selectAll: function(sql) {
        let connection = mysql2.createConnection(this.mysql);
        connection.connect(connectInfo);
        return new Promise((resolve, reject) => {
            connection.query(sql, function(err, res) {
                if (err) {
                    console.log('[SELECT ERROR 查询出错] - ', err.message);
                    return;
                } else {
                    console.log("查询成功！");
                }
                connection.end(endInfo);
                console.log(res);
                resolve(res);

            });
        });
    },

    addSql: function(sql, params) {
        let connection = mysql2.createConnection(this.mysql);
        connection.connect(connectInfo);
        return new Promise((resolve, reject) => {
            connection.query(sql, params, function(err, res) {
                if (err) {
                    console.log('[INSERT ERROR] - ', err.message);
                    reject(err);
                } else {
                    console.log("数据插入成功！");
                }
                connection.end(endInfo);

                resolve(res);
            });
        });
    },

    delSql: function(sql) {
        let connection = mysql2.createConnection(this.mysql);
        connection.connect(connectInfo);
        return new Promise((resolve, reject) => {
            connection.query(sql, function(err, res) {
                if (err) {
                    console.log('[DELETE ERROR] - ', err.message);
                    return;
                } else {
                    console.log("数据删除成功");
                }
                connection.end(endInfo);
                resolve(res);
            });
        });
    },

    modSql: function(sql, params) {
        let connection = mysql2.createConnection(this.mysql);
        connection.connect(connectInfo);
        return new Promise((resolve, reject) => {
            connection.query(sql, params, function(err, res) {
                if (err) {
                    console.log('[UPDATE ERROR] - ', err.message);
                    reject(err);
                } else {
                    console.log("数据更新成功");
                }
                connection.end(endInfo);
                resolve(params);
            });
        });
    },

};