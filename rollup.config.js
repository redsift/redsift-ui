import json from 'rollup-plugin-json';
// import babel from 'rollup-plugin-babel';
import buble from 'rollup-plugin-buble';
import string from 'rollup-plugin-string';

import path from 'path';

const distRootPath = './dist/full/js'; // TODO: use 'config' package for central configuration

export default {
    entry: './bundles/full/index.js',
    format: 'umd',
    plugins: [
        json(),
          string({
            extensions: ['.tmpl']
        }),
        // CAUTION: make sure to initialize all additional plugins BEFORE babel()
        // buble(). Otherwise the transpiler will consume the imported files first.
        // babel(),
        buble()
    ],
    dest: path.join(distRootPath, 'redsift-ui.umd.js')
};
