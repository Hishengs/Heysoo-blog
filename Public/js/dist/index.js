function init(){$(this).scroll(function(){$(document).scrollTop()>500?$("#backTop").css("display","inline"):$("#backTop").css("display","none")}),setLightBox(),setLazyload()}function gotoTop(){$(document).scrollTop(0)}function setLightBox(){}function setLazyload(){}function hideControlPanel(){$("#left-panel").fadeOut(1500,function(){$("#content").css("padding-left",0)})}function showLoadingMask(e){var t=$("<img>");t.attr("src",public_path+"/img/loading.gif"),t.css("margin","100px auto"),showMask(e,t)}function showMask(e,t){if($("#"+e).css("position","relative"),$("#content-mask").length>0)$("#content-mask").html(""),$("#content-mask").append(t),$("#content-mask").show();else{var i=$("<div id='content-mask'></div>");i.append(t),i.css({position:"fixed",left:"0",top:"0","z-index":"1000",width:"100%",height:"100%","background-color":"#fff",opacity:"0.8","text-align":"center"}),$("#"+e).prepend(i),i.show()}}function hideMask(){$("#content-mask").hide()}function hMessage(e){var t=arguments[1]?arguments[1]:2e3;if($("#hMessage").length>0)$("#hMessage").html(e),$("#hMessage-mask").append($("#hMessage")),$("#hMessage").css("display","block"),$("body").css({"overflow-x":"hidden","overflow-y":"hidden"}),$("#hMessage-mask").show(),setTimeout(function(){$("#hMessage").hide().empty(),$("#hMessage-mask").hide().empty(),$("body").css({"overflow-x":"auto","overflow-y":"auto"})},t);else{var i=$('<div id="hMessage ">'+e+"</div>");i.css({position:"fixed","z-index":"9999999",left:"50%",top:"200px","margin-left":"-150px","text-align":"center",width:"300px",height:"auto",background:"#f5f5f5",color:"#666",padding:"20px","font-size":"16px","box-shadow":"0px 2px 5px 1px rgba(0, 0, 0, 0.5)"}),$("#hMessage-mask").append(i),i.css("display","block"),$("body").css({"overflow-x":"hidden","overflow-y":"hidden"}),$("#hMessage-mask").show(),setTimeout(function(){$("#hMessage").hide().empty(),$("#hMessage-mask").hide().empty(),$("body").css({"overflow-x":"auto","overflow-y":"auto"})},t)}}function tag(e){hMessage(e)}function view(e,t){window.location.href=window.location.origin+"/view/"+t}function showModal(e){$("#"+e).modal("toggle")}function isMobile(){var e={};return e.availWidth=window.screen.availWidth,e.availHeight=window.screen.availHeight,e.innerHeight=window.innerHeight,e.innerWidth=window.innerWidth,e.availWidth<1024||e.innerWidth<1024?e.isMobile=!0:e.isMobile=!1,e}function isEmpty(e){var t=/^[\s,\n,\r,\t,\o]*$/gi;return t.test(e)}function redirect(e){switch(e){case"login":window.location.href=site_prefix+"/Action/login.html";break;case"register":window.location.href=site_prefix+"/Action/register.html"}}function updateAmazeUIEvent(){var e=arguments[0]?arguments[0]:{dropdown:!0};e.dropdown&&($("[data-hs-dropdown]").dropdown(),console.log("更新amazeui-dropdown事件"))}var editOpts={width:"100%",height:"680px",basePath:editor_basePath,themeType:"simple",items:["|","bold","italic","underline","|","justifyleft","justifycenter","justifyright","justifyfull","|","removeformat","|","image","emoticons","|","link","fullscreen","|"]},essayCmtOptions={basePath:editor_basePath,width:"710px",minWidth:"710px",maxWidth:"710px",height:"180px",minHeight:"180px",resizeType:0,items:["emoticons","link","image"],themeType:"simple"},essayReplyCmtOptions={basePath:editor_basePath,width:"520px",minWidth:"380px",maxWidth:"520px",height:"180px",minHeight:"180px",resizeType:0,items:["emoticons","link","image"],themeType:"simple"},pieceCmtOptions={basePath:editor_basePath,width:"380px",minWidth:"380px",maxWidth:"380px",height:"330px",minHeight:"330px",resizeType:0,items:["emoticons","link","image"],themeType:"simple"},essay_editor_opt={path:public_path+"/editor/meditor/lib/",height:650,toolbarIcons:function(){return["bold","italic","quote","hr","link","image","emoji","watch","preview","fullscreen"]},emoji:!0,watch:!1,htmlDecode:"script,img",saveHTMLToTextarea:!0,placeholder:"在此输入内容",value:"",imageUpload:!0,imageFormats:["jpg","jpeg","gif","png","bmp","webp"],imageUploadURL:"http://upload.qiniu.com/",fullScreen:!0,lineNumbers:!1,qiniu:{uploadUrl:"http://upload.qiniu.com/",get_token_path:get_token_path}},essay_modify_editor_opt={path:public_path+"/editor/meditor/lib/",height:650,toolbarIcons:function(){return["bold","italic","quote","hr","link","image","emoji","watch","preview","fullscreen"]},emoji:!0,watch:!1,htmlDecode:"script,img",saveHTMLToTextarea:!0,placeholder:"在此输入内容",onload:function(){window.essay_modify_editor.setValue(toMarkdown(window.essay_modify_editor.getMarkdown()))},imageUpload:!0,imageFormats:["jpg","jpeg","gif","png","bmp","webp"],imageUploadURL:"http://upload.qiniu.com/",lineNumbers:!1,qiniu:{uploadUrl:"http://upload.qiniu.com/",get_token_path:get_token_path}},piece_editor_opt={path:public_path+"/editor/meditor/lib/",height:250,toolbarIcons:function(){return["bold","italic","quote","hr","link","image","emoji","watch","preview","fullscreen"]},emoji:!0,watch:!1,htmlDecode:"script,img",saveHTMLToTextarea:!0,placeholder:"在此输入内容",imageUpload:!0,imageFormats:["jpg","jpeg","gif","png","bmp","webp"],imageUploadURL:"http://upload.qiniu.com/",qiniu:{uploadUrl:"http://upload.qiniu.com/",get_token_path:get_token_path}},essay_comment_editor_opt={path:public_path+"/editor/meditor/lib/",height:250,width:"100%",toolbarIcons:function(){return["link","image","emoji"]},emoji:!0,watch:!1,autoFocus:!1,htmlDecode:"script,img",saveHTMLToTextarea:!0,placeholder:"在此输入内容",value:"",imageUpload:!0,imageFormats:["jpg","jpeg","gif","png","bmp","webp"],imageUploadURL:"http://upload.qiniu.com/",qiniu:{uploadUrl:"http://upload.qiniu.com/",get_token_path:get_token_path}},essay_comment_reply_editor_opt={path:public_path+"/editor/meditor/lib/",height:250,width:"100%",toolbarIcons:function(){return["link","image","emoji"]},emoji:!0,watch:!1,htmlDecode:"script,img",saveHTMLToTextarea:!0,placeholder:"在此输入内容",value:"",imageUpload:!0,imageFormats:["jpg","jpeg","gif","png","bmp","webp"],imageUploadURL:"http://upload.qiniu.com/",qiniu:{uploadUrl:"http://upload.qiniu.com/",get_token_path:get_token_path}},piece_comment_editor_opt={},music_player_width=260;jQuery(function(e){init()}),function(e){var t=this,i=function(){};i.isEmpty=function(e){var t=!0,i=Object.prototype.toString.call(e).slice(8,-1);switch(i){case"Null":case"Undefined":t=!0;break;case"Object":return!(Object.keys?Object.keys(e).length>0:Object.getOwnPropertyNames(e).length>0);case"Array":t=0==e.length;break;case"Boolean":t=!e;break;default:t=0==e.toString().replace(/^\s+/gi,"").replace(/\s+$/gi,"").length}return t},i.VERSION="1.0.0",t.hs=i}();