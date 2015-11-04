'use strict';

var gulp = require('gulp');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var del = require('del');

// Clean
gulp.task('clean', function() {
    return del([ 'distribution/**' ]);
});

gulp.task('css', function () {
    return gulp.src([
            './node_modules/normalize.css/**.css',      
            './css/**.styl',
            './css/**.css'
        ])
        .pipe(sourcemaps.init())
        .pipe(stylus())
        .pipe(concat('redsift.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./distribution/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifyCss({compatibility: '*', roundingPrecision: 4}))
        .pipe(sourcemaps.write('../../distribution/maps'))
        .pipe(gulp.dest('./distribution/css'));
});

gulp.task('default', [ 'css' ]);