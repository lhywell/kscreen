/**
 * Created by lihuiyin on 2021/04/12.
 */
// rollup.config.js
import builtins from 'rollup-plugin-node-builtins';
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import image from 'rollup-plugin-img';

const path = require('path');
const rlv = function(filePath) {
    return path.join(__dirname, '..', filePath)
}
const version = require('../package.json').version;

const ENV = process.env.NODE_ENV;

//编译css
const postcss = require('rollup-plugin-postcss');
const sass = require('node-sass');
const livereload = require('rollup-plugin-livereload');
const serve = require('rollup-plugin-serve');

const isProductionEnv = ENV === 'production';

const processSass = function(context, payload) {
    return new Promise((resolve, reject) => {
        sass.render({
            file: context
        }, function(err, result) {
            console.log(result);
            if (!err) {
                resolve(result);
            } else {
                console.log(err);
                reject(err)
            }
        });
    })
};

export default {
    input: rlv('./src/kss.js'),
    output: {
        file: process.env.NODE_ENV === 'development' ? './dist/kss.dev.js' : './dist/kss.js',
        format: 'umd',
        sourcemap: process.env.NODE_ENV === 'development' ? true : false,
        name: 'kscreen',
        intro: 'var global = typeof self !== undefined ? self : this;'
    },
    watch: {
        include: 'src/**',
    },
    plugins: [
        image({
            limit: 10000
        }),
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
        // 开启服务
        ENV == 'development' ?
        serve({
            open: true, // 是否打开浏览器
            contentBase: './', // 入口html的文件位置
            historyApiFallback: true, // Set to true to return index.html instead of 404
            host: 'localhost',
            port: 3003
        }) :
        '',
        livereload()
    ],
};