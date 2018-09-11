# sketch2code

[![NPM version](https://badge.fury.io/js/sketch2code.png)](https://npmjs.org/package/sketch2code)
[![Build Status](https://travis-ci.org/army8735/sketch2code.svg?branch=master)](https://travis-ci.org/army8735/sketch2code)
[![Dependency Status](https://david-dm.org/army8735/sketch2code.png)](https://david-dm.org/army8735/sketch2code)

## reference
* Sketch: https://developer.sketchapp.com/reference/api/
* Sketch plugin: https://developer.sketchapp.com/guides/
* TensorFlow.js: https://js.tensorflow.org/api/0.12.5/

## 说明
* `npm i`安装依赖
* src为sketch插件源码目录
  * 插件开发`npm run watch`自动侦听构建并同时输出`console`日志
* ml为机器学习源码目录

## 思路

1. 初版简化问题和需求，只考虑垂直排版和不复杂的css3移动页面，不考虑弹层，不考虑canvas，sketch文件具有良好的组织结构。
2. 删除所有不可见和透明图层和空图层。
3. 应用mask，将之与对应图层合并为正常图层。
4. 简化包含，某些组只包含一个组，某些组只包含一个元素，某些组只包含图，简化之。
5. 隐藏并记录所有可见文字图层，这些文字图层记作T，处理时暂时隐藏避免感染图标导出。
6. sketch分组的组内图层基本属于同一dom（包括父和祖）内，分析时是否在同一组下是一个特征考量。
7. 组可以包含组递归下去，直接同属于一个组和间接同属于一个组，是上述特征的度量细化。

### 区分绝对定位和背景图
* 背景图层可能会和普通图层重叠，此时背景图层不应该被识别为文档流而普通图层被识别为绝对定位。
  * 背景图层z轴小，普通图层z轴大。
  * 背景图层结构简单，普通图层结构复杂（数量*平均深度）。
  * 背景图层文字占比少，普通图层文字占比多。
  * 背景图可能会超出父层范围，普通图层则不会。
  * 背景图元素排列较分散，普通图层比较规律聚合。
* 以上述特征量，`Logistic回归`算法样本训练。预测此图层是背景图的概率，然后决策是否。
* 合并可能存在的多个背景图层。
* 当背景图被识别后，它将被排除文档流识别逻辑。

### 文档流
* 广度优先遍历，每个图层所占的矩形区域。
* 优先观察y和height，一般情况下从上到下没有重叠，而重叠区域很可能表明重叠的一方是绝对定位脱离文档流。
  * 假设有A、B和c、d这4个区域，A、B相邻c、d相邻，A、c重叠B、d重叠，如何判断是A、B绝对定位还是c、d？
    * 考量特征选取：z轴在上的为绝对定位。这里只会出现A、B在上c、d在下或者反之的情况，不可能交错。
  * 假设有A、B和c、d这4个区域，A、B相邻c、d相邻，A、B和c重叠，d和B重叠，同上如何判断？
    * 考量特征选取：z轴在上的为绝对定位。在上的一方均为绝对定位，在下的一方为文档流。
* 根据y和height，将相邻的图层视为一组，某一图层可能会出现同时属于多个组皆可的情形。
* 如果可归属于多个组，将这些歧义图层单独提出，先归类正常图层为若干组，然后以`K最近邻`算法计算归属。
  * 每个图层的中心点y坐标
  * 每个图层的z轴
* 区分开文档流图层和绝对定位图层后，分别递归处理，因为其内部可能还会出现普通文档流和绝对定位的情形，甚至交叉出现。
* 对于普通文档流，可能会按从上到下调整图层z顺序，因为只要不重叠，视觉稿并不会严格按照z轴顺序排列。

### 处理绝对定位
* 其所属父层需要为绝对定位或relative，打标父层。
* fixed不考虑，开发后期可以很容易地转换。

### 处理正常文档流
* 深度优先遍历，识别行列，优先行，再看列。
* 获取组内直接子图层的y和height，分行成组。
* 同行内图层按照x和width，分列成组。

### 处理行
* 相邻图标合并成一个大图标。
* 计算分为几列，flex占比。涉及参量过多，暂无解决方向，可能需要先看完神经网络。
  * 相邻的图像元素合并，`k-means`算法计算分列。
  * 一列无需额外处理。
  * 多列每列考虑是固定还是比例：
    * 图标一般是固定。
    * 文本一般是占比。
    * 都有的时候...
