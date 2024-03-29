//var site_prefix = "http://localhost";
var regular_essay_editor_opt = {//普通编辑器的配置
    width:'760px',
    height:'650px',
    items:['link','image','bold','italic','preview','plainpaste'],
    resizeType:0,
    themeType:'simple'
};
//发布
var editOpts = {
    width:'100%',
    height:'680px',
    basePath:editor_basePath,
    themeType:'simple',
    items:[ '|','bold', 
	'italic', 'underline', '|', 'justifyleft', 'justifycenter', 'justifyright',
	'justifyfull', '|', 'removeformat', '|', 'image', 
	'emoticons','|', 'link', 'fullscreen',
	 '|'
	],
};
//文章评论配置
var essayCmtOptions  = {
		basePath:editor_basePath,
		width:'710px',
		minWidth:'710px',
		maxWidth:'710px',
		height:'180px',
		minHeight:'180px',
		resizeType:0,
		lineNumbers:false,
		items:['emoticons', 'link','image'],
		themeType : 'simple'
			}; 
var essayReplyCmtOptions  = {
		basePath:editor_basePath,
		width:'520px',
		minWidth:'380px',
		maxWidth:'520px',
		height:'180px',
		minHeight:'180px',
		lineNumbers:false,
		resizeType:0,
		items:['emoticons', 'link','image'],
		themeType : 'simple'
			}; 

//碎片评论配置
var pieceCmtOptions  = {
		basePath:editor_basePath,
		width:'380px',
		minWidth:'380px',
		maxWidth:'380px',
		height:'330px',
		minHeight:'330px',
		lineNumbers:false,
		resizeType:0,
		items:['emoticons', 'link','image'],
		themeType : 'simple'
			}; 
