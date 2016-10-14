'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const ejs = require('ejs');
const routes = require('./routers');
const list = require('./routers/list');
const detail = require('./routers/detail');

const async = require('async');

//创建应用
const app = express();
const router = express.Router();

app.listen(3000);

app.engine('.html', ejs.__express);
app.set('view engine', 'html');
//更换模板目录
//app.set('views', 'temp');


app.get('/', function(req, res) {
    res.render('index.html');
});


app.get('/:surl',function(req,res){
  //code here
  res.redirect(301, '');
});

//404
app.get('*', function(req, res) {
    res.status(404).send('404');
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
