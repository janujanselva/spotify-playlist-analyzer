var gzippo = require('gzippo');
var express = require('express');
var morgan = require('morgan');
var app = express();

app.use(morgan('dev'));
app.use(gzippo.staticGzip("" + __dirname + "/"));
app.get('/', function(req, res) {
    res.sendfile('app/view1/view1.html', {root: __dirname })
});
var server = app.listen(process.env.PORT || 80);