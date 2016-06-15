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
        this.video = event.target.files[0];
    }
    
    function getVideo(){
        return this.video;
    }
    
    return{
        setVideo: setVideo,
        getVideo: getVideo
    }
})();


var video;
function setVideo(event){
    video = event.target.files[0];
}

var formModule = (function(){
    function uploadVideo(file, signedRequest, url){
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signedRequest);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    document.getElementById('preview').src = url;
                    document.getElementById('avatar-url').value = url;
                    }
                else{
                    alert('Could not upload file.');
                }
            }
        };
        
        xhr.send(file);
    }
    
    function getSignedRequest(event){
        if(video == null)
            return alert('No file selected.');
        
        event.stopPropagation();
        event.preventDefault();
        
        var data = new FormData();
        data.append(0, video);
        
        ajaxModule.getAjaxCall(data, 'uploadVideo?file-name='+ video.name +'&file-type='+ video.type, function(data){ 
            uploadVideo(video, JSON.parse(data).signedRequest, JSON.parse(data).url);
        });        
    }
    
    return{
        getSignedRequest: getSignedRequest,
        uploadVideo: uploadVideo
    }
})();

$('input[type=file]').on('change', setVideo);

$('form').on('submit', formModule.getSignedRequest);