var path = require('path');

var paths = {
    dest: './dist'
}

var bundles = [{
    name: 'core',
    formats: ['es6', 'umd'],
    moduleNameJS: 'Redsift',
    outputFolder: paths.dest,
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
    formats: ['es6', 'umd'],
    moduleNameJS: 'Redsift',
    outputFolder: paths.dest,
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

module.exports = bundles;
