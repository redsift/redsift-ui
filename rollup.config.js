import json from 'rollup-plugin-json';
// import babel from 'rollup-plugin-babel';
import buble from 'rollup-plugin-buble';
import stylusCssModules from 'rollup-plugin-stylus-css-modules';
import string from 'rollup-plugin-string';

import path from 'path';

const distRootPath = './dist'; // TODO: use 'config' package for central configuration

export default {
    entry: 'src/index.js',
    format: 'umd',
    plugins: [
        json(),
        stylusCssModules({
            output: path.join(distRootPath, 'redsift-ui.css')
        }),
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
