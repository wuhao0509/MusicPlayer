(function (root) {
    function Index(len) {
        this.index = 0; //当前索引值
        this.len = len; //数据长度 用于做判断
    }

    Index.prototype = {
        //该方法用来取上一个索引
        prev:function() {
            return this.get(-1)
        },

        //取下一个索引
        next:function() {
            return this.get(1)
        },

        //用来获取索引 参数为 +1 -1 用+1 -1来区分左右
        get:function(val) {
            //用一行代码来解决两个边界的问题
            this.index = (this.index + val + this.len) % this.len;
            return this.index;
        }
    }

    //把构造函数暴漏出去，因为实例对象要传参，所以实例对象不能暴漏出去
    root.controlIndex = Index;
}(window.player || (widnow.player = {})))