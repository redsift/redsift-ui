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
  merge(defaultConfig, coreConfig),
  merge(defaultConfig, fullConfig)
];

console.log('bundles: ' + JSON.stringify(bundles, null, 4));

module.exports = bundles;

function merge(obj1, obj2) {
  var newObj = JSON.parse(JSON.stringify(obj1));
  Object.keys(obj1).forEach(function(key) { newObj[key] = obj1[key]; });
  Object.keys(obj2).forEach(function(key) { newObj[key] = obj2[key]; });
  return newObj;
}
