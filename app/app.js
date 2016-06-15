/*imports*/
const aws = require('aws-sdk');
const express = require('express');
const path = require('path');

const S3_BUCKET = 'lg2290-video-converter';
const ZENCODER_API_KEY = '691e4718a003c19666f3ea08788b121f';

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


console.log('Server running at http://127.0.0.1:' + '3000' + '/');


