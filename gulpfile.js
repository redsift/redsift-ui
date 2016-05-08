'use strict';

var gulp = require('gulp');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var minifyCss = require('gulp-cssnano');
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
var plumber = require('gulp-plumber');
var streamqueue = require('streamqueue');
var spawn = require('child_process').spawn;
var path = require('path');


// Clean
gulp.task('clean', function() {
    return del(['dist/**']);
});

gulp.task('js', function() {
    return streamqueue({
                objectMode: true
            },
            gulp.src('./node_modules/babel-polyfill/browser.js'),
            browserify(['./js/redsift.js'])
            .bundle()
            .pipe(source('./js/redsift-browserify.js')))
        .pipe(buffer())
        .pipe(concat('redsift-global.js'))
        .pipe(plumber())
        .pipe(gulp.dest('./dist/js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename({
            suffix: '.es5'
        }))
        .pipe(gulp.dest('./dist/js'))
        .pipe(closureCompiler({
            compilerPath: 'bower_components/closure-compiler/compiler.jar',
            fileName: 'redsift-global.es5.min.js',
            continueWithWarnings: true
        }))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('rollup', function() {
    var child = spawn("./node_modules/rollup/bin/rollup", ["-c"], {
        cwd: process.cwd()
    });

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function(data) {
        console.log(data.toString());
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function(data) {
        console.log(data.toString());
    });
});

function makeCss(bundleName, file) {
    // return gulp.src([
    //         './node_modules/normalize.css/**.css',
    //         './css/' + files + '.styl',
    //         './css/**.css'
    //     ])

console.log('[makeCss] processing file: ' + file);
    var filebase = path.basename(file);

    return gulp.src([file])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(stylus())
        .pipe(concat(filebase + '.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        // .pipe(gulp.dest('./dist/css'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifyCss({
            compatibility: '*',
            roundingPrecision: 4,
            keepSpecialComments: 0
        }))
        // .pipe(sourcemaps.write('./dist/maps'))
        .pipe(sourcemaps.write())
        // .pipe(gulp.dest('./dist/css'))
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream())
        .on('error', function(e) {
            console.error(e.message);
        });
}

// To activate the meteor refresh logic create the JSON file "trigger-app-reload.json"
// next to the gulpfile.js with the following content:
// {
//    "watchedFolder": "/path/to/meteor/folder"
// }
// where the given path is a folder which meteor will reload automatically on a
// file change.
function appRefresh() {
    var fs = require('fs'),
        path = require('path');

    var configFilePath = path.join(__dirname, 'trigger-app-reload.json'),
        configFile = null;

    try {
        configFile = fs.readFileSync(configFilePath);
    } catch (err) {
        console.log('No config file "trigger-app-reload.json" found, skipping reloading trigger...');
    }

    if (configFile) {
        var config = JSON.parse(configFile);

        if (config && config.watchedFolder) {
            var now = Date.now(),
                outputFilePath = path.join(config.watchedFolder, 'ignore-me-from-redsift-ui.js'),
                content = 'var now = ' + now + ';';

            fs.writeFile(outputFilePath, content, function() {
                console.log('Triggered application reload via "%s"...', outputFilePath);
            });
        }
    }
}

gulp.task('css-light', function() {
    return makeCss('redsift-light');
});

gulp.task('css-dark', function() {
    return makeCss('redsift-dark');
});

gulp.task('css-xtra', function() {
    return makeCss('redsift-xtra');
});

gulp.task('css', ['css-light', 'css-dark', 'css-xtra'], function() {
    return appRefresh();
});

gulp.task('js-watch', ['js'], function() {
    browserSync.reload('*.js');
});

gulp.task('es6-watch', ['rollup'], function() {
    browserSync.reload('*.js');
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: ['./samples', './dist', './assets'],
            directory: true
        }
    });
});

gulp.task('serve', ['default', 'browser-sync'], function() {
    gulp.watch(['./css/**/*.{import.styl,styl,css}'], ['css']);
    gulp.watch(['./components/**/*.{js,tmpl,styl}'], ['es6-watch']);
    gulp.watch(['./js/**/*.js'], ['js-watch']);
    gulp.watch('./samples/**/*.html').on('change', function() {
        browserSync.reload('*.html');
    });
});

gulp.task('default', ['css', 'rollup', 'js']);

var paths = {
  dest: './dist'
}

function compileStylus(bundleName, file) {
  return gulp.src([file])
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(stylus())
      .pipe(concat(bundleName + '.css'))
      .pipe(autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(paths.dest));
}

gulp.task('build', ['rollup'], function() {
  compileStylus('redsift-light', './bundles/full/redsift-light.styl');
});
