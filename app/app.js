/*imports*/
var bodyParser = require('body-parser');
var dataSource = require('./js/dataSource.js');
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');

/*global variables */
var fileUrl1 = 'fileLinkURL-asdaffkhnlvmemtksnsknvs';
var fileUrl2 = 'fileLinkURL-otklfmgnmsdlkalkflkhgdf';

/*app config*/
var app = express();


app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

app.listen(8081);

/*app req*/
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

console.log('Server running at http://127.0.0.1:' + '3000' + '/');

app.post('/lead', function(req, res){
    var hasEbook = false, 
        fileUrl = '';
        
    dataSource.saveLead(req.body);
    
    if(req.body.ebook == 1){
        fileUrl = fileUrl1;
        hasEbook = true;        
    }
    else if(req.body.ebook == 2)
    {
        fileUrl = fileUrl2;
        hasEbook = true;        
    }
    res.send({
        "hasEbook": hasEbook,
        "fileUrl": fileUrl
    });
});

app.get('/' + fileUrl1, function(req, res){
	res.download(path.join(__dirname + '/files/ebook_curso_basico.pdf'));
});

app.get('/' + fileUrl2, function(req, res){
	res.download(path.join(__dirname + '/files/ebook_festa_junina.pdf'));
});

app.get('/allLeads', function(req, res){
    dataSource.getAllLeads(function(err, leads){
        if(err)
            console.log(err);
        else
            res.send(leads);            
    });
});

app.get('/leadsCounter', function(req, res){
    res.sendFile(path.join(__dirname + '/leadsCounter.html'));
});

app.get('/postManager', function(req, res){
    res.sendFile(path.join(__dirname + '/postManager.html'));
});

app.post('/post', function(req, res){
    dataSource.savePost(req.body);
    res.send('ok');
});

app.get('/post', function(req, res){
    dataSource.getAllPosts(function(err, posts){
        if(err)
            console.log(err);
        else
            res.send(posts);    
    });
});


/*db connect */
mongoose.connect('mongodb://bloguser:gamablog@ds017672.mlab.com:17672/gamablog', function (err, db) {
    if (err) {
        throw err;
    } else {
        console.log("successfully connected to the database");
    }
});