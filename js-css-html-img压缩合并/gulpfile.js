var gulp = require('gulp');

//引入组件
var minhtml = require('gulp-htmlmin'), //html压缩
	ejs  = require('gulp-ejs'),  //ejs模板
	less = require('gulp-less'),  //less转换CSS
	minifycss = require('gulp-minify-css'), //CSS压缩
	cleanCSS = require('gulp-clean-css'), //压缩CSS为一行；  
	autoprefixer = require('gulp-autoprefixer'),   //根据设置浏览器版本自动处理浏览器前缀
	concat = require('gulp-concat'),  //合并文件
	rename = require('gulp-rename'),  //重命名
	jshint = require('gulp-jshint'),  //js代码规范性检查
	uglify = require('gulp-uglify'),  //js代码压缩
	imagemin = require('gulp-imagemin'),  //图片压缩
	pngquant = require('imagemin-pngquant'), // 深度压缩
	clean = require('gulp-clean'),  //清空文件夹
	cache = require('gulp-cache'),  //只压缩修改的图片	
	connect = require('gulp-connect'),  //使用connect启动一个Web服务器
	changed  = require('gulp-changed'),  //检查改变状态 
	del = require('del'),
	browserSync = require("browser-sync").create(),   //浏览器实时刷新
	md5 = require('gulp-md5-plus');  //发版本的时候为了避免浏览器读取了旧的缓存文件，需要为其添加md5戳

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
    	.pipe(ejs({},{},{ext: '.html'}))   //以HTML文件输出
        .pipe(ejs())
   		.pipe(gulp.dest('dist'))
   		.pipe(minhtml(options))  
        .pipe(gulp.dest('dist'))  
        .pipe(browserSync.reload({stream:true}));
});

/*gulp.task('html',function () {
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
	gulp.src('src/*.html')  
        .pipe(changed('dist', {hasChanged: changed.compareSha1Digest}))  
        .pipe(minhtml(options))  
        .pipe(gulp.dest('dist'))  
        .pipe(browserSync.reload({stream:true}));  
});*/

gulp.task('js',function (done) {
	gulp.src('src/js/*.js')
	.pipe(changed('dist/js', {hasChanged: changed.compareSha1Digest}))  
	.pipe(jshint())	
	.pipe(jshint.reporter('default'))
	.pipe(concat('merge.js'))
	.pipe(rename({
		suffix:'.min'
	}))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'))
	.pipe(browserSync.reload({stream:true}))
	.on('end', done);
});

/*gulp.task('css', function(argument) {
	gulp.src('src/css/*.less')
		.pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true 
        }))
		.pipe(less())
		.pipe(concat('merge.css'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(minifycss())
		.pipe(gulp.dest('dist/css'));
});*/

//实时编译less  
gulp.task('css', function (done) {  
    gulp.src(['./src/css/*.less']) //多个文件以数组形式传入  
        .pipe(changed('dist/css', {hasChanged: changed.compareSha1Digest}))  
        .pipe(less())//编译less文件  
        .pipe(concat('main.css'))//合并之后生成main.css  
        .pipe(cleanCSS())//压缩新生成的css  
        .pipe(gulp.dest('dist/css'))//将会在css下生成main.css  
        .pipe(browserSync.reload({stream:true}))
        .on('end', done);
});  

// 压缩图片  
gulp.task('img', function (done) {  
    gulp.src('./src/img/*.*')  
        .pipe(changed('dist/img', {hasChanged: changed.compareSha1Digest}))  
        .pipe(imagemin({  
            progressive: true,// 无损压缩JPG图片  
            svgoPlugins: [{removeViewBox: false}], // 不移除svg的viewbox属性  
            use: [pngquant()] // 使用pngquant插件进行深度压缩  
        }))  
        .pipe(gulp.dest('dist/img'))  
        .pipe(browserSync.reload({stream:true}))
        .on('end', done);
});  

gulp.task('clear',function () {
	gulp.src('dist/*',{read:false})
	.pipe(clean());
});


/*gulp.task('connect', function() {
    connect.server({
        //host: '192.168.1.172', //地址，可不写，不写的话，默认localhost
        port: 3000, //端口号，可不写，默认8000
        root: './', //当前项目主目录
        livereload: true //自动刷新
    });
});*/

//删除dist下的所有文件  
gulp.task('delete',function(cb){  
    return del(['dist/*','!dist/img'],cb);  
})  

//启动热更新  
gulp.task('serve', ['delete'], function() {  
    gulp.start('ejs','js','css','html');
    browserSync.init({  
        port: 2017,  
        server: {  
            baseDir: ['dist']  
        }  
    });  
    gulp.watch('src/js/*.js', ['js']);         //监控文件变化，自动更新  
    gulp.watch('src/css/*.less', ['css']);  
    gulp.watch('src/*.html', ['html']);  
    gulp.watch('src/img/*.*', ['img']);
});  
  
gulp.task('build',['ejs','css','html','js','img']);

gulp.task('default',['serve']);