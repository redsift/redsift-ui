var rollup = require('rollup'),
  json = require('rollup-plugin-json'),
  buble = require('rollup-plugin-buble'),
  //  babel = require('rollup-plugin-babel'),
  string = require('rollup-plugin-string'),
  // filesize = require('rollup-plugin-filesize'),
  uglify = require('rollup-plugin-uglify'),
  nodeResolve = require('rollup-plugin-node-resolve'),
  includePaths = require('rollup-plugin-includepaths'),
  commonjs = require('rollup-plugin-commonjs'),
  path = require('path'),
  _ = require('lodash');

// var closureCompiler = require('gulp-closure-compiler');

var includePathOptions = {
    paths: ['./components'],
    external: [],
    extensions: ['.js']
};

module.exports = function setupTask(gulp, bundles) {
  function task() {
    for (var idx = 0; idx < bundles.length; idx++) {
      var config = bundles[idx];

      for (var i = 0; i < config.formats.length; i++) {
        var format = config.formats[i],
          moduleName = config.moduleNameJS,
          dest = null;

        if (format === 'es6') {
          dest = path.join(config.outputFolder, 'js', config.name, config.mainJS.name + '.es2015.js');
          bundleES6(config.mainJS.indexFile, dest, config.externalMappings);
        } else {
          dest = path.join(config.outputFolder, 'js', config.name, config.mainJS.name + '.' + format + '.js');
          transpileES6(config.mainJS.indexFile, dest, format, moduleName, config.externalMappings);
        }
      }
    }
  }

  // NOTE: To not execute a task each time the gulpfile defines a task with
  // gulp.task('task-name', ...) we return a function here, which gets called
  // eventually when calling a task via gulp.
  return task;
}

function bundleES6(indexFile, dest, externalMappings) {
  // All external mappings have to be skipped by the nodeResolve plugin. Otherwise
  // the plugin would search for them in node_modules and complain if they are not found.
  var nodeResolveSkips = _.map(externalMappings, function(value, key) {
    return key;
  });

  rollup.rollup({
    entry: indexFile,
    external: [],
    plugins: [
      json(),
      string({
        extensions: ['.tmpl']
      }),
      includePaths(includePathOptions),
      nodeResolve({
        jsnext: true,
        main: true,
        skip: nodeResolveSkips
      }),
      commonjs(),
      // filesize()
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

function transpileES6(indexFile, dest, format, moduleName, externalMappings) {
  // All external mappings have to be skipped by the nodeResolve plugin. Otherwise
  // the plugin would search for them in node_modules and complain if they are not found.
  var nodeResolveSkips = _.map(externalMappings, function(value, key) {
    return key;
  });

  rollup.rollup({
    entry: indexFile,
    external: [],
    plugins: [
      json(),
      string({
        extensions: ['.tmpl']
      }),
      includePaths(includePathOptions),
      nodeResolve({
        jsnext: true,
        main: true,
        skip: nodeResolveSkips
      }),
      commonjs(),
      // CAUTION: make sure to initialize all file transforming additional plugins
      // BEFORE babel() or buble(). Otherwise the transpiler will consume the
      //imported files first.
      // babel(),
      buble(),
      // filesize()
    ]
  }).then(function(bundle) {
    bundle.write({
      format: format,
      moduleName: moduleName,
      globals: externalMappings,
      dest: dest
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
    external: [],
    plugins: [
      json(),
      string({
        extensions: ['.tmpl']
      }),
      includePaths(includePathOptions),
      nodeResolve({
        jsnext: true,
        main: true,
        skip: nodeResolveSkips
      }),
      commonjs(),
      // CAUTION: make sure to initialize all file transforming additional plugins
      // BEFORE babel() or buble(). Otherwise the transpiler will consume the
      //imported files first.
      // babel(),
      buble(),
      // filesize(),
      uglify()
    ]
  }).then(function(bundle) {
    var dirname = path.dirname(dest),
      basename = path.basename(dest, '.js'),
      destMin = path.join(dirname, basename) + '.min.js';

    bundle.write({
      format: format,
      moduleName: moduleName,
      globals: externalMappings,
      dest: destMin
    });
  }).catch(function(err) {
    console.log('rollup err: ' + err);
  });
}
