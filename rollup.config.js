import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import stylusCssModules from 'rollup-plugin-stylus-css-modules';

export default {
    entry: 'src/index.js',
    format: 'cjs',
    plugins: [stylusCssModules({
        output: 'dist/redsift-ui.css'
    }), json(), babel()],
    dest: 'dist/redsift-ui.umd.js'
};
