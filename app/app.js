/*imports*/
const express           = require('express');
const http              = require('http');
const request           = require('request');
const path              = require('path');
const s3Helper          = require('./js/s3.js');
const uuid              = require('node-uuid');
const zencoderHelper    = require('./js/zencoder.js');

/*app config*/
var app = express();
app.use(express.static(__dirname + '/public'));
app.listen(3000);

/*app req*/
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/uploadVideo', (req, res) => {
    
    const s3 = s3Helper.getS3();
    const fileName = uuid.v4();
    const fileType = req.query['file-type'];
    const s3Params = s3Helper.getParams(fileName, fileType);
    
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if(err){
            console.log(err);
            return res.end();
        }
        const returnData = {
            nameFile: fileName,
            signedRequest: data,
            url: s3Helper.getUrlToConvert(fileName)
        };
        console.log(JSON.stringify(returnData));
        res.write(JSON.stringify(returnData));
        res.end();
    });
});

app.get('/convertVideo', (req, res) => {
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const reqParams = zencoderHelper.getParams(fileName, fileType);
    
    request(
        reqParams, function(error, response, body){
            if(error) {
                console.log(error);
                res.write(JSON.stringify({
                    success: false
                }));
            } else {
                console.log(response.statusCode, body);
                var bodyJson = JSON.parse(body);
                res.write(JSON.stringify({
                    success: true,
                    jobId: bodyJson.id
                }));
            }
            res.end();
        }    
    );
});

app.get('/conversionStatus', (req, res) => {
    const jobId = req.query['job-id'];
    const reqParams = zencoderHelper.getParamsCheckStatus(jobId);


    request(
        reqParams, function(error, response, body){
            if(error) {
                console.log(error);
                res.write(JSON.stringify({
                    success: false
                }));
            } else {
                console.log(response.statusCode, body);
                var bodyJson = JSON.parse(body);
                console.log(bodyJson.id);
                res.write(JSON.stringify({
                    success: true,
                    jobStatus: bodyJson.state
                }));
            }
            res.end();
        }
        
    );
});

console.log('Server running at http://127.0.0.1:' + '3000' + '/');
