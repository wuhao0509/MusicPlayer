const {
    series,
    src,
    dest,
    watch
} = require('gulp');
/* 插件：对html文件进行压缩 */
const htmlClean = require('gulp-htmlclean');
/* 插件：将less转换成css文件 */
const less = require('gulp-less');
/* 插件：压缩css文件 */
const cleanCss = require('gulp-clean-css');
/* 插件：取出JS文件中调试语句和console因为项目上线之后就用不到了 */
const stripDebug = require('gulp-strip-debug');
/* 插件：压缩js文件 */
const uglify = require('gulp-uglify');
/* 插件：压缩图片 */
const imgMin = require('gulp-imagemin');
/* 插件：服务器 */
const connect = require('gulp-connect');

const folder = {
    src: 'src/',
    dist: 'dist/'
}

function html() {
    return src(folder.src + 'html/*')
        .pipe(htmlClean())
        .pipe(dest(folder.dist + 'html/'))
        .pipe(connect.reload())/* reload热更新  即重新加载文件 */
}

function css() {
    return src(folder.src + 'css/*')
        .pipe(less())
        .pipe(cleanCss())
        .pipe(dest(folder.dist + 'css/'))
        .pipe(connect.reload())
}

function js() {
    return src(folder.src + 'js/*')
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(dest(folder.dist + 'js/'))
        .pipe(connect.reload())
}

function images() {
    return src(folder.src + 'images/*')
        .pipe(imgMin())
        .pipe(dest(folder.dist + 'images/'))
}

function server(cb) {
    connect.server({
        port: '1573',
        livereload: true //自动刷新
    })

    cb()
}

// 实现实时更新必须用watch 只设置watch之后手动刷新才会更新  设置reload才能实现实时刷新 即热更新
watch(folder.src + 'html/*',function(cb){
    html();
    cb();
})
watch(folder.src + 'js/*',function(cb){
    js();
    cb();
})
watch(folder.src + 'css/*',function(cb){
    css();
    cb();
})

exports.default = series(html, css, js, images,server)