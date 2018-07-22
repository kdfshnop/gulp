//载入所用工具;
var gulp =require("gulp");
// gulp中任务是异步执行的，如果想要同步执行，可利用此插件;
var sequence=require("gulp-sequence");//国内版;
var runSequence= require('gulp-run-sequence');//国外版;


// 在执行打包的时候，一般都需要先清理目标文件夹，以保证每次打包时，都是最新的文件。
var clean=require("gulp-clean");
//定义任务;hello为任务名;
gulp.task('hello',function () {
   console.log(111)
});
// gulp原生API:task(创建任务),src(获取文件),dest(文件导出),watch(监听文件变化，执行任务);
// 拷贝文件;单文件
gulp.task('singleCopy',function(){
    // src获取文件;pipe管道流，dest为destination（目的地）的缩写;将文件处理到哪里;
    gulp.src('src/index.html')
        .pipe(gulp.dest('dist/'))
});
// 多文件copy;
gulp.task('moreCopy',function(){
    gulp.src('./src/*.html')
        .pipe(gulp.dest('dist/'))
});
// 任意文件;src/*/*.*;src下面的一个*号，只代表src下的一级子目录;

gulp.task('allCopy',function(){
    gulp.src('./src/*/*.*')
        .pipe(gulp.dest('./dist'))
});
// 如果此时css下再有一个文件夹如demo/estate.css，则上式无法完成文件的copy;
// 针对此情况gulp中**代表递归加载下面的所有文件;此时在less中添加demo文件夹;
gulp.task('allRoute',function(){
    gulp.src('src/**/*.*')
        .pipe(gulp.dest('dist/'))
});

// 文件匹配规则[globs匹配语法];
//  src/*
//  src/*/*
//  src/**/*
//  src/*.jpg
//  src/*.{jpg,png}
// 多个globs如下:多个并列文件夹;！代表排除某个文件;
// gulp.src(['src1/**/*.html','src2/**/*.css','!src1/estate.html'])


// 默认任务;
gulp.task('default',function(){
    console.log('默认任务，直接运行gulp即可')
});
// 监视;
gulp.task('watchChange',function(){
    // 当定义的文件发生变化时，自动执行后面的任务;
    gulp.watch('src/',['allRoute'])
});


// gulp原本不支持任何功能，只提供基础的API，如果想要实现压缩等功能，需要借助基于gulp的插件;\

// less-css;
var less=require('gulp-less');
gulp.task('less',function(){
    gulp.src('./src/less/**/*.less')
        // 让less转变为css;
        .pipe(less())
        .pipe(gulp.dest('src/css'))
});

// es6-es5;
var babel=require("gulp-babel");
gulp.task('es6-es5',function(){
    gulp.src("./src/**/*.js")
        .pipe(babel())
        .pipe(gulp.dest('./dist/'))
})

// 本地服务;
var connect=require('gulp-connect');
gulp.task('localServer',function(){
    connect.server({
        root:'src',
        livereload:true
    });
    // gulp.watch('./src/**/*.less',['less']);
    // gulp.watch(['./src/**/*.less','./src/**/*.html'],['pageReload']);
    gulp.watch(['./src/**/*.less','./src/**/*.html'],function(callback){
        sequence('less','pageReload')(function(err){
            if(err)console.log(err);
        })//可用，必须带上后面的函数
        // runSequence('less','pageReload',cb)暂时不对
    })
});
// 定义任务reload,供watch使用;实时加载
gulp.task('pageReload',function(){
   return gulp.src(['./src/**/*.less','./src/**/*.html'])
        .pipe(connect.reload())
});
