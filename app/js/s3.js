var s3Interface = (function () {
    const aws = require('aws-sdk');
    aws.config.update({
        accessKeyId: "***",
        secretAccessKey: "****"
    });
    
    const S3_BUCKET = 'lg2290-video-converter';
    
    var s3Params = {
        Bucket: S3_BUCKET,
        Key: '',
        Expires: 60,
        ContentType: '',
        ACL: 'public-read'
    };
    
    function getBucket() {
        return S3_BUCKET;
    }

    function getParams(fileName, fileType) {
        s3Params.Key = 'to-convert/'+fileName;
        s3Params.ContentType = fileType;
        
        return s3Params;
    }
    
    function getS3() {
        return new aws.S3();
    }
    
    function getUrl(folder, fileName) {
        return 'https://'+ S3_BUCKET +'.s3.amazonaws.com/'+ folder + '/' + fileName;        
    }
    
    function getUrlToConvert(fileName) {
        return getUrl('to-convert', fileName);
    }
        
    return{
        getBucket: getBucket,
        getParams: getParams,
        getS3: getS3,
        getUrlToConvert: getUrlToConvert
    }
})();

module.exports = s3Interface;
