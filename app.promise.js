'use strict';

const path = require('path');
const express = require('express');
const ejs = require('ejs');
const mysql = require('mysql');
const Redis = require('ioredis');

const surl = require('./core.js');


//创建应用
const app = express();
const router = express.Router();

app.listen(8089);

app.engine('.html', ejs.__express);
app.set('view engine', 'html');
//设置静态目录
app.use(express.static(path.join(__dirname, 'public')));
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

    var result = {};
    var data = {};

    var localSiteUrlReg = /^((http|https):\/\/)?localhost\/\w*/
    var urlReg = /(http | ftp | https)/;

    //如果添加的链接存在
    if (queryURL != undefined && queryURL != '') {

        //TODO 钓鱼、病毒、木马网址拦截
        _qURL=new Buffer(queryURL).toString('base64');
       
        var _appkey='k-3356';
        var _secret='a176201e188a0969cd7b7fa2ef3c8d14';
        var _timestamp =new Date().getTime();
    

        var conn = mysql.createConnection(mysqlOpt);

        var SQL = 'SELECT uid FROM `surl` WHERE target ="' + queryURL + '"';
        //console.log('unde', queryURL)

        var promise=new Promise(function(resolve,reject){
            conn.query(SQL, (err, rows, fields) => {
                    if (err) {
                        reject(err); 
                    } else {
                        resolve(rows);
                    }
            });
        })
        //查库，确认是否已经存在相应链接
       promise.then(function(rows){
                //如果数据库中已经存在相应的连接
                if (rows.length) {
                    var uid = rows[0].uid;

                    //返回的数据
                    result.code = 200;
                    result.url = queryURL;
                    result.surl = surl.idToURL(uid);

                    //如果是jsonp
                    if (jsonpName != undefined) {
                        res.end(jsonpName + '(' + JSON.stringify(result) + ')');
                    } else {

                        res.json(result);
                    }
                } else {
                     //插入到数据库中
                    var InsertSQL = 'INSERT INTO `surl` (target) VALUES ("' + queryURL + '")';

                    conn.query(InsertSQL, (err, rows, fields) => {
                        return new Promise(function(resolve,reject){
                            if(err) {
                                reject(err); 
                            } else {
                                resolve(rows);
                            }
                        })
                       
                    });
                }
            },function(err){
                console.log('mysql error:', err);
                res.end();
            }).then(function(rows){
                //获取自增id
                var uidSQL = 'SELECT LAST_INSERT_ID()';

                conn.query(uidSQL, (err, rows, fields) => {
                    return new Promise(function(resolve,reject){
                        if(err){
                            reject(err);
                        }else{
                            resolve(rows);
                        }
                    })
                   
                });

            },function(err){
                console.log('mysql error:', err);
                res.end();
            }).then(function(rows){
                if (rows.length) {
                    var uid = rows[0]['LAST_INSERT_ID()'];

                    //返回的数据
                    result.code = 200;
                    result.url = queryURL;
                    result.surl = surl.idToURL(uid);

                    //如果是jsonp
                    if (jsonpName != undefined) {
                        res.end(jsonpName + '(' + JSON.stringify(result) + ')');
                    } else {
                        res.json(result);
                    }
                } else {
                    console.log('没获取到数据库里uid');
                }
            },function(err){
                console.log('mysql error:', err);
                res.end();
            });


    } else {
        data.code = 404;
        data.result = null;
        console.log('链接缺失')
        res.end('data.code: ' + data.code);
    }




});


//短网址跳转
app.get(/^\/([A-Za-z0-9]{1,6})$/, (req, res) => {
    //console.log(req.params[0])
    var _surl = req.params[0];

    if (_surl !== 'favicon.ico') {

        //连接mysql
        var conn = mysql.createConnection(mysqlOpt);

        var surlId = surl.URLToId(_surl);

        //console.log('surlId', surlId);

        var SQL = 'SELECT target FROM `surl` WHERE uid=' + surlId;
        //执行查询
        conn.query(SQL, (err, rows, fields) => {
            if (err) {
                console.log('mysql error:', err);
            } else {
                if (rows.length) {
                    var target = rows[0].target;
                    //重定向到相应链接
                    res.redirect(301, target);
                    res.end();
                }
            };

            //释放mysql连接
            conn.end();
        });

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
