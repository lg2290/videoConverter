const aws = require('aws-sdk');

var s3Interface = (function () {
    const S3_BUCKET = '';
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: '',
        Expires: 60,
        ContentType: '',
        ACL: 'public-read'
    };
    
    return{
        
    }
}
    
)();

module.exports = s3Interface;