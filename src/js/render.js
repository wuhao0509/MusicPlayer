// 渲染功能：渲染图片，音乐信息，是否喜欢
;(function(root){
    // 渲染图片
    function renderImg(src){
        root.blurImg(src);//高斯模糊

        var img = document.querySelector('.songImg img')
        img.src = src;
    }

    // 音乐信息
    function renderIfo(data){
        var songInfoChildren = document.querySelector('.songInfo').children;
        songInfoChildren[0].innerHTML = data.name;
        songInfoChildren[1].innerHTML = data.singer;
        songInfoChildren[2].innerHTML = data.album;
    }
    // 是否喜欢
    function renderIsLike(isLike){
        var lis = document.querySelectorAll('.control li');
        lis[0].className = isLike?'liking':''
    }
    
    root.render = function(data){//data是请求过来的数据，必须给
        renderImg(data.image);
        renderIfo(data);
        renderIsLike(data.isLike);
    };
}(window.player || (window.player ={})));