'use strict';

const express = require('express');
const ejs = require('ejs');
const mysql = require('mysql');
const Redis = require('ioredis');

const surl = require('./core.js');


//创建应用
const app = express();
const router = express.Router();

app.listen(8087);

app.engine('.html', ejs.__express);
app.set('view engine', 'html');
//更换模板目录
//app.set('views', 'temp');
//定义mysql连接选项
const mysqlOpt = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'surl'
};


app.get('/', (req, res) => {
    res.render('index.html');
});
app.get('/favicon.ico', (req, res) => {
    res.end();
});
app.get('/addurl/', (req, res) => {

            var jsonpName = req.query.callback;
            var queryURL = req.query.url;
            var data = {};
            //如果添加的链接存在
            if (queryURL !== undefined && queryURL !== '') {
                var SQL = 'SELECT uid FROM `surl` WHERE target=' + queryURL;

                //查库，确认是否已经存在相应链接
                conn.query(SQL, (err, rows, fields) => {

                        if (err) {
                            console.log()
                            console.log('mysql error:', err);
                        } else {
                            //如果数据库中已经存在相应的连接
                            if (rows.length) {
                                var uid = rows[0].uid;
                                res.end(surl.idToURL(uid);
                                    //如果是jsonp
                                    if (jsonpName != undefined) {
                                        res.end(jsonpName + '(' + queryURL + ')');
                                    } else {
                                        console.log(queryURL);
                                        res.end(queryURL);
                                    }
                                }
                                else {
                                    //插入到数据库中
                                    var InsertSQL = 'INSERT INTO `surl` (target) VALUES (' + queryURL + ')';
                                    conn.query(InsertSQL, (err2, rows, fields) => {
                                        //如果是jsonp
                                        if (jsonpName != undefined) {
                                            res.end(jsonpName + '(' + queryURL + ')');
                                        } else {
                                            console.log(queryURL);
                                            res.end(queryURL);
                                        }
                                    });
                                }
                            }

                        };

                    } else {
                        data.code = 404;
                        data.result = null;
                        console.log('链接缺失')
                        res.end(data);
                    }

                });

            //短网址跳转
            app.get('/:surl', (req, res) => {
                if (req.params.surl !== 'favicon.ico') {
                    console.log('changdu:', req.params.surl)
                    if (req.params.surl.length <= 6) {
                        //连接mysql
                        const conn = mysql.createConnection(mysqlOpt);

                        var surlId = surl.URLToId(req.params.surl);

                        var SQL = 'SELECT target FROM `surl` WHERE uId=' + surlId;
                        //执行查询
                        conn.query(SQL, (err, rows, fields) => {
                            if (err) {
                                console.log()
                                console.log('mysql error:', err);
                            } else {
                                if (rows.length) {
                                    var target = rows[0].target;
                                    //重定向到相应链接
                                    res.redirect(301, target);
                                }
                            };

                            //释放mysql连接
                            conn.end();
                        });
                    } else {
                        res.status(404).send('404');
                    }

                }



            });


            //404
            app.get('*', (req, res) => {
                res.status(404).send('404');
            });

            app.use((err, req, res, next) => {

                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: {}
                });
            });
