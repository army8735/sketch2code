# sketch2code

[![NPM version](https://badge.fury.io/js/sketch2code.png)](https://npmjs.org/package/sketch2code)
[![Build Status](https://travis-ci.org/army8735/sketch2code.svg?branch=master)](https://travis-ci.org/army8735/sketch2code)
[![Dependency Status](https://david-dm.org/army8735/sketch2code.png)](https://david-dm.org/army8735/sketch2code)

[![logo](https://raw.githubusercontent.com/army8735/sketch2code/master/assets/logo.jpg)](https://github.com/army8735/sketch2code)

## reference
* Sketch: https://developer.sketchapp.com/reference/api/
* Sketch plugin: https://developer.sketchapp.com/guides/
* TensorFlow.js: https://js.tensorflow.org/api/0.12.5/

## 开发说明
* `npm i`安装依赖
* `lib`为解析.sketch文件为json格式的单独功能
* `src`为sketch插件源码目录
  * 插件开发`npm run dev`自动侦听构建并同时输出`console`日志
* `ml`为机器学习源码目录
