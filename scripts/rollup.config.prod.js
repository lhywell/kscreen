/**
 * Created by lihuiyin on 2021/04/12.
 */
// rollup.config.js
const path = require('path');
const rlv = function(filePath) {
    return path.join(__dirname, '..', filePath)
}
const version = require('../package.json').version;
const ENV = process.env.NODE_ENV;

import builtins from 'rollup-plugin-node-builtins';
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'

import { terser } from 'rollup-plugin-terser'

//编译css
const postcss = require('rollup-plugin-postcss');

export default {
    input: rlv('./src/main.js'),
    output: {
        file: './dist/kscreen.min.js',
        format: 'umd',
        sourcemap: false,
        name: 'kscreen',
        intro: 'var global = typeof self !== undefined ? self : this;'
    },
    external: ['./src/styles/css/kscreen.css','./src/styles/fonts/iconfont.css'],
    watch: {
        include: 'src/**',
    },
    plugins: [
        postcss({
            plugins: [
                require('autoprefixer')({ overrideBrowserslist: ['> 0.15% in CN'] })
            ]
        }),
        commonjs({ sourceMap: false }),
        builtins(),
        json({ preferConst: true }),
        resolve({
            jsnext: true,
            main: true,
            browser: true,
        }),
        babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true
        }),
        replace({
            VERSION: JSON.stringify(version),
            ENV: JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        terser()
    ],
};