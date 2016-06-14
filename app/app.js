/*imports*/
var express = require('express');
var path = require('path');

/*global variables */

/*app config*/
var app = express();

app.use(express.static(__dirname + '/public'));

app.listen(3000);

/*app req*/
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

console.log('Server running at http://127.0.0.1:' + '3000' + '/');