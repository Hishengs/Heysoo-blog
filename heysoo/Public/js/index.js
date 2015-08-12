jQuery(function($) {
	$(this).scroll(function(){
		//回到顶部按钮在滚动条大于500高度才出现
		if($(document).scrollTop() > 500)$("#backTop").css("display","inline");
		else
		$("#backTop").css("display","none");
	});
	//靠近左侧现实
	$('body').mousemove(function(e) { 
		var xx = e.originalEvent.x || e.originalEvent.layerX || 0; 
		if(xx <= 20){
			console.log(xx);
			$("#content").css('padding-left','400px');
			$("#left_panel").fadeIn(1500);
		}
	}); 
	//双击左侧控制面板隐藏
	$("#left_panel").dblclick(function(){
		$("#left_panel").fadeOut(1500,function(){
		$("#content").css('padding-left',0);
		});
	});
	//初始化
	init();
});
//初始化函数
function init(){
	setLightBox();
	$('.hs-alert').alert();
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
	$("body").find("img").each(function(i){
		var img_link = $("<a></a>");
		img_link.attr('href',$(this).attr("src"));
		img_link.attr('data-lightbox',Math.random());
		$(this).attr("title","点击查看大图");
		$(this).clone(true).appendTo(img_link);
		$(this).before(img_link);
		$(this).remove();
		//$(this).replaceWith(img_link);
		//$(this).attr('data-lightbox',$(this).attr("src"));
	});
}
//隐藏左边控制面板
function hideControlPanel(){
	$("#left_panel").fadeOut(1500,function(){
		$("#content").css('padding-left',0);
	});
}
/**
 * 回到顶部
 * */
function gotoTop()
{
	if (document.documentElement && document.documentElement.scrollTop) { 
		document.documentElement.scrollTop=0; 
		} 
		else if (document.body) { 
		document.body.scrollTop=0; 
		} 
}

//获取滚动条当前的位置 
function getScrollTop() { 
var scrollTop = 0; 
if (document.documentElement && document.documentElement.scrollTop) { 
scrollTop = document.documentElement.scrollTop; 
} 
else if (document.body) { 
scrollTop = document.body.scrollTop; 
} 
return scrollTop; 
} 

//获取当前可是范围的高度 
function getClientHeight() { 
var clientHeight = 0; 
if (document.body.clientHeight && document.documentElement.clientHeight) { 
clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight); 
} 
else { 
clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight); 
} 
return clientHeight; 
} 

//获取文档完整的高度 
function getScrollHeight() { 
return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); 
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
			alert(errorThrown);
		}
	});
	var stateObject = {};
	var title = "我的文章";
	var newUrl = url;
	//current_state = History.getState();
	//History.pushState(current_state['data'], current_state['title'], current_state['url']+"/?page="+page);
	//History.replaceState(null,"page"+page,"?page="+page);
	//console.log(current_state['url']);
	//setUrl(stateObject,title,newUrl);
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
function deleteItem(url,type,id){
	if(confirm('你确定要删除？'))
	$.ajax({
		url:url,
		type:'GET',
		data:{'type':type,'id':id},
		dataType:'json',
		success:function(data){
			console.log(data);
			if(data.error == 0)hMessage('操作成功！');
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
		console.log(msg);
		$('#hMessage').html(msg);
		$('#hMessage').show();
		setTimeout(function(){$('#hMessage').hide();},time);
	}else{
		console.log(msg);
		var hMessage = $('<div id="hMessage ">'+msg+'</div>');
		hMessage.css({
			"position":"fixed",
			"z-index":"1000",
			"left":"50%",
			"top":"40%",
			"text-align":"center",
			"width":"auto",
			"height":"auto",
			"background":"#FF7F50",
			"color":"#fff",
			"padding":"10px",
			"border":"1px solid #eee",
			"box-shadow":"0px 2px 5px rgba(0, 0, 0, 0.5)"
		});
		$("body").append(hMessage);
		hMessage.show();
		setTimeout(function(){hMessage.hide();},time);
	}
}