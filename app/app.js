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
    const fileName = 'test';//uuid.v4();
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
    zencoderHelper.convertVideo();
    res.write('teste');
    res.end;
});

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

//convertVideo2();

