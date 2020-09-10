(function ($, player) {
    function MusicPlayer(dom) {
        this.wrap = dom;
        this.dataList = [];
        // this.now = 2;  //临时索引值
        this.rotateTimer = null; //旋转唱片的定时器

        this.indexObj = null; //索引值对象(用于切歌)
        this.list = null; //列表切歌对象（在listPlay里赋了值）
        this.curIndex = 0; //当前歌曲索引值

        this.progress = player.progress.pro(); //进度条对象
    }

    MusicPlayer.prototype = {
        init: function () {
            this.getDom(); //获取元素
            this.getData('../mock/data.json'); //获取数据
        },
        getDom: function () {
            this.record = document.querySelector('.songImg img'); //旋转图片
            this.controlBtns = document.querySelectorAll('.control li'); //底部导航里的按钮
        },
        getData: function (url) {
            var This = this;
            $.ajax({
                url: url,
                method: 'get',
                success: function (data) {
                    // console.log(this)
                    This.dataList = data; //存储请求过来的数据
                    This.listPlay();
                    This.indexObj = new player.controlIndex(data.length); //给索引值对象赋值
                    console.log(data);
                    This.loadMusic(This.indexObj.index); //加载音乐
                    This.musicControl(); //添加音乐操作功能

                    This.dragProgress();
                },
                error: function () {
                    console.log('数据请求失败');
                    this.status = 'pause';
                }
            })
        },
        loadMusic: function (index) { //加载音乐
            player.render(this.dataList[index]);
            player.music.load(this.dataList[index].audioSrc);

            //渲染音乐总时间
            this.progress.renderAllTime(this.dataList[index].duration);

            if (player.music.status == 'play') {
                player.music.play();
                this.controlBtns[2].className = 'playing'; //按钮状态变成播放状态
                this.imgRotate(0); //切歌时旋转图片

                this.progress.move(0); //bug2切歌时,让进度条运动
            }

            this.list.changeSelect(index);
            this.curIndex = index;
        },
        musicControl: function () { //控制音乐(上一首，下一首)
            var This = this;
            //上一首
            this.controlBtns[1].addEventListener('touchend', function () {
                player.music.status = 'play';
                // This.loadMusic(--This.now);
                This.loadMusic(This.indexObj.prev());
            })

            //播放 暂停
            this.controlBtns[2].addEventListener('touchend', function () {
                if (player.music.status == 'play') {
                    player.music.pause();
                    this.className = '';
                    This.imgStop();

                    This.progress.stop();
                } else {
                    player.music.play();
                    this.className = 'playing';
                    //第二次播放的时候需要加上上一次的旋转角度，但是第一次这个角度是没有的，取不到。所以做了容错处理(deg||0)
                    var deg = This.record.dataset.rotate;
                    This.imgRotate(deg || 0); //切歌时旋转图片

                    This.progress.move();
                }
            })

            //下一首
            this.controlBtns[3].addEventListener('touchend', function () {
                player.music.status = 'play';
                // This.loadMusic(++This.now);
                This.loadMusic(This.indexObj.next());
            })
        },
        imgRotate: function (deg) {
            var This = this;
            clearInterval(this.rotateTimer);
            this.rotateTimer = setInterval(function () {
                deg = +deg + 0.2; //'+'隐式类型转化，将字符串转换成数字
                This.record.style.transform = 'rotate(' + deg + 'deg)';
                This.record.dataset.rotate = deg; //把旋转的角度存到标签身上，为了暂停之后播放能被取到
            }, 1000 / 60)
        },
        imgStop: function () { //停止图片旋转
            clearInterval(this.rotateTimer);
        },
        listPlay: function () { //把listControl对象赋值给this.list
            var This = this;
            this.list = player.listControl(this.dataList, this.wrap);

            this.controlBtns[4].addEventListener('touchend', function () {
                This.list.slideUp();
            });

            this.list.musicList.forEach(function (elem, index) {
                elem.addEventListener('touchend', function () {
                    //如果点击的是当前的那首歌，不管它是播放还是暂停都无效
                    if (This.curIndex == index) {
                        return;
                    }

                    player.music.status = 'play'; //歌曲要变成播放状态
                    This.indexObj.index = index; //索引值对象身上的当前索引值要更新
                    This.loadMusic(index); //加载点击对应的索引值的那首歌曲
                    This.list.slideDown(); //列表消失
                })
            })
        },

        dragProgress: function () {
            var This = this;
            var circle = player.progress.drag(document.querySelector('.circle'));

            circle.start = function () {
                console.log(111111111);

                This.progress.stop();
            }
            circle.move = function (per) {
                This.progress.update(per);
            }
            circle.end = function (per) {
                var cutTime = per * This.dataList[This.indexObj.index].duration;

                player.music.playTo(cutTime);
                player.music.play();

                This.progress.move(per);

                var deg = This.record.dataset.rotate;
                This.imgRotate(deg || 0); //切歌时旋转图片

                //按钮状态
                This.controlBtns[2].className = 'playing';
            }
        }
    }
    var musicPlayer = new MusicPlayer(document.getElementById('wrap'));
    musicPlayer.init();
}(window.Zepto, window.player))