//文章发布
var essay_md_editor_opt = {
    path : public_path+"/editor/meditor/lib/",
    height:650,
    toolbarIcons:function(){
      return ["bold","italic","quote","hr","link","image","watch","preview","fullscreen"]
    },
    emoji:false,
    watch:false,
    htmlDecode:"script,img",
    saveHTMLToTextarea:true,
    placeholder:"在此输入内容",
    value:'',
    imageUpload: true,
    imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
    imageUploadURL: "http://upload.qiniu.com/",
    fullScreen:true,
    lineNumbers:false,
    qiniu:{uploadUrl:'http://upload.qiniu.com/',get_token_path:get_token_path}
};
var essay_modify_editor_opt = {
	path : public_path+"/editor/meditor/lib/",
	height:650,
	toolbarIcons:function(){
	return ["bold","italic","quote","hr","link","image","watch","preview","fullscreen"]
	},
	emoji:false,
	watch:false,
	htmlDecode:"script,img",
	saveHTMLToTextarea:true,
	placeholder:"在此输入内容",
	onload:function(){
		window.essay_modify_editor.setValue(toMarkdown(window.essay_modify_editor.getMarkdown()));
	},
	imageUpload: true,
    imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
    imageUploadURL: "http://upload.qiniu.com/",
    lineNumbers:false,
    qiniu:{uploadUrl:'http://upload.qiniu.com/',get_token_path:get_token_path}
};
//碎片发布
var piece_editor_opt = {
    path : public_path+"/editor/meditor/lib/",
    height:250,
    toolbarIcons:function(){
      return ["quote","link","image","watch","preview"]
    },
    emoji:false,
    watch:false,
    htmlDecode:"script,img",
    saveHTMLToTextarea:true,
    placeholder:"在此输入内容(支持Markdown语法)",
    imageUpload: true,
    imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
    imageUploadURL: "http://upload.qiniu.com/",
    lineNumbers:false,
    qiniu:{uploadUrl:'http://upload.qiniu.com/',get_token_path:get_token_path}
};
var essay_comment_editor_opt = {//评论框
	path : public_path+"/editor/meditor/lib/",
	height:250,
	width:'100%',
	toolbarIcons:function(){
	return ["link","image"]
	},
	emoji:false,
	watch:false,
	autoFocus:false,
	htmlDecode:"script,img",
	saveHTMLToTextarea:true,
	placeholder:"在此输入内容",
	value:'',
	imageUpload: true,
	imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
	imageUploadURL: "http://upload.qiniu.com/",
	qiniu:{uploadUrl:'http://upload.qiniu.com/',get_token_path:get_token_path}
};
var essay_comment_reply_editor_opt = {//回复框
    path : public_path+"/editor/meditor/lib/",
    height:250,
    width:'100%',
    toolbarIcons:function(){
      return ["link","image"]
    },
    emoji:false,
    watch:false,
    htmlDecode:"script,img",
    saveHTMLToTextarea:true,
    placeholder:"在此输入内容",
    value:'',
    imageUpload: true,
    imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
    imageUploadURL: "http://upload.qiniu.com/",
    qiniu:{uploadUrl:'http://upload.qiniu.com/',get_token_path:get_token_path}
};
var piece_comment_editor_opt = {};
//音乐播放器的宽度
var music_player_width = 260;
jQuery(function($) {
	//初始化
	init();
});
//初始化函数
function init(){
	$(this).scroll(function(){
		//回到顶部按钮在滚动条大于500高度才出现
		if($(document).scrollTop() > 500)$("#backTop").css("display","inline");
		else
		$("#backTop").css("display","none");
	});
	setLightBox();
	setLazyload();
}	
//返回顶部
function gotoTop(){$(document).scrollTop(0);}
//lightbox
function setLightBox(){}
//lazyload
function setLazyload(){}
//隐藏左边控制面板 hide the left panel
function hideControlPanel(){
	$("#left-panel").fadeOut(1500,function(){
		$("#content").css('padding-left',0);
	});
}
//加载遮罩
function showLoadingMask(objId){
	var loading_img = $("<img>")
	loading_img.attr('src',public_path+"/img/loading.gif");
	loading_img.css('margin','100px auto');
	showMask(objId,loading_img);
}
//内容遮罩
function showMask(objId,content){
	$("#"+objId).css('position','relative');
	if($("#content-mask").length > 0){
		$("#content-mask").html("");
		$("#content-mask").append(content);
		$("#content-mask").show();
	}
	else{
		var mask = $("<div id='content-mask'></div>");
		mask.append(content);
		mask.css({
			"position":"fixed",
			"left":"0",
			"top":"0",
			"z-index":"1000",
			"width":"100%",
			"height":"100%",
			"background-color":"#fff",
			"opacity":"0.8",
			"text-align":"center"
		});
		$("#"+objId).prepend(mask);
		mask.show();
	}
}
//隐藏遮罩
function hideMask(){
	$("#content-mask").hide();
}
//弹出消息框
function hMessage(msg){
	var time = arguments[1] ? arguments[1] : 500; 
	if($('#hMessage').length > 0){
		$('#hMessage').html(msg);
		$("#hMessage-mask").append($('#hMessage'));
		$('#hMessage').css('display','block');
		$('body').css({
			'overflow-x':'hidden',
			'overflow-y':'hidden'
		});
		$('#hMessage-mask').show();
		setTimeout(function(){
			$('#hMessage').hide().empty();$('#hMessage-mask').hide().empty();
			$('body').css({
				'overflow-x':'auto',
				'overflow-y':'auto'
			});
		},time);
	}else{
		var hMessage = $('<div id="hMessage ">'+msg+'</div>');
		hMessage.css({
			"position":"fixed",
			"z-index":"9999999",
			"left":"50%",
			//"top":"200px",
			"top":"20px",
			"margin-left":"-150px",
			"text-align":"center",
			"width":"300px",
			"height":"auto",
			//"background":"#f5f5f5",
			"background":"#fff",
			"border":"1px solid #cdcdcd",
			"color":"#666",
			"padding":"20px",
			"font-size":"16px",
			"box-shadow":"0px 2px 5px 1px rgba(0, 0, 0, 0.5)"
		});
		$("#hMessage-mask").append(hMessage);
		hMessage.css('display','block');
		$('body').css({
			'overflow-x':'hidden',
			'overflow-y':'hidden'
		});
		$('#hMessage-mask').show();
		setTimeout(function(){
			$('#hMessage').hide().empty();$('#hMessage-mask').hide().empty();
			$('body').css({
				'overflow-x':'auto',
				'overflow-y':'auto'
			});
		},time);
	}
}
//处理标签
function tag(tag){
	hMessage(tag);
	return;
	$.ajax({
		url:home_path+"/Action/tag.html",
		type:'GET',
		data:{'tag':tag},
		dataType:'json',
		success:function(data){
			$("#content").empty();
			$("#content").html(data);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			console.log(XMLHttpRequest);
		}
	});
}

