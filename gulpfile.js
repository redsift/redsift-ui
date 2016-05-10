'use strict';

var gulp = require('gulp'),
  bundleConfig = require('./redsift-ui.config.js'),
  del = require('del'),
  browserSync = require('browser-sync').create();

function getTask(task) {
  return require('./gulp-tasks/' + task)(gulp, bundleConfig);
}

gulp.task('bundle-js', getTask('bundle-js'));
gulp.task('bundle-css', getTask('bundle-css'));

gulp.task('css-watch', ['bundle-css'], function() {
  browserSync.reload('*.css');
});

gulp.task('js-watch', ['bundle-js'], function() {
  browserSync.reload('*.js');
});

gulp.task('serve', ['default', 'browser-sync'], function() {
  gulp.watch(['./components/**/*.{import.styl,styl,css}', './bundles/**/*.{import.styl,styl,css}'], ['css-watch']);
  gulp.watch(['./components/**/*.{js,tmpl}', './bundles/**/*.{js,tmpl}'], ['js-watch']);
  gulp.watch('./samples/**/*.html').on('change', function() {
    browserSync.reload('*.html');
  });
});

gulp.task('default', ['build']);

gulp.task('build', ['bundle-js', 'bundle-css']);

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
