var ajaxModule = (function(){
    function ajaxCall(type, data, endPoint, successCb){
        alert('aqui');
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


var videoModule = (function(){
    var video;
    
    function setVideo(event){
        video = event.target.files[0];
    }
    
    return{
        setVideo: setVideo,
        video: video
    }
})();



var formModule = (function(){
    function uploadVideo(event){
        if(videoModule.video == null)
            return alert('No file selected.');
        
        event.stopPropagation();
        event.preventDefault();
        
        var data = new FormData();
        data.append('a', videoModule.video);
        
        ajaxModule.postAjaxCall(data, 'uploadVideo', function(data){
            alert('fim');
        });
    }
    
    function getSignedRequest(){
        
    }
    
    return{
        uploadVideo: uploadVideo
    }
})();

$('input[type=file]').on('change', videoModule.setVideo);

$('form').on('submit', formModule.uploadVideo);