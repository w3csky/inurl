'use strict';

const express = require('express');
const ejs = require('ejs');
const mysql=require('mysql');
const Redis=require('ioredis');

const surl=require('./core.js');


//创建应用
const app = express();
const router = express.Router();

app.listen(8080);

app.engine('.html', ejs.__express);
app.set('view engine', 'html');
//更换模板目录
//app.set('views', 'temp');


app.get('/', function(req, res) {
    res.render('index.html');
});


app.get('/:surl',function(req,res){
	
	if(req.params.surl!=='favicon.ico'){
		console.log(surl.idToURL(1));
		console.log(surl.URLToId(surl.idToURL(1)));
		//code here
		var target=''+req.params.surl;
		res.redirect(301,'https://www.w3csky.com/'+target);
	}
  
  res.end()
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
