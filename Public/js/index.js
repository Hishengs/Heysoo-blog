var progress_bar = $.AMUI.progress;//进度条
var site_prefix = "http://localhost";
//发布
var editOpts = {
    width:'100%',
    height:'680px',
    basePath:editor_basePath,
    themeType:'simple',
    items:[ '|','forecolor', 'hilitecolor', 'fontname' ,'bold', 
	'italic', 'underline', '|', 'justifyleft', 'justifycenter', 'justifyright',
	'justifyfull', '|', 'subscript',
	'superscript', 'removeformat', '|', 'image', 
	'emoticons','|', 'link', 'unlink', 'fullscreen',
	'preview', '|'
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
		items:['emoticons', 'link'],
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
		resizeType:0,
		items:['emoticons', 'link'],
		themeType : 'simple'
			}; 
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
	var time = arguments[1] ? arguments[1] : 2000; 
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
			"z-index":"1000",
			"left":"50%",
			"top":"200px",
			"margin-left":"-150px",
			"text-align":"center",
			"width":"300px",
			"height":"auto",
			"background":"#f5f5f5",
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

//获取碎片评论
function updatePieceCmt(piece_id){
	$("div.piece-comment-tip").html('<i class="icon-spinner"></i> 获取评论...');
	$.ajax({
		url:home_path+"/Piece/get_piece_comment.html",
		type:'GET',
		data:{'piece_id':piece_id},
		dataType:'json',
		success:function(data){
			if(data.error === 0){
				//将评论插入评论列表
				var html = '';
				for (var i = 0;  i < data.comments.length; i++) {
					html += '<div class="piece-comment-item"><div class="piece-comment-item-info">'+
					'<a class="piece-comment-user" href="javascript:;">'+data.comments[i]['username']+'</a>&nbsp;<span class="piece-comment-date"><i class="icon-time"></i> '+data.comments[i]['comment_date']+'</span></div>'+
					'<div class="piece-comment-item-content">'+data.comments[i]['comment_content']+'</div><div class="piece-comment-item-footer"></div></div>';
				};
				$("div.piece-comment-tip").remove();
				$("div.piece-comment-list").prepend(html);
			}else{ $("div.piece-comment-tip").html('<i class="icon-warning-sign"></i> '+data.msg);}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			console.log(XMLHttpRequest);
		}
	});
}
//go to view page
function view(typeId,id){
	//window.location.href = site_prefix+"/heysoo/#/view/"+id;
	var current_url = window.location.href.split('#')[0];
	//console.log(current_url);
	window.location.href = current_url+"#/view/"+id;
}
