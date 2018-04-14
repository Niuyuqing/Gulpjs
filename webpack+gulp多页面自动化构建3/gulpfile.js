var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var webpackConf = require('./webpack.config.js');
var connect = require("gulp-connect");
var ejs  = require('gulp-ejs');  //ejs模板
var minhtml = require('gulp-htmlmin'); //html压缩

var globs = {
	js: 'app/js/**/*.js',
	less: 'app/less/**/*.less',
	html: 'app/**/*.html',
	map: 'build/src/**/*.map',
	assets: [
		'app/fonts/**/*',
		'app/images/**/*',
		'app/js/lib/**/*',
		'app/css/*'
	]
};

var jsDest = webpackConf.debug ? "build/js" : "build/src";

gulp.task('clean', function() {
	var dest = ['build/'];
	return gulp.src(dest, {
			read: false
		})
		.pipe(plugins.clean());
})

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
	
    gulp.src('app/*.ejs')
    	.pipe(ejs({},{},{ext: '.html'}))   //以HTML文件输出
        .pipe(ejs())
   		.pipe(gulp.dest('build'))
   		.pipe(minhtml(options))  
        .pipe(gulp.dest('build'))  
//      .pipe(browserSync.reload({stream:true}));
});

gulp.task("css", function() {
	return gulp.src(globs.less)
		.pipe(plugins.less())
		 //.pipe(plugins.minifyCss()) //debug close
		.pipe(gulp.dest("build/css"));
});

gulp.task('webpack', function() {
	return gulp.src(globs.js)
		.pipe(plugins.webpack(webpackConf))
		.pipe(gulp.dest(jsDest));
});

gulp.task('js', ['webpack'], function() {
	return gulp.src(jsDest + '/**/*.js')
//		 .pipe(plugins.uglify())   //debug close
//		 .pipe(plugins.rename(function (path) { // open while add min ext.
//		      path.basename = path.basename.replace(/\.main$/, '.min');
//		     if(!webpackConf.debug)
//		         path.basename = path.basename + ".min";
//		 }))
		.pipe(gulp.dest('build/js'));
});

gulp.task('assets', function() {
	return globs.assets.map(function(glob) {
		return gulp.src(glob)
			.pipe(gulp.dest(glob.replace(/\/\*.*$/, '').replace(/^app/, 'build')));
	});
});

gulp.task('html', function() {
	return gulp.src(globs.html)
		 //.pipe(plugins.htmlmin({collapseWhitespace: true})) //debug close
		.pipe(gulp.dest('build'));
});
//定义liverLOAD任务
gulp.task('connect', function() {
	connect.server({
		livereload: true,
		port: 3000,
	})
})
//定义看守任务
gulp.task('watch', function() {
	gulp.watch('app/*.ejs', ["ejs"]);
	gulp.watch("app/js/**/*.js", ["js"]);
	gulp.watch("app/less/**/*.less", ["css"]);
	gulp.watch("app/images/**/*", ["assets"]);
})

gulp.task('default', ['css', 'ejs', 'assets', 'js','watch']);