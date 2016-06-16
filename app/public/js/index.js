var video;

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

var videoModule = (function(){
    
    function convertVideo(){
        
    }

    function getSignedRequest(){
        var data = new FormData();
        data.append(0, video);
        
        alert('aqui');
        
        ajaxModule.getAjaxCall(data, 'uploadVideo?file-type='+ video.type, function(response){
            var respJson = JSON.parse(response);
            console.log(respJson);
            uploadVideoToS3(video, respJson.signedRequest, respJson.url);
        });        
    }

    function setVideo(event){
        video = event.target.files[0];
    }
        
    function uploadVideo(){
        if(video == null)
            return alert('No file selected.');
        
        getSignedRequest();
    }

    function uploadVideoToS3(file, signedRequest, url){
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signedRequest);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    // document.getElementById('preview').src = url;
                    // document.getElementById('avatar-url').value = url;
                    convertVideo();
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

var formModule = (function(){
    
    function getSignedRequest(event){
        
        event.stopPropagation();
        event.preventDefault();
        
        
    }
    
    function convertVideo(){
        
        var request = {
            'input': 'https://s3-sa-east-1.amazonaws.com/lg2290-video-converter/sample.dv',
            'outputs': [
                {
                    'url': 's3://lg2290-video-converter/test.mp4',
                    'credentials': 's3'
                }
            ] 
        }
        // Let's use $.ajax instead of $.post so we can specify custom headers.
        $.ajax({
            url: 'https://app.zencoder.com/api/v2/jobs',
            type: 'POST',
            data: JSON.stringify(request),
            headers: { "Zencoder-Api-Key": '691e4718a003c19666f3ea08788b121f' },
            dataType: 'json',
            success: function(data) {
            $('body').append('Job created! <a href="https://app.zencoder.com/jobs/'+ data.id +'">View Job</a>')
            },
            error: function(data) {
            console.log(data);
            }
        });  

    }
    
    return{
        getSignedRequest: getSignedRequest,
        convertVideo: convertVideo
    }
})();

var initModule = (function(){
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



