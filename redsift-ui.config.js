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
    'd3-time-format': 'd3',
    'd3-time': 'd3'
  }
};

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

var siftConfig = {
  name: 'sift',
  mainJS: {
    name: 'redsift',
    indexFile: './bundles/sift/index.js'
  },
  styles: [{
    name: 'redsift-light',
    indexFile: './bundles/sift/redsift-light.styl'
  }, {
    name: 'redsift-dark',
    indexFile: './bundles/sift/redsift-dark.styl'
  }, {
    name: 'redsift-xtra',
    indexFile: './bundles/sift/redsift-xtra.styl'
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
  }]
};

var crxConfig = {
  name: 'crx',
  mainJS: {
    name: 'redsift',
    indexFile: './bundles/crx/index.js'
  },
  externalMappings: []
};

var bundles = [
  merge(defaultConfig, coreConfig),
  merge(defaultConfig, siftConfig),
  merge(defaultConfig, fullConfig),
  merge(defaultConfig, crxConfig)
];

module.exports = bundles;

function merge(obj1, obj2) {
  var newObj = JSON.parse(JSON.stringify(obj1));
  Object.keys(obj1).forEach(function(key) { newObj[key] = obj1[key]; });
  Object.keys(obj2).forEach(function(key) { newObj[key] = obj2[key]; });
  return newObj;
}
