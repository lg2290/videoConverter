/*imports*/
const aws       = require('aws-sdk');
const express   = require('express');
const http      = require('http');
const request   = require('request');
const path      = require('path');

const S3_BUCKET         = 'lg2290-video-converter';
const ZENCODER_API_KEY  = '691e4718a003c19666f3ea08788b121f';

/*global variables */

/*app config*/
var app = express();
app.use(express.static(__dirname + '/public'));
app.listen(3000);

/*app req*/
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/uploadVideo', (req, res) => {
    aws.config.update({
        accessKeyId: "AKIAJ73VMUL3OP2LIQGA",
        secretAccessKey: "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"
    });
    
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: 'https://'+ S3_BUCKET +'.s3.amazonaws.com/'+ fileName
    };
    res.write(JSON.stringify(returnData));
    res.end();
    
  });
});

app.get('/convertVideo', (req, res) => {
    convertVideo();
    res.write('teste');
    res.end;
});

function convertVideo(){
    var postData = JSON.stringify({
        'api_key': ZENCODER_API_KEY,
        'input': 'https://s3-sa-east-1.amazonaws.com/lg2290-video-converter/sample.dv',
        'outputs': [
            {
                'url': 's3://lg2290-video-converter/test2.mp4',
                'credentials': 's3'
            }
        ] 
    });

    
    var options = {
        hostname: 'app.zencoder.com',
        path: '/api/v2/jobs',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        },
        method: 'POST'
    };
        
    var req = http.request(options, function(res) {
        console.log('Status: ' + res.statusCode);
        console.log('Headers: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (body) {
            console.log('Body: ' + body);
        });
    });
    
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    // write data to request body
    req.write(postData);
    req.end();    
}

function convertVideo2(){
    request(
        {
            method: 'POST',
            uri: 'https://app.zencoder.com/api/v2/jobs',
            body: JSON.stringify({
                'api_key': ZENCODER_API_KEY,
                'input': 'https://s3-sa-east-1.amazonaws.com/lg2290-video-converter/sample.dv',
                'outputs': [
                    {
                        'url': 's3://lg2290-video-converter/test2.mp4',
                        'credentials': 's3'
                    }
                ] 
            })
        }, function(error, response, body){
            if(error) {
                console.log(error);
            } else {
                console.log(response.statusCode, body);
            }
        }
    );
}

console.log('Server running at http://127.0.0.1:' + '3000' + '/');

convertVideo2();

