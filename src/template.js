'use strict';

export default function(data) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>flatten</title>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="apple-mobile-web-app-status-bar-style" content="black"/>
<meta name="format-detection" content="telephone=no"/>
<meta name="format-detection" content="email=no"/>
<meta name="wap-font-scale" content="no"/>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no">
<style>
*,
:after,
:before{
  -webkit-tap-highlight-color:transparent;
  -webkit-overflow-scrolling:touch;
}
blockquote,
body,
dd,
div,
dl,
dt,
fieldset,
form,
h1,
h2,
h3,
h4,
h5,
h6,
input,
legend,
li,
ol,
p,
td,
textarea,
th,
ul,
pre{
  margin:0;
  padding:0;
}
table{
  border-collapse:collapse;
  border-spacing:0;
}
fieldset,
img{
  border:0;
}
li{
  list-style:none;
}
caption,
th{
  text-align:left;
}
q:after,
q:before{
  content:"";
}
input[type="password"]{
  ime-mode:disabled;
}
:focus{
  outline:0;
}
a,
img{
  -webkit-touch-callout:none;
}
body,
button,
input,
select,
textarea,
pre{
  font-size:12px;
  line-height:1.5;
}
input, button{
  cursor:pointer;
  -webkit-appearance:none;
}
input{
  line-height:normal;
}
body{
  display:flex;
  flex-direction:column;
  background:#FFF;
}
#preview{
  position:relative;
  width:${data.pageWidth}px;
  height:${data.pageHeight}px;
  border:1px dashed #000;
}
#preview li{
  position:absolute;
}
${data.item.map(data => {
  return `#preview #i${data.id}{
  left:${data.xs}px;
  top:${data.ys}px;
  width:${data.width}px;
  height:${data.height}px;
  background:url(${data.id}.png) no-repeat center;
  background-size:contain;
}`;
}).join('\n')}
#list{
  flex:1;
  margin-left:10px;
}
</style>
</head>
<body>
<ul id="preview">
${data.item.map(data => {
  return `<li id="i${data.id}" title="${data.name}"></li>`;
}).join('\n')}
</ul>
<ul id="list"></ul>
</body>
</html>`;
}
