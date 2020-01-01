require('./system/dbcon');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require("path");
var system = require('./system');
var port = require("./config.json").devport;

app.set('port', process.env.PORT ? process.env.PORT : port);

app.use(function(req, res, next) {
	console.log(req.method, req.url);
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token,Authorization');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

app.use('/api', system);
app.use('/', express.static(path.join(__dirname, 'public')));

var server = app.listen(app.get('port'), function() {
	console.log(server.address());
});