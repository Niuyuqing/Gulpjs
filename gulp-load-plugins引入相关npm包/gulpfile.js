var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: true});  //自动require你在package.json中声明的依赖 ,加载gulp-load-plugins的时候传入了{lazy: true}参数，这个参数可以让gulp的插件按需加载
var browserSync = require("browser-sync").create(),   //浏览器实时刷新
	changed = require("gulp-changed"),
	pngquant = require('imagemin-pngquant'),  // 深度压缩
	del = require('del');

gulp.task('ejs', function() {
	var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
	
    gulp.src('src/**.ejs')
    	.pipe($.ejs({},{},{ext: '.html'}))   //以HTML文件输出
        .pipe($.ejs())
   		.pipe(gulp.dest('dist'))
   		.pipe($.htmlmin(options))  
        .pipe(gulp.dest('dist'))  
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('js',function (done) {
	gulp.src('src/js/*.js')
	.pipe(changed('dist/js', {hasChanged: changed.compareSha1Digest}))  
	.pipe($.jshint())	
	.pipe($.jshint.reporter('default'))
	.pipe($.concat('merge.js'))
	.pipe($.rename({
		suffix:'.min'
	}))
	.pipe($.uglify())
	.pipe(gulp.dest('dist/js'))
	.pipe(browserSync.reload({stream:true}))
	.on('end', done);
});

//实时编译less  
gulp.task('css', function (done) {  
    gulp.src(['./src/css/*.less']) //多个文件以数组形式传入  
        .pipe(changed('dist/css', {hasChanged: changed.compareSha1Digest}))  
        .pipe($.less())//编译less文件  
        .pipe($.concat('main.css'))//合并之后生成main.css  
        .pipe($.cleanCss())//压缩新生成的css  
        .pipe(gulp.dest('dist/css'))//将会在css下生成main.css  
        .pipe(browserSync.reload({stream:true}))
        .on('end', done);
});  

// 压缩图片  
gulp.task('img', function (done) {  
    gulp.src('./src/img/*.*')  
        .pipe(changed('dist/img', {hasChanged: changed.compareSha1Digest}))  
        .pipe($.imagemin({  
            progressive: true,// 无损压缩JPG图片  
            svgoPlugins: [{removeViewBox: false}], // 不移除svg的viewbox属性  
            use: [pngquant()] // 使用pngquant插件进行深度压缩  
        }))  
        .pipe(gulp.dest('dist/img'))  
        .pipe(browserSync.reload({stream:true}))
        .on('end', done);
});  

//删除dist下的所有文件,除了图片以外
gulp.task('clear',function () {
	gulp.src(['dist/*','!dist/img'],{read:false})
	.pipe($.clean());
});

//删除dist下的所有文件  
gulp.task('delete',function(cb){  
    return del(['dist/*','!dist/img'],cb);  
});

//启动热更新  
gulp.task('serve', ['delete'], function() {  
    gulp.start('ejs','js','css');
    browserSync.init({  
        port: 2017,  
        server: {  
            baseDir: ['dist']  
        }  
    });  
    gulp.watch('src/js/*.js', ['js']);         //监控文件变化，自动更新  
    gulp.watch('src/css/*.less', ['css']);  
    gulp.watch('src/img/*.*', ['img']);
    gulp.watch('src/*.ejs', ['ejs']);  
});  
  
gulp.task('build',['ejs','css','js','img']);

gulp.task('default',['serve']);