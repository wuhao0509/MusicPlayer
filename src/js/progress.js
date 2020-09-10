(function (root) {
    function Progress() {
        this.durTime = 0; //歌曲总时间
        this.frameId = null; //定时器
        this.startTime = 0; //开始播放时间
        this.lastPercent = 0; //上一次百分比

        this.init();
    }
    Progress.prototype = {
        init: function () {
            // console.log(1)
            this.getDom();
        },

        getDom: function () {
            this.curTime = document.querySelector('.curTime'),
                this.circle = document.querySelector('.circle'),
                this.frontBg = document.querySelector('.frontBg'),
                this.totalTime = document.querySelector('.totalTime')
        },

        //渲染总时间
        renderAllTime: function (time) {
            this.durTime = time;
            time = this.formatTime(time);
            this.totalTime.innerHTML = time;
        },

        //处理时间数据
        formatTime: function (time) {
            //四舍五入
            var time = Math.round(time);
            var m = Math.floor(time / 60),
                s = time % 60;

            m = m < 10 ? ('0' + m) : m;
            s = s < 10 ? ('0' + s) : s;
            return m + ':' + s;
        },

        //开启定时器
        //记录歌曲已播放时长占总时长百分比per
        move: function (per) {
            var This = this;
            this.lastPercent = per === undefined ? this.lastPercent : per; //bug4
            cancelAnimationFrame(This.frameId); //bug3
            this.startTime = new Date().getTime();

            function frame() {
                var curTime = new Date().getTime();
                // console.log(curTime)
                var per = This.lastPercent + (curTime - This.startTime) / (This.durTime * 1000); //时间对象算出来的单位是ms
                // console.log(per);
                if (per <= 1) {
                    This.update(per);
                } else {
                    cancelAnimationFrame(This.frameId);
                }
                This.frameId = requestAnimationFrame(frame); //H5新增方法 定时器
            }

            frame();
        },

        //更新进度条样式
        update: function (per) {
            // console.log(1);
            var This = this;
            var time = This.formatTime(per * this.durTime);
            this.curTime.innerHTML = time;

            this.frontBg.style.width = per * 100 + '%';

            var l = per * this.circle.parentNode.offsetWidth;
            this.circle.style.transform = 'translate(' + l + 'px)';
        },

        //进度条停止
        stop: function () {
            cancelAnimationFrame(this.frameId);
            var stopTime = new Date().getTime();
            this.lastPercent += (stopTime - this.startTime) / (this.durTime * 1000); //bug1????????
        },
    };

    function instancesProgress() {
        return new Progress();
    }

    function Drag(obj) {
        this.obj = obj;
        this.startPointX = 0;
        this.startLeft = 0;
        this.percent = 0
    
        this.init();
    }

    Drag.prototype = {
        init: function () {
            var This = this;
            this.obj.style.transform = 'translateX(0)';

            this.obj.addEventListener('touchstart', function (ev) {
                This.startPointX = ev.changedTouches[0].pageX; //手机屏幕上有几根手指，数组里就有几个元素
                This.startLeft = parseFloat(this.style.transform.split('(')[1]);

                This.start && This.start(); //给用户提供一个对外的方法
            })

            this.obj.addEventListener('touchmove', function (ev) {
                This.disPointX = ev.changedTouches[0].pageX - This.startPointX;
                var l = This.disPointX + This.startLeft;

                if (l < 0) {
                    l = 0;
                } else if (l > this.offsetParent.offsetWidth) {
                    l = this.offsetParent.offsetWidth;
                }

                this.style.transform = 'translate(' + l + 'px)';
                This.percent = l/ this.offsetParent.offsetWidth;
                This.move && This.move(This.percent);

                ev.preventDefault();
            })

            this.obj.addEventListener('touchmove', function (ev) {
                This.end && This.end(This.percent);
            })
        }
    }

    function instancesDrag(obj) {
        return new Drag(obj);
    }

    root.progress = {
        pro: instancesProgress,
        drag: instancesDrag
    }
}(window.player || (window.player = {})))