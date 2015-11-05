'use strict';

var gulp = require('gulp');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var del = require('del');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');
var closureCompiler = require('gulp-closure-compiler');
var browserSync = require('browser-sync').create();

// Clean
gulp.task('clean', function() {
    return del([ 'distribution/**' ]);
});

gulp.task('js', function() {
    return browserify(['./js/redsift.js']).bundle()
        .pipe(source('redsift-global.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./distribution/js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename({suffix: '.es5'}))
        .pipe(gulp.dest('./distribution/js'))
        .pipe(closureCompiler({
            compilerPath: 'bower_components/closure-compiler/compiler.jar',
            fileName: 'redsift-global.es5.min.js'
        }))
        .pipe(gulp.dest('./distribution/js'));
});

// Workaround for https://github.com/gulpjs/gulp/issues/71
var origSrc = gulp.src;
gulp.src = function () {
    return fixPipe(origSrc.apply(this, arguments));
};
function fixPipe(stream) {
    var origPipe = stream.pipe;
    stream.pipe = function (dest) {
        arguments[0] = dest.on('error', function (error) {
            var nextStreams = dest._nextStreams;
            if (nextStreams) {
                nextStreams.forEach(function (nextStream) {
                    nextStream.emit('error', error);
                });
            } else if (dest.listeners('error').length === 1) {
                throw error;
            }
        });
        var nextStream = fixPipe(origPipe.apply(this, arguments));
        (this._nextStreams || (this._nextStreams = [])).push(nextStream);
        return nextStream;
    };
    return stream;
}

function makeCss(name) {
    return gulp.src([
            './node_modules/normalize.css/**.css',      
            './css/' + name + '.styl',
            './css/**.css'
        ])
        .pipe(sourcemaps.init())
        .pipe(stylus())
        .pipe(concat(name + '.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./distribution/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifyCss({compatibility: '*', roundingPrecision: 4, keepSpecialComments: 0}))
        .pipe(sourcemaps.write('../../distribution/maps'))
        .pipe(gulp.dest('./distribution/css'))
        .pipe(browserSync.stream())
        .on('error', function (e) {
            console.error(e.message);
        });
}

gulp.task('css-light', function () {
    return makeCss('redsift-light');
});

gulp.task('css-dark', function () {
    return makeCss('redsift-dark');
});

gulp.task('css', ['css-light', 'css-dark']);

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: [ "./samples", "./distribution" ],
            directory: true
        }
    });
});

gulp.task('js-watch', ['js'], browserSync.reload);

gulp.task('serve', ['default', 'browser-sync'] , function() {
    gulp.watch(['./css/**/*.styl', './css/**/*.css'], ['css']);
    gulp.watch(['./js/**/*.js'], ['js-watch']);
    gulp.watch("./samples/*.html").on('change', browserSync.reload);
});

gulp.task('default', [ 'css', 'js' ]);