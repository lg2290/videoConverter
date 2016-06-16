var zencoderInterface = (function(){
    const request   = require('request');

    const S3_CONVERTED_URL = 's3://lg2290-video-converter/converted/';
    const S3_TO_CONVERT_URL = 'https://s3-sa-east-1.amazonaws.com/lg2290-video-converter/to-convert/';
    const ZENCODER_API_KEY  = '691e4718a003c19666f3ea08788b121f';
    const ZENCODER_URI = 'https://app.zencoder.com/api/v2/jobs';
    
    function convertVideo(fileName, fileType){
        request(
            {
                method: 'POST',
                uri: ZENCODER_URI,
                body: JSON.stringify({
                    'api_key': ZENCODER_API_KEY,
                    'input': S3_TO_CONVERT_URL + fileName + fileType,
                    'outputs': [
                        {
                            'url': S3_CONVERTED_URL + fileName + '.mp4',
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
    
    return{
        convertVideo: convertVideo
    }
    
})();

module.exports = zencoderInterface;