//go to view page
function view(typeId,id){
	window.location.href = window.location.origin+"/view/"+id;
	//console.log(site_prefix + "/view/"+id);
	//window.location.href = site_prefix + "/view/"+id;
}
function showModal(target){
	$('#'+target).modal('toggle');
}
//检测是否是移动设备并给出设别宽高
function isMobile(){
	var device = {};
	device.availWidth = window.screen.availWidth
	device.availHeight = window.screen.availHeight;
	device.innerHeight = window.innerHeight;
	device.innerWidth = window.innerWidth;
	if(device.availWidth < 1024 || device.innerWidth < 1024)device.isMobile = true;
	else device.isMobile = false;
	return device;
}
//检测输入是否为空
function isEmpty(input){
	var pattern = /^[\s,\n,\r,\t,\o]*$/gi;
	return pattern.test(input);
}
//跳转管理
function redirect(action){
	switch(action){
		case 'login':
			window.location.href = site_prefix+'/Action/login.html';
			break;
		case 'register':
			window.location.href = site_prefix+'/Action/register.html';
			break;
		default:
			break;
	}
}
//更新amazeui事件
function updateAmazeUIEvent(){
    var options = arguments[0]?arguments[0]:{dropdown:true};
    if(options.dropdown){
        $('[data-hs-dropdown]').dropdown();
        console.log('更新amazeui-dropdown事件');
    }
}
//---------------- 判断输入是否为空 ----------------
//对象，数组，布尔，字符串，数字，null，undefined
function isEmpty(obj){
    var res = true;
    var type = Object.prototype.toString.call(obj).slice(8,-1);//判断对象类型
    switch(type){
        case 'Null':
        case 'Undefined':
            res = true;
            break;
        case 'Object':
            return Object.getOwnPropertyNames(obj).length==0?true:false;
            break;
        case 'Array':
            res = obj.length==0?true:false;
            break;
        case 'Boolean':
            res = !obj;
            break;
        default:
            var whitespace = "[\\x20\\t\\r\\n\\f]";
            var rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" );
            res = obj.toString().replace(rtrim,'').length==0?true:false;//去掉前后空格
            break;
    }
    return res;
}
;(function(window){
    var root = this;
    var hs = function(){}
    hs.isEmpty = function(obj){
        var res = true;
        var type = Object.prototype.toString.call(obj).slice(8,-1);//判断对象类型
        switch(type){
            case 'Null':
            case 'Undefined':
                res = true;
                break;
            case 'Object':
                //return Object.getOwnPropertyNames(obj).length==0?true:false;
                return !(Object.keys?Object.keys(obj).length>0:Object.getOwnPropertyNames(obj).length>0);
                break;
            case 'Array':
                res = obj.length==0?true:false;
                break;
            case 'Boolean':
                res = !obj;
                break;
            default:
                //var whitespace = "[\\x20\\t\\r\\n\\f]";
                //var rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" );
                res = obj.toString().replace(/^\s+/ig,'').replace(/\s+$/ig,'').length==0?true:false;//去掉前后空格
                break;
        }
        return res;
    }
    hs.VERSION = '1.0.0';
    root.hs = hs;
})();