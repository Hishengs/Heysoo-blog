function init(){$(this).scroll(function(){$(document).scrollTop()>500?$("#backTop").css("display","inline"):$("#backTop").css("display","none")}),setLightBox(),setLazyload()}function gotoTop(){$(document).scrollTop(0)}function setLightBox(){}function setLazyload(){}function hideControlPanel(){$("#left-panel").fadeOut(1500,function(){$("#content").css("padding-left",0)})}function showLoadingMask(e){var t=$("<img>");t.attr("src",public_path+"/img/loading.gif"),t.css("margin","100px auto"),showMask(e,t)}function showMask(e,t){if($("#"+e).css("position","relative"),$("#content-mask").length>0)$("#content-mask").html(""),$("#content-mask").append(t),$("#content-mask").show();else{var n=$("<div id='content-mask'></div>");n.append(t),n.css({position:"fixed",left:"0",top:"0","z-index":"1000",width:"100%",height:"100%","background-color":"#fff",opacity:"0.8","text-align":"center"}),$("#"+e).prepend(n),n.show()}}function hideMask(){$("#content-mask").hide()}function hMessage(e){var t=arguments[1]?arguments[1]:2e3;if($("#hMessage").length>0)$("#hMessage").html(e),$("#hMessage-mask").append($("#hMessage")),$("#hMessage").css("display","block"),$("body").css({"overflow-x":"hidden","overflow-y":"hidden"}),$("#hMessage-mask").show(),setTimeout(function(){$("#hMessage").hide().empty(),$("#hMessage-mask").hide().empty(),$("body").css({"overflow-x":"auto","overflow-y":"auto"})},t);else{var n=$('<div id="hMessage ">'+e+"</div>");n.css({position:"fixed","z-index":"1000",left:"50%",top:"200px","margin-left":"-150px","text-align":"center",width:"300px",height:"auto",background:"#f5f5f5",color:"#666",padding:"20px","font-size":"16px","box-shadow":"0px 2px 5px 1px rgba(0, 0, 0, 0.5)"}),$("#hMessage-mask").append(n),n.css("display","block"),$("body").css({"overflow-x":"hidden","overflow-y":"hidden"}),$("#hMessage-mask").show(),setTimeout(function(){$("#hMessage").hide().empty(),$("#hMessage-mask").hide().empty(),$("body").css({"overflow-x":"auto","overflow-y":"auto"})},t)}}function tag(e){hMessage(e)}function view(e,t){window.location.href=window.location.origin+"/Heysoo/view/"+t}function showModal(e){$("#"+e).modal("toggle")}function isMobile(){var e={};return e.availWidth=window.screen.availWidth,e.availHeight=window.screen.availHeight,e.innerHeight=window.innerHeight,e.innerWidth=window.innerWidth,e.isMobile=e.availWidth<1024||e.innerWidth<1024?!0:!1,console.log(e),e}var progress_bar=$.AMUI.progress,site_prefix="http://localhost",editOpts={width:"100%",height:"680px",basePath:editor_basePath,themeType:"simple",items:["|","bold","italic","underline","|","justifyleft","justifycenter","justifyright","justifyfull","|","removeformat","|","image","emoticons","|","link","fullscreen","|"]},essayCmtOptions={basePath:editor_basePath,width:"710px",minWidth:"710px",maxWidth:"710px",height:"180px",minHeight:"180px",resizeType:0,items:["emoticons","link","image"],themeType:"simple"},essayReplyCmtOptions={basePath:editor_basePath,width:"520px",minWidth:"380px",maxWidth:"520px",height:"180px",minHeight:"180px",resizeType:0,items:["emoticons","link","image"],themeType:"simple"},pieceCmtOptions={basePath:editor_basePath,width:"380px",minWidth:"380px",maxWidth:"380px",height:"330px",minHeight:"330px",resizeType:0,items:["emoticons","link","image"],themeType:"simple"},essay_editor_opt={path:public_path+"/editor/meditor/lib/",height:550,toolbarIcons:function(){return["bold","italic","quote","hr","link","image","emoji","watch","preview","fullscreen"]},emoji:!0,watch:!1,htmlDecode:"script,a,img",saveHTMLToTextarea:!0,placeholder:"在此输入内容",value:"",imageUpload:!0,imageFormats:["jpg","jpeg","gif","png","bmp","webp"],imageUploadURL:"http://upload.qiniu.com/"},essay_modify_editor_opt={path:public_path+"/editor/meditor/lib/",height:550,toolbarIcons:function(){return["bold","italic","quote","hr","link","image","emoji","watch","preview","fullscreen"]},emoji:!0,watch:!1,htmlDecode:"script,a,img",saveHTMLToTextarea:!0,placeholder:"在此输入内容",onload:function(){window.essay_modify_editor.setValue(toMarkdown(window.essay_modify_editor.getMarkdown()))},imageUpload:!0,imageFormats:["jpg","jpeg","gif","png","bmp","webp"],imageUploadURL:"http://upload.qiniu.com/"},essay_comment_editor_opt={path:public_path+"/editor/meditor/lib/",height:250,width:"100%",toolbarIcons:function(){return["link","image","emoji"]},emoji:!0,watch:!1,htmlDecode:"script,a,img",saveHTMLToTextarea:!0,placeholder:"在此输入内容",value:"",imageUpload:!0,imageFormats:["jpg","jpeg","gif","png","bmp","webp"],imageUploadURL:"http://upload.qiniu.com/"},essay_comment_reply_editor_opt={path:public_path+"/editor/meditor/lib/",height:250,width:"100%",toolbarIcons:function(){return["link","image","emoji"]},emoji:!0,watch:!1,htmlDecode:"script,a,img",saveHTMLToTextarea:!0,placeholder:"在此输入内容",value:"",imageUpload:!0,imageFormats:["jpg","jpeg","gif","png","bmp","webp"],imageUploadURL:"http://upload.qiniu.com/"},piece_editor_opt={path:public_path+"/editor/meditor/lib/",height:250,toolbarIcons:function(){return["bold","italic","quote","hr","link","image","emoji","watch","preview","fullscreen"]},emoji:!0,watch:!1,htmlDecode:"script,a,img",saveHTMLToTextarea:!0,placeholder:"在此输入内容",imageUpload:!0,imageFormats:["jpg","jpeg","gif","png","bmp","webp"],imageUploadURL:"http://upload.qiniu.com/"},piece_comment_editor_opt={},music_player_width=260;jQuery(function(e){init()}),function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.toMarkdown=e()}}(function(){return function e(t,n,i){function r(a,l){if(!n[a]){if(!t[a]){var c="function"==typeof require&&require;if(!l&&c)return c(a,!0);if(o)return o(a,!0);var s=new Error("Cannot find module '"+a+"'");throw s.code="MODULE_NOT_FOUND",s}var d=n[a]={exports:{}};t[a][0].call(d.exports,function(e){var n=t[a][1][e];return r(n?n:e)},d,d.exports,e,t,n,i)}return n[a].exports}for(var o="function"==typeof require&&require,a=0;a<i.length;a++)r(i[a]);return r}({1:[function(e,t,n){"use strict";function i(e){return e.replace(/^[ \r\n\t]+|[ \r\n\t]+$/g,"")}function r(e){return-1!==k.indexOf(e.nodeName.toLowerCase())}function o(e){return-1!==T.indexOf(e.nodeName.toLowerCase())}function a(){var e=N.DOMParser,t=!1;try{(new e).parseFromString("","text/html")&&(t=!0)}catch(n){}return t}function l(){var e=function(){};return e.prototype.parseFromString=function(e){var t=v.implementation.createHTMLDocument("");return e.toLowerCase().indexOf("<!doctype")>-1?t.documentElement.innerHTML=e:t.body.innerHTML=e,t},e}function c(e){var t=(new $).parseFromString(e,"text/html");return x(t,r),t}function s(e){for(var t,n,i,r=[e],o=[];r.length>0;)for(t=r.shift(),o.push(t),n=t.childNodes,i=0;i<n.length;i++)1===n[i].nodeType&&r.push(n[i]);return o.shift(),o}function d(e){for(var t="",n=0;n<e.childNodes.length;n++)if(1===e.childNodes[n].nodeType)t+=e.childNodes[n]._replacement;else{if(3!==e.childNodes[n].nodeType)continue;t+=e.childNodes[n].data}return t}function p(e,t){return e.cloneNode(!1).outerHTML.replace("><",">"+t+"<")}function u(e,t){if("string"==typeof t)return t===e.nodeName.toLowerCase();if(Array.isArray(t))return-1!==t.indexOf(e.nodeName.toLowerCase());if("function"==typeof t)return t.call(g,e);throw new TypeError("`filter` needs to be a string, array, or function")}function f(e,t){var n,i,o;return"left"===e?(n=t.previousSibling,i=/ $/):(n=t.nextSibling,i=/^ /),n&&(3===n.nodeType?o=i.test(n.nodeValue):1!==n.nodeType||r(n)||(o=i.test(n.textContent))),o}function m(e){var t="",n="";if(!r(e)){var i=/^[ \r\n\t]/.test(e.innerHTML),o=/[ \r\n\t]$/.test(e.innerHTML);i&&!f("left",e)&&(t=" "),o&&!f("right",e)&&(n=" ")}return{leading:t,trailing:n}}function h(e){var t,n=d(e);if(!o(e)&&!/A/.test(e.nodeName)&&/^\s*$/i.test(n))return void(e._replacement="");for(var r=0;r<b.length;r++){var a=b[r];if(u(e,a.filter)){if("function"!=typeof a.replacement)throw new TypeError("`replacement` needs to be a function that returns a string");var l=m(e);(l.leading||l.trailing)&&(n=i(n)),t=l.leading+a.replacement.call(g,n,e)+l.trailing;break}}e._replacement=t}var g,b,v,w=e("./lib/md-converters"),y=e("./lib/gfm-converters"),x=e("collapse-whitespace"),N="undefined"!=typeof window?window:this;v="undefined"==typeof document?e("jsdom").jsdom():document;var k=["address","article","aside","audio","blockquote","body","canvas","center","dd","dir","div","dl","dt","fieldset","figcaption","figure","footer","form","frameset","h1","h2","h3","h4","h5","h6","header","hgroup","hr","html","isindex","li","main","menu","nav","noframes","noscript","ol","output","p","pre","section","table","tbody","td","tfoot","th","thead","tr","ul"],T=["area","base","br","col","command","embed","hr","img","input","keygen","link","meta","param","source","track","wbr"],$=a()?N.DOMParser:l();g=function(e,t){if(t=t||{},"string"!=typeof e)throw new TypeError(e+" is not a string");e=e.replace(/(\d+)\. /g,"$1\\. ");var n,i=c(e).body,r=s(i);b=w.slice(0),t.gfm&&(b=y.concat(b)),t.converters&&(b=t.converters.concat(b));for(var o=r.length-1;o>=0;o--)h(r[o]);return n=d(i),n.replace(/^[\t\r\n]+|[\t\r\n\s]+$/g,"").replace(/\n\s+\n/g,"\n\n").replace(/\n{3,}/g,"\n\n")},g.isBlock=r,g.isVoid=o,g.trim=i,g.outer=p,t.exports=g},{"./lib/gfm-converters":2,"./lib/md-converters":3,"collapse-whitespace":4,jsdom:7}],2:[function(e,t,n){"use strict";function i(e,t){var n=Array.prototype.indexOf.call(t.parentNode.childNodes,t),i=" ";return 0===n&&(i="| "),i+e+" |"}var r=/highlight highlight-(\S+)/;t.exports=[{filter:"br",replacement:function(){return"\n"}},{filter:["del","s","strike"],replacement:function(e){return"~~"+e+"~~"}},{filter:function(e){return"checkbox"===e.type&&"LI"===e.parentNode.nodeName},replacement:function(e,t){return(t.checked?"[x]":"[ ]")+" "}},{filter:["th","td"],replacement:function(e,t){return i(e,t)}},{filter:"tr",replacement:function(e,t){var n="",r={left:":--",right:"--:",center:":-:"};if("THEAD"===t.parentNode.nodeName)for(var o=0;o<t.childNodes.length;o++){var a=t.childNodes[o].attributes.align,l="---";a&&(l=r[a.value]||l),n+=i(l,t.childNodes[o])}return"\n"+e+(n?"\n"+n:"")}},{filter:"table",replacement:function(e){return"\n\n"+e+"\n\n"}},{filter:["thead","tbody","tfoot"],replacement:function(e){return e}},{filter:function(e){return"PRE"===e.nodeName&&e.firstChild&&"CODE"===e.firstChild.nodeName},replacement:function(e,t){return"\n\n```\n"+t.firstChild.textContent+"\n```\n\n"}},{filter:function(e){return"PRE"===e.nodeName&&"DIV"===e.parentNode.nodeName&&r.test(e.parentNode.className)},replacement:function(e,t){var n=t.parentNode.className.match(r)[1];return"\n\n```"+n+"\n"+t.textContent+"\n```\n\n"}},{filter:function(e){return"DIV"===e.nodeName&&r.test(e.className)},replacement:function(e){return"\n\n"+e+"\n\n"}}]},{}],3:[function(e,t,n){"use strict";t.exports=[{filter:"p",replacement:function(e){return"\n\n"+e+"\n\n"}},{filter:"br",replacement:function(){return"  \n"}},{filter:["h1","h2","h3","h4","h5","h6"],replacement:function(e,t){for(var n=t.nodeName.charAt(1),i="",r=0;n>r;r++)i+="#";return"\n\n"+i+" "+e+"\n\n"}},{filter:"hr",replacement:function(){return"\n\n* * *\n\n"}},{filter:["em","i"],replacement:function(e){return"_"+e+"_"}},{filter:["strong","b"],replacement:function(e){return"**"+e+"**"}},{filter:function(e){var t=e.previousSibling||e.nextSibling,n="PRE"===e.parentNode.nodeName&&!t;return"CODE"===e.nodeName&&!n},replacement:function(e){return"`"+e+"`"}},{filter:function(e){return"A"===e.nodeName&&e.getAttribute("href")},replacement:function(e,t){var n=t.title?' "'+t.title+'"':"";return"["+e+"]("+t.getAttribute("href")+n+")"}},{filter:"img",replacement:function(e,t){var n=t.alt||"",i=t.getAttribute("src")||"",r=t.title||"",o=r?' "'+r+'"':"";return i?"!["+n+"]("+i+o+")":""}},{filter:function(e){return"PRE"===e.nodeName&&"CODE"===e.firstChild.nodeName},replacement:function(e,t){return"\n\n    "+t.firstChild.textContent.replace(/\n/g,"\n    ")+"\n\n"}},{filter:"blockquote",replacement:function(e){return e=this.trim(e),e=e.replace(/\n{3,}/g,"\n\n"),e=e.replace(/^/gm,"> "),"\n\n"+e+"\n\n"}},{filter:"li",replacement:function(e,t){e=e.replace(/^\s+/,"").replace(/\n/gm,"\n    ");var n="*   ",i=t.parentNode,r=Array.prototype.indexOf.call(i.children,t)+1;return n=/ol/i.test(i.nodeName)?r+".  ":"*   ",n+e}},{filter:["ul","ol"],replacement:function(e,t){for(var n=[],i=0;i<t.childNodes.length;i++)n.push(t.childNodes[i]._replacement);return/li/i.test(t.parentNode.nodeName)?"\n"+n.join("\n"):"\n\n"+n.join("\n")+"\n\n"}},{filter:function(e){return this.isBlock(e)},replacement:function(e,t){return"\n\n"+this.outer(t,e)+"\n\n"}},{filter:function(){return!0},replacement:function(e,t){return this.outer(t,e)}}]},{}],4:[function(e,t,n){"use strict";function i(e){return!(!e||!s[e.nodeName])}function r(e){return!(!e||!c[e.nodeName])}function o(e,t){if(e.firstChild&&"PRE"!==e.nodeName){"function"!=typeof t&&(t=i);for(var n=null,o=!1,c=null,s=l(c,e);s!==e;){if(3===s.nodeType){var d=s.data.replace(/[ \r\n\t]+/g," ");if(n&&!/ $/.test(n.data)||o||" "!==d[0]||(d=d.substr(1)),!d){s=a(s);continue}s.data=d,n=s}else{if(1!==s.nodeType){s=a(s);continue}t(s)||"BR"===s.nodeName?(n&&(n.data=n.data.replace(/ $/,"")),n=null,o=!1):r(s)&&(n=null,o=!0)}var p=l(c,s);c=s,s=p}n&&(n.data=n.data.replace(/ $/,""),n.data||a(n))}}function a(e){var t=e.nextSibling||e.parentNode;return e.parentNode.removeChild(e),t}function l(e,t){return e&&e.parentNode===t||"PRE"===t.nodeName?t.nextSibling||t.parentNode:t.firstChild||t.nextSibling||t.parentNode}var c=e("void-elements");Object.keys(c).forEach(function(e){c[e.toUpperCase()]=1});var s={};e("block-elements").forEach(function(e){s[e.toUpperCase()]=1}),t.exports=o},{"block-elements":5,"void-elements":6}],5:[function(e,t,n){t.exports=["address","article","aside","audio","blockquote","canvas","dd","div","dl","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","main","nav","noscript","ol","output","p","pre","section","table","tfoot","ul","video"]},{}],6:[function(e,t,n){t.exports={area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,menuitem:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0}},{}],7:[function(e,t,n){},{}]},{},[1])(1)});