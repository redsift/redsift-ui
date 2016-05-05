import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
    entry: 'src/index.js',
    format: 'cjs',
    plugins: [json(), babel()],
    dest: 'dist/redsift-ui.umd.js'
};
