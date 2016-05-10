var stylus = require('gulp-stylus'),
  concat = require('gulp-concat'),
  minifyCss = require('gulp-cleancss'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  rename = require('gulp-rename'),
  plumber = require('gulp-plumber'),
  path = require('path'),
  mergeStream = require('merge-stream');

module.exports = function setupTask(gulp, bundles) {
  // NOTE: To not execute a task each time the gulpfile defines a task with
  // gulp.task('task-name', ...) we return a function here, which gets called
  // eventually when calling a task via gulp.
  return function execTask() {
    var gulpStream = mergeStream(); // creates a new stream

    for (var idx = 0; idx < bundles.length; idx++) {
      var config = bundles[idx];

      for (var i = 0; i < config.styles.length; i++) {
        var style = config.styles[i];

        var cssStream = bundleStyles(gulp, {
          name: style.name,
          dest: path.join(config.outputFolder, 'css', config.name),
          indexFile: style.indexFile,
          mapsDest: config.mapsDest
        });
        gulpStream.add(cssStream);
      }
    }

    return gulpStream.isEmpty() ? null : gulpStream;
  }
}

function bundleStyles(gulp, opts) {
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
    .pipe(gulp.dest(opts.dest));
}
