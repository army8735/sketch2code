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
  background:#FFF;
}
#preview{
  position:relative;
  width:${data.pageWidth}px;
  height:${data.pageHeight}px;
  border:1px dashed #CCC;
}
#preview li{
  position:absolute;
  -webkit-transition:opacity 0.3s;
  transition:opacity 0.3s;
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
#preview.hover li{
  opacity:0.3;
}
#preview.hover .cur{
  opacity:1;
}
#preview.focus li{
  opacity:0;
}
#preview.focus .cur{
  opacity:1;
}
#list{
  flex:1;
  margin-left:10px;
}
#list dt{
  color:#CCC;
}
#list *{
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  cursor:pointer;
}
#list *:hover{
  text-decoration:underline;
}
#list .Group{
  color:#39F;
}
#list .Image{
  color:#399;
}
#list .Text{
  color:#333;
}
#list .Shape{
  color:#F33;
}
</style>
</head>
<body>
<ul id="preview">
${data.item.map(data => {
  return `<li id="i${data.id}" title="${data.name}"></li>`;
}).join('\n')}
</ul>
<dl id="list">
<dt>restore</dt>
${data.item.map(data => {
    return `<dd id="i${data.id}" class="${data.type}" title="${data.id}">${data.name}</dd>`;
  }).join('\n')}
</dl>
<script>
var preview = document.querySelector('#preview');
var list = document.querySelector('#list');
var hoverLast, focusLast;
list.addEventListener('mouseover', function(e) {
  if(!focusLast && e.target.nodeName == 'DD') {
    if(hoverLast) {
      hoverLast.classList.remove('cur');
    }
    preview.classList.add('hover');
    let id = e.target.id;
    hoverLast = preview.querySelector('#' + id);
    hoverLast.classList.add('cur');
  }
});
list.addEventListener('mouseout', function(e) {
  if(!focusLast) {
    if(hoverLast) {
      hoverLast.classList.remove('cur');
      hoverLast = null;
    }
    preview.classList.remove('hover');
  }
});
list.addEventListener('click', function(e) {
  if(e.target.nodeName == 'DD') {
    if(hoverLast) {
      hoverLast.classList.remove('cur');
      hoverLast = null;
    }
    if(focusLast) {
      focusLast.classList.remove('cur');
    }
    preview.classList.remove('hover');
    preview.classList.add('focus');
    let id = e.target.id;
    focusLast = preview.querySelector('#' + id);
    focusLast.classList.add('cur');
  }
  else if(e.target.nodeName == 'DT') {
    if(focusLast) {
      focusLast.classList.remove('cur');
    }
    focusLast = null;
    preview.classList.remove('hover');
    preview.classList.remove('focus');
  }
});
</script>
</body>
</html>`;
}
