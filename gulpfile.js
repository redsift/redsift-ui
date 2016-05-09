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
    name: 'core',
    formats: ['umd', 'es6'],
    moduleNameJS: 'Redsift',
    outputFolder: path.join(paths.dest, 'core'),
    mainJS: {
        name: 'redsift',
        indexFile: './bundles/core/index.js'
    },
    styles: [{
        name: 'redsift-light',
        indexFile: './bundles/core/redsift-light.styl'
    }, {
        name: 'redsift-dark',
        indexFile: './bundles/core/redsift-dark.styl'
    }, {
        name: 'redsift-xtra',
        indexFile: './bundles/core/redsift-xtra.styl'
    }],
    mapsDest: '.'
}, {
    name: 'full',
    formats: ['umd', 'es6'],
    moduleNameJS: 'Redsift',
    outputFolder: path.join(paths.dest, 'full'),
    mainJS: {
        name: 'redsift',
        indexFile: './bundles/full/index.js'
    },
    styles: [{
        name: 'redsift-light',
        indexFile: './bundles/full/redsift-light.styl'
    }, {
        name: 'redsift-dark',
        indexFile: './bundles/full/redsift-dark.styl'
    }, {
        name: 'redsift-xtra',
        indexFile: './bundles/full/redsift-xtra.styl'
    }],
    mapsDest: '.'
}];

gulp.task('bundle-js', function() {
    for (var idx = 0; idx < bundles.length; idx++) {
        var config = bundles[idx];

        for (var i = 0; i < config.formats.length; i++) {
            var format = config.formats[i],
                moduleName = config.moduleNameJS,
                dest = null;

            if (format === 'es6') {
                dest = path.join(config.outputFolder, 'js', config.mainJS.name + '.es2015.js');
                bundleES6(config.mainJS.indexFile, dest);
            } else {
                dest = path.join(config.outputFolder, 'js', config.mainJS.name + '.' + format + '.js');
                transpileES6(config.mainJS.indexFile, dest, format, moduleName);
            }
        }
    };
});

gulp.task('bundle-css', function() {
    for (var idx = 0; idx < bundles.length; idx++) {
        var config = bundles[idx];

        for (var i = 0; i < config.styles.length; i++) {
            let style = config.styles[i]

            makeCssBundle({
                name: style.name,
                dest: path.join(config.outputFolder, 'css'),
                indexFile: style.indexFile,
                mapsDest: config.mapsDest
            });
        }
    }
});

gulp.task('css-watch', ['css-light', 'css-dark', 'css-xtra'], function() {
    return appRefresh();
    browserSync.reload('*.js');
});

gulp.task('js-watch', ['bundle-js'], function() {
    browserSync.reload('*.js');
});

gulp.task('serve', ['default', 'browser-sync'], function() {
    gulp.watch(['./components/**/*.{import.styl,styl,css}'], ['css-watch']);
    gulp.watch(['./components/**/*.{js,tmpl}'], ['js-watch']);
    gulp.watch(['./js/**/*.js'], ['js-watch']);
    gulp.watch('./samples/**/*.html').on('change', function() {
        browserSync.reload('*.html');
    });
});

gulp.task('default', ['bundle-css', 'bundle-js']);

gulp.task('build', ['default']);

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: ['./samples', './dist', './assets'],
            directory: true
        }
    });
});

gulp.task('clean', function() {
    return del(['dist/**']);
});

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

function transpileES6(indexFile, dest, format, moduleName) {
    rollup.rollup({
        entry: indexFile,
        external: ['bezier-easing'],
        plugins: [
            json(),
            string({
                extensions: ['.tmpl']
            }),
            // CAUTION: make sure to initialize all file transforming additional plugins
            // BEFORE babel() or buble(). Otherwise the transpiler will consume the
            //imported files first.
            // babel(),
            buble(),
            filesize()
        ]
    }).then(function(bundle) {
        bundle.write({
            format: format,
            moduleName: moduleName,
            dest: dest,
            globals: {
                'bezier-easing': 'BezierEasing',
            }
        });
    }).catch(function(err) {
        console.log('rollup err: ' + err);
    });

    // FIXXME: use closure compiler to minify JS!
    // .pipe(closureCompiler({
    //     compilerPath: 'bower_components/closure-compiler/compiler.jar',
    //     fileName: 'redsift-global.es5.min.js',
    //     continueWithWarnings: true
    // }))

    rollup.rollup({
        entry: indexFile,
        external: ['bezier-easing'],
        plugins: [
            json(),
            string({
                extensions: ['.tmpl']
            }),
            // CAUTION: make sure to initialize all file transforming additional plugins
            // BEFORE babel() or buble(). Otherwise the transpiler will consume the
            //imported files first.
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
            moduleName: moduleName,
            dest: destMin,
            globals: {
                'bezier-easing': 'BezierEasing',
            }
        });
    }).catch(function(err) {
        console.log('rollup err: ' + err);
    });
}

function makeCssBundle(opts) {
    gulp.src([
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
