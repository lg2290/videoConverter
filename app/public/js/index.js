var zencoderJobId
var video;
var videoName;

var ajaxModule = (function(){
    function ajaxCall(type, data, endPoint, successCb){
        $.ajax({
            cache:false,
            contentType: false,
            data: data,
            //dataType: 'json',
            processData: false,
            type: type,
            url: endPoint,
            success: function(data){
                successCb(data);
            }
        });
    }

    function getAjaxCall(data, endPoint, successCb){
        ajaxCall('GET', data, endPoint, successCb);    
    }

    function postAjaxCall(data, endPoint, successCb){
        ajaxCall('POST', data, endPoint, successCb);
    }
    
    return {
        getAjaxCall: getAjaxCall,
        postAjaxCall: postAjaxCall
    }
})();

var overlayPanelModule = (function(){
    const loadingContainer = $('.loadingContainer');
    const overlayPanel = $('.overlayPanel');
    const videoContainer = $('.videoContainer');
    const videoPlayer = $('#videoPlayer');
    const videoSource = $('#videoSource');


    function hideLoading(){
        hidePanel(loadingContainer);
    }

    function hidePanel(element){
        element.hide();
        overlayPanel.hide();
    }

    function hideVideo(){
        hidePanel(videoContainer);
    }

    function showLoading(){
        showPanel(loadingContainer);
    }

    function showPanel(element){
        element.show();
        overlayPanel.show();
    }

    function showVideo(videoSrc){
        videoSource.attr("src", videoSrc);
        videoPlayer.load();
        showPanel(videoContainer);
    }

    return{
        hideLoading: hideLoading,
        hideVideo: hideVideo,
        showLoading: showLoading,
        showVideo:showVideo
    }

})();

var videoModule = (function(){
    
    const videoSource = '#videoSource';

    function checkJobStatus(jobId){
        ajaxModule.getAjaxCall('', 'conversionStatus?job-id=' + jobId, function(response){
            var respJson = JSON.parse(response);
            if(respJson.success){
                var status = respJson.jobStatus;
                console.log(status);
                if(status == 'finished'){
                    overlayPanelModule.hideLoading();
                    overlayPanelModule.showVideo('http://s3-sa-east-1.amazonaws.com/lg2290-video-converter/converted/'+videoName+'.mp4');
                }
                else if(status != 'failed' && status != 'cancelled'){
                    setTimeout(checkJobStatus(zencoderJobId), 4000);
                }
                else
                    converionFailed();
            }
            else{
                converionFailed();
            }
        });
    }

    function converionFailed(){
        overlayPanelModule.hideLoading();
        alert('Conversion failed! Please try again.');
    }

    function convertVideo(fileName){
        console.log(fileName);
        ajaxModule.getAjaxCall('', 'convertVideo?file-name=' + fileName + '&file-type=' + video.type, function(response){
            var respJson = JSON.parse(response);
            if(respJson.success){
                zencoderJobId = respJson.jobId;
                checkJobStatus(respJson.jobId);
            }
            else{
                converionFailed();
            }
        });
    }

    function getSignedRequest(){
        var data = new FormData();
        data.append(0, video);
        
        ajaxModule.getAjaxCall(data, 'uploadVideo?file-type='+ video.type, function(response){
            var respJson = JSON.parse(response);
            console.log(respJson);
            videoName = respJson.nameFile;
            uploadVideoToS3(video, respJson.signedRequest, respJson.url, respJson.nameFile);
        });        
    }

    function showConvertedVideo(){

    }

    function setVideo(event){
        video = event.target.files[0];
    }
        
    function uploadVideo(){
        if(video == null)
            return alert('No file selected.');
        
        overlayPanelModule.showLoading();
        getSignedRequest();
    }

    function uploadVideoToS3(file, signedRequest, url, fileName){
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signedRequest);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    convertVideo(fileName);
                }
                else{
                    alert('Could not upload file.');
                }
            }
        };
        
        xhr.send(file);
    }
        
    return{
        convertVideo: convertVideo,
        setVideo: setVideo,
        uploadVideo: uploadVideo
    }
})();

var initModule = (function(){
    const btnCloseVideo = '#closeVideoBtn';
    const btnConvert = '#convertBtn';
    const fileInput = '#fileInput';
    
    function initElements(){
        $(fileInput).on('change', videoModule.setVideo);
        $(btnConvert).on('click', videoModule.uploadVideo);
    }
    
    return{
        initElements: initElements
    }

})();

initModule.initElements();



