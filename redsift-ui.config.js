var paths = {
  dest: './dist'
}

var defaultConfig = {
  formats: ['es6', 'umd'],
  outputFolder: paths.dest,
  moduleNameJS: 'Redsift',
  mapsDest: '.',
  externalMappings: {
    'd3-selection': 'd3',
    'd3-scale': 'd3',
    'd3-axis': 'd3',
    'd3-format': 'd3',
    'd3-time': 'd3'
  }
}

var coreConfig = {
  name: 'core',
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
  }]
};

var fullConfig = {
  name: 'full',
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
}

var bundles = [
  extend(defaultConfig, coreConfig),
  extend(defaultConfig, fullConfig)
];

module.exports = bundles;

function extend(obj, src) {
    Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
    return obj;
}
