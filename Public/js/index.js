var controller_path = "/Heysoo/Home/";
//文章评论配置
var essayCmtOptions  = {
		basePath:editor_basePath,
		width:'710px',
		minWidth:'710px',
		maxWidth:'710px',
		height:'180px',
		minHeight:'180px',
		resizeType:0,
		items:[ '|', 'fontsize','removeformat', '|', 'image', 
				'emoticons','|', 'link', 'unlink','fullscreen', 'preview', '|'],
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
		items:[ '|', 'fontsize','removeformat', '|', 'image', 
				'emoticons','|', 'link', 'unlink','fullscreen', 'preview', '|'],
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
	//靠近左侧显示
	/*$('body').mousemove(function(e) { 
		var xx = e.originalEvent.x || e.originalEvent.layerX || 0; 
		var yy = e.originalEvent.y || e.originalEvent.layerY || 0; 
		if(yy <= 20 && xx <= 400){
			console.log(xx);
			$("#content").css('padding-left','400px');
			$("#left_panel").fadeIn(500);
		}else if(xx > 400){ 
			$("#left_panel").fadeOut(500); 
			$("#content").css('padding-left','0');
		}
	}); */
	//双击左侧控制面板隐藏
	$("#left_panel").dblclick(function(){
		$("#left_panel").fadeOut(1500,function(){
		$("#content").css('padding-left',0);
		});
	});
	setLightBox();
	//setLazyload();
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
	/*$("#content").find('div.piece_content').find("img").each(function(i){
		var img_link = $("<a></a>");
		img_link.attr('href',$(this).attr("src"));
		img_link.attr('data-lightbox',Math.random());
		$(this).attr("title","点击查看大图");
		$(this).clone(true).appendTo(img_link);
		$(this).before(img_link);
		$(this).remove();
	});*/
	$("div.pieces").find("div.piece").each(function(){
		var id = $(this).attr('id');
		$(this).find("div.piece_content").find("img").each(function(){
			var img_link = $("<a></a>");
			img_link.attr('href',$(this).attr("src"));
			img_link.attr('data-lightbox',id);
			$(this).attr("title","点击查看大图");
			$(this).clone(true).appendTo(img_link);
			$(this).before(img_link);
			$(this).remove();
		});
	});
}
//lazyload
function setLazyload(){
	$(document).find("img").each(function(){
		if($(this).attr("class") != "user_avatar"){
			$(this).attr("class","lazy");
			$(this).attr("data-original",$(this).attr("src"));
		}
	});
	$("img.lazy").lazyload();
}
//隐藏左边控制面板
function hideControlPanel(){
	$("#left_panel").fadeOut(1500,function(){
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
			alert(errorThrown);
		}
	});
}

