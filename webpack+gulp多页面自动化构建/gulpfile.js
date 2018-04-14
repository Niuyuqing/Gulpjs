var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var webpackConf = require('./webpack.config.js');
var connect=require("gulp-connect")

var globs = {
    js: 'app/js/**/*.js',
    less: 'app/less/**/*.less',
    html: 'app/**/*.html',
    map: 'build/src/**/*.map',
    assets: [
        'app/fonts/**/*',
        'app/images/**/*',
        'app/js/lib/**/*',
    ]
};

var jsDest = webpackConf.debug ? "build/js" : "build/src";


gulp.task('clean', function () {
    var dest = ['build/'];
    return gulp.src(dest, {read: false})
        .pipe(plugins.clean());
})

gulp.task("css", function () {
    return gulp.src(globs.less)
        .pipe(plugins.less())
        // .pipe(plugins.minifyCss()) //debug close
        .pipe(gulp.dest("build/css"));
});


gulp.task('webpack', function () {
    return gulp.src(globs.js)
        .pipe(plugins.webpack(webpackConf))
        .pipe(gulp.dest(jsDest));
});

gulp.task('js', ['webpack'], function () {
    return gulp.src(jsDest + '/**/*.js')
        // .pipe(plugins.uglify())   //debug close
        // .pipe(plugins.rename(function (path) { // open while add min ext.
        //     // path.basename = path.basename.replace(/\.main$/, '.min');
        //     if(!webpackConf.debug)
        //         path.basename = path.basename + ".min";
        // }))
        .pipe(gulp.dest('build/js'));
});

gulp.task('assets', function () {
    return globs.assets.map(function (glob) {
        return gulp.src(glob)
            .pipe(gulp.dest(glob.replace(/\/\*.*$/, '').replace(/^app/, 'build')));
    });
});

gulp.task('html', function () {
    return gulp.src(globs.html)
        // .pipe(plugins.htmlmin({collapseWhitespace: true})) //debug close
        .pipe(gulp.dest('build'));
});
// //定义liverLOAD任务
// gulp.task('connect',function () {
//     connect.server({
//         livereload:true
//     })
// })
// //定义看守任务
// gulp.task('watch',function () {
//     gulp.watch('app/**/*.html',["html"]);
//     gulp.watch("app/js/**/*.js",["js"]);
//     gulp.watch("app/less/**/*.less",["css"])
// })

gulp.task('default', ['css', 'html', 'assets', 'js']);