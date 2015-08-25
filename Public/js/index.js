var progress_bar = $.AMUI.progress;//进度条
//发布
var editOpts = {
    width:'100%',
    height:'400px',
    basePath:editor_basePath,
    themeType:'simple',
    items:[ '|','forecolor', 'hilitecolor', 'fontname' ,'bold', 
	'italic', 'underline', '|', 'justifyleft', 'justifycenter', 'justifyright',
	'justifyfull', '|', 'subscript',
	'superscript', 'removeformat', '|', 'image', 'multiimage',
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
//
function gotoTop(){
	$(document).scrollTop(0);
}
//lightbox
function setLightBox(){
	//设置参数
	lightbox.option({
      'resizeDuration': 200,
      'wrapAround': true,
      'fitImagesInViewport':false,
      'maxWidth':1000
    });
	$("#content").find("img").each(function(i){
		var img_link = $("<a></a>");
		img_link.attr('href',$(this).attr("src"));
		img_link.attr('data-lightbox',Math.random());
		$(this).attr("title","点击查看大图");
		$(this).clone(true).appendTo(img_link);
		$(this).before(img_link);
		$(this).remove();
	});
	/*$("div.pieces").find("div.piece").each(function(){
		var id = $(this).attr('id');
		$(this).find("div.piece-content").find("img").each(function(){
			var img_link = $("<a></a>");
			img_link.attr('href',$(this).attr("src"));
			img_link.attr('data-lightbox',id);
			$(this).attr("title","点击查看大图");
			$(this).clone(true).appendTo(img_link);
			$(this).before(img_link);
			$(this).remove();
		});
	});*/
}
//lazyload
function setLazyload(){
	$(document).find("img").each(function(){
		if($(this).attr("class") != "user-avatar"){
			$(this).attr("data-layzr",$(this).attr('src'));
			$(this).removeAttr("src");
		}
	});
	var layzr = new Layzr();
}
//隐藏左边控制面板
function hideControlPanel(){
	$("#left-panel").fadeOut(1500,function(){
		$("#content").css('padding-left',0);
	});
}

//设置浏览器url
function setUrl(url,title,stateObject){
	history.pushState(stateObject,title,url);
}
//获取文章信息
function loadEssays(url,parentId){
	$.ajax({
		url:url,
		type:'GET',
		data:{'page':'essay'},
		dataType:'json',
		success:function(data){
			var html = getEssayPage(data);
			$('#'+parentId).html(html);
		},
		error:function(){}
	});
}

function getViewPage(url,objId,type,id){
	showLoadingMask(objId);
	$.ajax({
		url:url,
		type:'GET',
		data:{'type':type,'id':id},
		dataType:'json',
		success:function(data){
			$("#"+objId).html(data);
			initEssayComment();
			$(document).scrollTop(0);
			setLightBox();
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			console.log(XMLHttpRequest);
		}
	});
}

function loadMore(url,objId){
	//showLoadingMask(objId);
	var page = $("#content").find("div.essay").length/10;
	$('button.load-more').remove();
	$.ajax({
		url:url,
		type:'GET',
		data:{'page':page},
		dataType:'json',
		success:function(data){
			if(data.empty === 1){
				hMessage('没有更多了！');
			}else{
				$("#"+objId).append(data);
				$(document).scrollTop($(document).scrollTop()+300);
			}
			$("#"+objId).append($('button.load-more').html('加载更多'));
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(XMLHttpRequest);
		}
	});
}
function getPage(url,objId,page){
	showLoadingMask(objId);
	$.ajax({
		url:url,
		type:'GET',
		data:{},
		dataType:'json',
		success:function(data){
			$("#"+objId).html(data);
			setLightBox();
			$(document).scrollTop(0);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			console.log(XMLHttpRequest);
		}
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
//弹出层编辑器
function showEditPage(url,type,objId){
	showLoadingMask(objId);
	$.ajax({
		url:url,
		type:'GET',
		data:{'type':type},
		dataType:'json',
		success:function(data){
			$("#"+objId).html(data);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			console.log(XMLHttpRequest);
		}
	});
}
//删除
/*function deleteItem(type,id){
	if(confirm('你确定要删除？'))
	$.ajax({
		url:home_path+"/Action/delete.html",
		type:'GET',
		data:{'type':type,'id':id},
		dataType:'json',
		success:function(data){
			if(data.error == 0){
				switch(type){
					case "essay":
					$("#content").find("div.essay[id="+id+"]").remove();
					break;
					case "diary":
					$("#content").find("div.diary[id="+id+"]").remove();
					break;
					case "piece":
					$("#content").find("div.piece[id="+id+"]").remove();
					break;
					case "essay":
					break;
				}
				hMessage('操作成功！');
			}
			else hMessage('操作失败！');
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			console.log(XMLHttpRequest);
		}
	});
}*/
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
//
function initEssayComment(){
        window.essay_editor = KindEditor.create('.post-comment-edit',essayCmtOptions);
}
//loadPieces,底部加载更多评论
function loadPieces(){
	$("button.load-more").html('<i class="icon-arrow-up"></i> 加载中...');
	var startNum = $("#content").find("div.piece").length;
	$.ajax({
		url:home_path+"/Index/load_pieces.html",
		type:'GET',
		data:{'startNum':startNum},
		dataType:'json',
		success:function(data){
			if(data.error === 0){
				$("div.pieces").append(data.html);
				setLightBox();
			}else hMessage("没有更多了！");
			$("button.load-more").html('<i class="icon-arrow-down"></i> 加载更多');
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			console.log(XMLHttpRequest);
		}
	});
}
//显示碎片评论
function showPieceCmt(pieceId){
	if($("#piece-comment").length > 0)return;
	var pieceCmt = $('<div id="piece-comment"><div class="piece-comment-view"><div class="piece-comment-piece">'+
	'<div class="piece-comment-piece-info"><a class="user" href="javascript:;">'+$("#"+pieceId).find("a.piece-user").html()+'</a><span class="date">'+$("#"+pieceId).find("span.piece-date").html()+'</span></div>'+
	'<div class="piece-comment-piece-content">'+$("#"+pieceId).find("div.piece-content").html()+'</div><div class="piece-comment-piece-footer">'+
	'<i class="icon-tag"></i> <a class="tag" href="javascript:;">'+$("#"+pieceId).find("a.tag").html()+'</a>'+
	'</div></div><hr><div class="piece-comment-list"><div class="piece-comment-tip"><i class="icon-warning-sign"></i> 暂无评论</div></div></div><div class="piece-comment-post">'+
	'<div class="piece-comment-post-header"><i class="icon-coffee"></i> 评论碎片</div><form class="hs-form piece-comment-post-form">'+
	'<textarea class="piece-comment-edit" name="piece-comment-edit"></textarea><button type="button" onclick="postPieceCmt('+pieceId+')" class="hs-btn hs-btn-primary post-piece-comment-btn">发 布</button>'+
	'</form></div></div>');
	//$("#"+pieceId).css('position','relative');
	$("#mask").prepend(pieceCmt);
	$("#mask").show();
	$("body").css('overflow-y','hidden');
	window.piece_editor = KindEditor.create('.piece-comment-edit',pieceCmtOptions);
	updatePieceCmt(pieceId);//获取碎片评论
	document.onclick = function(e){
		var target = $(e.target); 
		if(target.closest("#piece-comment").length == 0){ 
			$("#mask").hide();
			$("#piece-comment").remove();
			$("body").css('overflow-y','auto');
		} 
	}
	$("button.piece-comment-submit").on('click',function(){
		hMessage('评论功能暂未实现');
	});
}
//发布文章评论
function postEssayCmt(essay_id){
	$("button.post-essay-comment-btn").html('<i class="icon-spinner"></i> 发布中...');
	essay_editor.sync(); //同步编辑器内容
	var content = $("#essay-comment-form").children("textarea[name='comment-content']").val();
	$.ajax({
		url:home_path+"/Essay/post_comment.html",
		type:'POST',
		data:{'essay_id':essay_id,'comment_content':content},
		dataType:'json',
		success:function(data){
			if(data.error === 0){
				//清空编辑器
				essay_editor.html('');
				hMessage('评论发布成功！');
				$("button.post-essay-comment-btn").html('发布评论');
				//将新评论插入评论列表
				var html = '<li class="hs-comment">'+
				'<article class="hs-comment essay-comment"><a href="">'+
				'<img class="hs-comment-avatar user-avatar" src="'+public_path+'/img/me.jpg" alt=""/></a>'+
				'<div class="hs-comment-main"><header class="hs-comment-hd">'+
				'<div class="hs-comment-meta"><a href="#link-to-user" class="hs-comment-author">'+data.comment.user+'</a>'+
				'评论于 <time datetime="">'+data.comment.date+'</time></div></header>'+
				'<div class="hs-comment-bd">'+data.comment.content+'</div></div></article></li>';
				$("div.comment-tip").remove();
				$("div.essay-comments").children("ul").prepend(html);
			}else{ hMessage(data.msg); }
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