function loadMore(url,objId){
	//showLoadingMask(objId);
	var page = $("#content").find("div.essay").length/10;
	console.log(page);
	$('button.load_more').remove();
	$.ajax({
		url:url,
		type:'GET',
		data:{'page':page},
		dataType:'json',
		success:function(data){
			console.log(data);
			if(data.empty === 1){
				hMessage('没有更多了！');
			}else{
				$("#"+objId).append(data);
				$(document).scrollTop($(document).scrollTop()+300);
			}
			$("#"+objId).append($('button.load_more').html('加载更多'));
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
	if($("#content_mask").length > 0){
		$("#content_mask").html("");
		$("#content_mask").append(content);
		$("#content_mask").show();
	}
	else{
		var mask = $("<div id='content_mask'></div>");
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
//弹出层编辑器
function showEditPage(url,type,objId){
	showLoadingMask(objId);
	$.ajax({
		url:url,
		type:'GET',
		data:{'type':type},
		dataType:'json',
		success:function(data){
			console.log(data);
			$("#"+objId).html(data);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			console.log(XMLHttpRequest);
		}
	});
}
//删除
function deleteItem(type,id){
	if(confirm('你确定要删除？'))
	$.ajax({
		url:controller_path+"Action/delete.html",
		type:'GET',
		data:{'type':type,'id':id},
		dataType:'json',
		success:function(data){
			console.log(data);
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
}
//弹出消息框
function hMessage(msg){
	var time = arguments[1] ? arguments[1] : 2000; 
	if($('#hMessage').length > 0){
		$('#hMessage').html(msg);
		$("#hMessage_mask").append($('#hMessage'));
		$('#hMessage').css('display','block');
		$('#hMessage_mask').show();
		setTimeout(function(){$('#hMessage').hide().empty();$('#hMessage_mask').hide().empty();},time);
	}else{
		console.log(msg);
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
		//$("body").append(hMessage);
		$("#hMessage_mask").append(hMessage);
		hMessage.css('display','block');
		$('#hMessage_mask').show();
		setTimeout(function(){$('#hMessage').hide().empty();$('#hMessage_mask').hide().empty();},time);
	}
}
//处理标签
function tag(tag){
	hMessage(tag);
	return;
	$.ajax({
		url:controller_path+"Action/tag.html",
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
	$("button.load_more").html('<i class="icon-arrow-up"></i> 加载中...');
	var startNum = $("#content").find("div.piece").length;
	$.ajax({
		url:controller_path+"Index/load_pieces.html",
		type:'GET',
		data:{'startNum':startNum},
		dataType:'json',
		success:function(data){
			if(data.error === 0){
				$("div.pieces").append(data.html);
				setLightBox();
			}else hMessage("没有更多了！");
			$("button.load_more").html('<i class="icon-arrow-down"></i> 加载更多');
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			console.log(XMLHttpRequest);
		}
	});
}
//显示碎片评论
function showPieceCmt(pieceId){
	if($("#piece_comment").length > 0)return;
	var pieceCmt = $('<div id="piece_comment"><div class="piece_comment_view"><div class="piece_comment_piece">'+
	'<div class="piece_comment_piece_info"><a class="user" href="javascript:;">'+$("#"+pieceId).find("a.piece_user").html()+'</a><span class="date">'+$("#"+pieceId).find("span.piece_date").html()+'</span></div>'+
	'<div class="piece_comment_piece_content">'+$("#"+pieceId).find("div.piece_content").html()+'</div><div class="piece_comment_piece_footer">'+
	'<i class="icon-tag"></i> <a class="tag" href="javascript:;">'+$("#"+pieceId).find("a.tag").html()+'</a>'+
	'</div></div><div class="piece_comment_list"><div class="piece_comment_tip"><i class="icon-warning-sign"></i> 暂无评论</div></div></div><div class="piece_comment_post">'+
	'<div class="piece_comment_post_header"><i class="icon-coffee"></i> 评论碎片</div><form class="hs-form piece_comment_post_form">'+
	'<textarea class="piece-comment-edit" name="piece-comment-edit"></textarea><button type="button" onclick="postPieceCmt('+pieceId+')" class="hs-btn hs-btn-primary post_piece_comment_btn">发 布</button>'+
	'</form></div></div>');
	//$("#"+pieceId).css('position','relative');
	$("#mask").prepend(pieceCmt);
	$("#mask").show();
	$("body").css('overflow-y','hidden');
	window.piece_editor = KindEditor.create('.piece-comment-edit',pieceCmtOptions);
	getPieceCmt(pieceId);//获取碎片评论
	document.onclick = function(e){
		var target = $(e.target); 
		if(target.closest("#piece_comment").length == 0){ 
			$("#mask").hide();
			$("#piece_comment").remove();
			$("body").css('overflow-y','auto');
		} 
	}
	$("button.piece_comment_submit").on('click',function(){
		hMessage('评论功能暂未实现');
	});
}
//获取碎片评论
function getPieceCmt(pieceId){

}
//发布文章评论
function postEssayCmt(essay_id){
	$("button.post-essay-comment-btn").html('<i class="icon-spinner"></i> 发布中...');
	essay_editor.sync(); //同步编辑器内容
	var content = $("#essay-comment-form").children("textarea[name='comment-content']").val();
	$.ajax({
		url:controller_path+"Essay/post_comment.html",
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
//发布碎片评论
function postPieceCmt(piece_id){
	$("button.post_piece_comment_btn").html('<i class="icon-spinner"></i> 发布中...');
	piece_editor.sync(); //同步编辑器内容
	var content = $("form.piece_comment_post_form").children("textarea[name='piece-comment-edit']").val();
	console.log(content);
	$.ajax({
		url:controller_path+"Piece/post_comment.html",
		type:'POST',
		data:{'piece_id':piece_id,'comment_content':content},
		dataType:'json',
		success:function(data){
			if(data.error === 0){
				//清空编辑器
				piece_editor.html('');
				hMessage('评论发布成功！');
				$("button.post_piece_comment_btn").html('发 布');
				//将新评论插入评论列表
				var html = '<div class="piece_comment_item"><div class="piece_comment_item_info">'+
				'<a class="piece_comment_user" href="javascript:;">'+data.comment.user+'</a><span class="piece_comment_date"><i class="icon-time"></i> '+data.comment.date+'</span></div>'+
				'<div class="piece_comment_item_content">'+data.comment.content+'</div><div class="piece_comment_item_footer"></div></div>';
				$("div.piece_comment_tip").remove();
				$("div.piece_comment_list").prepend(html);
			}else{ hMessage(data.msg); }
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			console.log(XMLHttpRequest);
		}
	});
}
//获取碎片评论
function getPieceCmt(piece_id){
	$("div.piece_comment_tip").html('<i class="icon-spinner"></i> 获取评论...');
	$.ajax({
		url:controller_path+"Piece/get_piece_comment.html",
		type:'GET',
		data:{'piece_id':piece_id},
		dataType:'json',
		success:function(data){
			if(data.error === 0){
				//将评论插入评论列表
				var html = '';
				for (var i = 0;  i < data.comments.length; i++) {
					html += '<div class="piece_comment_item"><div class="piece_comment_item_info">'+
					'<a class="piece_comment_user" href="javascript:;">'+data.comments[i]['userName']+'</a>&nbsp;<span class="piece_comment_date"><i class="icon-time"></i> '+data.comments[i]['comment_date']+'</span></div>'+
					'<div class="piece_comment_item_content">'+data.comments[i]['comment_content']+'</div><div class="piece_comment_item_footer"></div></div>';
				};
				$("div.piece_comment_tip").remove();
				$("div.piece_comment_list").prepend(html);
			}else{ hMessage(data.msg); $("div.piece_comment_tip").html('<i class="icon-warning-sign"></i> 评论获取失败！');}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			console.log(XMLHttpRequest);
		}
	});
}