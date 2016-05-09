'use strict';

var gulp = require('gulp');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var minifyCss = require('gulp-cleancss');
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
var rollup = require('rollup');
var json = require('rollup-plugin-json');
// var babel = require('rollup-plugin-babel');
var buble = require('rollup-plugin-buble');
var string = require('rollup-plugin-string');
var filesize = require('rollup-plugin-filesize');
var uglify = require('rollup-plugin-uglify');

var paths = {
    dest: './dist'
}

var bundles = [{
    name: 'redsift-light',
    formats: ['umd', 'es6'],
    indexFileJS: './bundles/full/index.js',
    indexFileStyle: './bundles/full/redsift-light.styl',
    outputFolder: path.join(paths.dest, 'full'),
    mapsDest: '.'
},{
    name: 'redsift-light',
    formats: ['umd', 'es6'],
    indexFileJS: './bundles/core/index.js',
    indexFileStyle: './bundles/core/redsift-light.styl',
    outputFolder: path.join(paths.dest, 'core'),
    mapsDest: '.'
}];

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

gulp.task('bundle-js', function() {
    for (var idx = 0; idx < bundles.length; idx++) {
        var config = bundles[idx];

        for (var i = 0; i < config.formats.length; i++) {
            var format = config.formats[i],
                dest = path.join(config.outputFolder, 'js', 'redsift-ui.' + format + '.js');

            if (format === 'es6') {
                bundleES6(config.indexFileJS, dest);
            } else {
                transpileES6(config.indexFileJS, dest, format);
            }
        }
    };
});

gulp.task('bundle-css', function() {
  for (var idx = 0; idx < bundles.length; idx++) {
    var config = bundles[idx];

    makeCssBundle({
        name: config.name,
        dest: path.join(config.outputFolder, 'css'),
        indexFile: config.indexFileStyle,
        mapsDest: config.mapsDest
    });
  }
});

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

gulp.task('es6-watch', ['bundle-js'], function() {
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

gulp.task('build', ['bundle-js', 'bundle-css']);

gulp.task('default', ['css', 'bundle-js', 'js']);


function bundleES6(indexFile, dest) {
    rollup.rollup({
        entry: indexFile,
        plugins: [
            json(),
            string({
                extensions: ['.tmpl']
            }),
            filesize()
        ]
    }).then(function(bundle) {
        bundle.write({
            format: 'es6',
            dest: dest
        });
    }).catch(function(err) {
        console.log('rollup err: ' + err);
    });
}

function transpileES6(indexFile, dest, format) {
    rollup.rollup({
        entry: indexFile,
        plugins: [
            json(),
            string({
                extensions: ['.tmpl']
            }),
            // CAUTION: make sure to initialize all additional plugins BEFORE babel()
            // buble(). Otherwise the transpiler will consume the imported files first.
            // babel(),
            buble(),
            filesize()
        ]
    }).then(function(bundle) {
        bundle.write({
            format: format,
            dest: dest
        });
    }).catch(function(err) {
        console.log('rollup err: ' + err);
    });

    // FIXXME: use standalone gulp-uglify on concatenated js file to not run through rollup again!
    rollup.rollup({
        entry: indexFile,
        plugins: [
            json(),
            string({
                extensions: ['.tmpl']
            }),
            // CAUTION: make sure to initialize all additional plugins BEFORE babel()
            // buble(). Otherwise the transpiler will consume the imported files first.
            // babel(),
            buble(),
            filesize(),
            uglify()
        ]
    }).then(function(bundle) {
        var dirname = path.dirname(dest),
            basename = path.basename(dest),
            destMin = path.join(dirname, basename) + '.min.js';

        bundle.write({
            format: format,
            dest: destMin
        });
    }).catch(function(err) {
        console.log('rollup err: ' + err);
    });
}

function makeCss(name) {
    return gulp.src([
            './node_modules/normalize.css/**.css',
            './css/' + name + '.styl',
            './css/**.css'
        ])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(stylus())
        .pipe(concat(name + '.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifyCss({
            compatibility: '*',
            roundingPrecision: 4,
            keepSpecialComments: 0
        }))
        .pipe(sourcemaps.write('../../dist/maps'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream())
        .on('error', function(e) {
            console.error(e.message);
        });
}

function makeCssBundle(opts) {
    return gulp.src([
            './node_modules/normalize.css/**.css',
            opts.indexFile
        ])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(stylus())
        .pipe(concat(opts.name + '.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(opts.dest))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifyCss({
            compatibility: '*',
            roundingPrecision: 4,
            keepSpecialComments: 0
        }))
        .pipe(sourcemaps.write(opts.mapsDest))
        .pipe(gulp.dest(opts.dest))
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
