function init(){$(this).scroll(function(){$(document).scrollTop()>500?$("#backTop").css("display","inline"):$("#backTop").css("display","none")}),$("body").mousemove(function(e){var t=e.originalEvent.x||e.originalEvent.layerX||0;20>=t&&($("#content").css("padding-left","400px"),$("#left-panel").fadeIn(500))}),$("#left-panel").dblclick(function(){$("#left-panel").fadeOut(500,function(){$("#content").css("padding-left",0)})}),setLightBox(),setLazyload()}function gotoTop(){$(document).scrollTop(0)}function setLightBox(){lightbox.option({resizeDuration:200,wrapAround:!0,fitImagesInViewport:!1,maxWidth:1e3}),$("div.pieces").find("div.piece").each(function(){var e=$(this).attr("id");$(this).find("div.piece-content").find("img").each(function(){var t=$("<a></a>");t.attr("href",$(this).attr("src")),t.attr("data-lightbox",e),$(this).attr("title","点击查看大图"),$(this).clone(!0).appendTo(t),$(this).before(t),$(this).remove()})})}function setLazyload(){$(document).find("img").each(function(){"user-avatar"!=$(this).attr("class")&&($(this).attr("data-layzr",$(this).attr("src")),$(this).removeAttr("src"))});new Layzr}function hideControlPanel(){$("#left-panel").fadeOut(1500,function(){$("#content").css("padding-left",0)})}function setUrl(e,t,i){history.pushState(i,t,e)}function loadEssays(e,t){$.ajax({url:e,type:"GET",data:{page:"essay"},dataType:"json",success:function(e){var i=getEssayPage(e);$("#"+t).html(i)},error:function(){}})}function getViewPage(e,t,i,s){showLoadingMask(t),$.ajax({url:e,type:"GET",data:{type:i,id:s},dataType:"json",success:function(e){$("#"+t).html(e),initEssayComment(),$(document).scrollTop(0),setLightBox()},error:function(e,t,i){console.log(e)}})}function loadMore(e,t){var i=$("#content").find("div.essay").length/10;console.log(i),$("button.load-more").remove(),$.ajax({url:e,type:"GET",data:{page:i},dataType:"json",success:function(e){console.log(e),1===e.empty?hMessage("没有更多了！"):($("#"+t).append(e),$(document).scrollTop($(document).scrollTop()+300)),$("#"+t).append($("button.load-more").html("加载更多"))},error:function(e,t,i){alert(e)}})}function getPage(e,t,i){showLoadingMask(t),$.ajax({url:e,type:"GET",data:{},dataType:"json",success:function(e){$("#"+t).html(e),setLightBox(),$(document).scrollTop(0)},error:function(e,t,i){console.log(e)}})}function showLoadingMask(e){var t=$("<img>");t.attr("src",public_path+"/img/loading.gif"),t.css("margin","100px auto"),showMask(e,t)}function showMask(e,t){if($("#"+e).css("position","relative"),$("#content-mask").length>0)$("#content-mask").html(""),$("#content-mask").append(t),$("#content-mask").show();else{var i=$("<div id='content-mask'></div>");i.append(t),i.css({position:"fixed",left:"0",top:"0","z-index":"1000",width:"100%",height:"100%","background-color":"#fff",opacity:"0.8","text-align":"center"}),$("#"+e).prepend(i),i.show()}}function hideMask(){$("#content-mask").hide()}function showEditPage(e,t,i){showLoadingMask(i),$.ajax({url:e,type:"GET",data:{type:t},dataType:"json",success:function(e){console.log(e),$("#"+i).html(e)},error:function(e,t,i){console.log(e)}})}function deleteItem(e,t){confirm("你确定要删除？")&&$.ajax({url:controller_path+"Action/delete.html",type:"GET",data:{type:e,id:t},dataType:"json",success:function(i){if(console.log(i),0==i.error){switch(e){case"essay":$("#content").find("div.essay[id="+t+"]").remove();break;case"diary":$("#content").find("div.diary[id="+t+"]").remove();break;case"piece":$("#content").find("div.piece[id="+t+"]").remove();break;case"essay":}hMessage("操作成功！")}else hMessage("操作失败！")},error:function(e,t,i){console.log(e)}})}function hMessage(e){var t=arguments[1]?arguments[1]:2e3;if($("#hMessage").length>0)$("#hMessage").html(e),$("#hMessage-mask").append($("#hMessage")),$("#hMessage").css("display","block"),$("#hMessage-mask").show(),setTimeout(function(){$("#hMessage").hide().empty(),$("#hMessage-mask").hide().empty()},t);else{console.log(e);var i=$('<div id="hMessage ">'+e+"</div>");i.css({position:"fixed","z-index":"1000",left:"50%",top:"200px","margin-left":"-150px","text-align":"center",width:"300px",height:"auto",background:"#f5f5f5",color:"#666",padding:"20px","font-size":"16px","box-shadow":"0px 2px 5px 1px rgba(0, 0, 0, 0.5)"}),$("#hMessage-mask").append(i),i.css("display","block"),$("#hMessage-mask").show(),setTimeout(function(){$("#hMessage").hide().empty(),$("#hMessage-mask").hide().empty()},t)}}function tag(e){hMessage(e)}function initEssayComment(){window.essay_editor=KindEditor.create(".post-comment-edit",essayCmtOptions)}function loadPieces(){$("button.load-more").html('<i class="icon-arrow-up"></i> 加载中...');var e=$("#content").find("div.piece").length;$.ajax({url:controller_path+"Index/load_pieces.html",type:"GET",data:{startNum:e},dataType:"json",success:function(e){0===e.error?($("div.pieces").append(e.html),setLightBox()):hMessage("没有更多了！"),$("button.load-more").html('<i class="icon-arrow-down"></i> 加载更多')},error:function(e,t,i){console.log(e)}})}function showPieceCmt(e){if(!($("#piece-comment").length>0)){var t=$('<div id="piece-comment"><div class="piece-comment-view"><div class="piece-comment-piece"><div class="piece-comment-piece-info"><a class="user" href="javascript:;">'+$("#"+e).find("a.piece-user").html()+'</a><span class="date">'+$("#"+e).find("span.piece-date").html()+'</span></div><div class="piece-comment-piece-content">'+$("#"+e).find("div.piece-content").html()+'</div><div class="piece-comment-piece-footer"><i class="icon-tag"></i> <a class="tag" href="javascript:;">'+$("#"+e).find("a.tag").html()+'</a></div></div><hr><div class="piece-comment-list"><div class="piece-comment-tip"><i class="icon-warning-sign"></i> 暂无评论</div></div></div><div class="piece-comment-post"><div class="piece-comment-post-header"><i class="icon-coffee"></i> 评论碎片</div><form class="hs-form piece-comment-post-form"><textarea class="piece-comment-edit" name="piece-comment-edit"></textarea><button type="button" onclick="postPieceCmt('+e+')" class="hs-btn hs-btn-primary post-piece-comment-btn">发 布</button></form></div></div>');$("#mask").prepend(t),$("#mask").show(),$("body").css("overflow-y","hidden"),window.piece_editor=KindEditor.create(".piece-comment-edit",pieceCmtOptions),getPieceCmt(e),document.onclick=function(e){var t=$(e.target);0==t.closest("#piece-comment").length&&($("#mask").hide(),$("#piece-comment").remove(),$("body").css("overflow-y","auto"))},$("button.piece-comment-submit").on("click",function(){hMessage("评论功能暂未实现")})}}function postEssayCmt(e){$("button.post-essay-comment-btn").html('<i class="icon-spinner"></i> 发布中...'),essay_editor.sync();var t=$("#essay-comment-form").children("textarea[name='comment-content']").val();$.ajax({url:controller_path+"Essay/post_comment.html",type:"POST",data:{essay_id:e,comment_content:t},dataType:"json",success:function(e){if(0===e.error){essay_editor.html(""),hMessage("评论发布成功！"),$("button.post-essay-comment-btn").html("发布评论");var t='<li class="hs-comment"><article class="hs-comment essay-comment"><a href=""><img class="hs-comment-avatar user-avatar" src="'+public_path+'/img/me.jpg" alt=""/></a><div class="hs-comment-main"><header class="hs-comment-hd"><div class="hs-comment-meta"><a href="#link-to-user" class="hs-comment-author">'+e.comment.user+'</a>评论于 <time datetime="">'+e.comment.date+'</time></div></header><div class="hs-comment-bd">'+e.comment.content+"</div></div></article></li>";$("div.comment-tip").remove(),$("div.essay-comments").children("ul").prepend(t)}else hMessage(e.msg)},error:function(e,t,i){console.log(e)}})}function postPieceCmt(e){$("button.post-piece-comment-btn").html('<i class="icon-spinner"></i> 发布中...'),piece_editor.sync();var t=$("form.piece-comment-post-form").children("textarea[name='piece-comment-edit']").val();console.log(t),$.ajax({url:controller_path+"Piece/post_comment.html",type:"POST",data:{piece_id:e,comment_content:t},dataType:"json",success:function(e){if(0===e.error){piece_editor.html(""),hMessage("评论发布成功！"),$("button.post-piece-comment-btn").html("发 布");var t='<div class="piece-comment-item"><div class="piece-comment-item-info"><a class="piece-comment-user" href="javascript:;">'+e.comment.user+'</a><span class="piece-comment-date"><i class="icon-time"></i> '+e.comment.date+'</span></div><div class="piece-comment-item-content">'+e.comment.content+'</div><div class="piece-comment-item-footer"></div></div>';$("div.piece-comment-tip").remove(),$("div.piece-comment-list").prepend(t)}else hMessage(e.msg)},error:function(e,t,i){console.log(e)}})}function getPieceCmt(e){$("div.piece-comment-tip").html('<i class="icon-spinner"></i> 获取评论...'),$.ajax({url:controller_path+"Piece/get_piece_comment.html",type:"GET",data:{piece_id:e},dataType:"json",success:function(e){if(0===e.error){for(var t="",i=0;i<e.comments.length;i++)t+='<div class="piece-comment-item"><div class="piece-comment-item-info"><a class="piece-comment-user" href="javascript:;">'+e.comments[i].username+'</a>&nbsp;<span class="piece-comment-date"><i class="icon-time"></i> '+e.comments[i].comment_date+'</span></div><div class="piece-comment-item-content">'+e.comments[i].comment_content+'</div><div class="piece-comment-item-footer"></div></div>';$("div.piece-comment-tip").remove(),$("div.piece-comment-list").prepend(t)}else $("div.piece-comment-tip").html('<i class="icon-warning-sign"></i> '+e.msg)},error:function(e,t,i){console.log(e)}})}function getPiecePage(e,t){showContentMask(t),$.ajax({url:e,type:"GET",data:{},dataType:"json",success:function(e){$("#"+t).html(e)},error:function(e,t,i){alert(i)}})}var controller_path="/Heysoo/Home/",progress_bar=$.AMUI.progress,editOpts={width:"100%",height:"400px",basePath:editor_basePath,themeType:"simple",items:["|","forecolor","hilitecolor","fontname","bold","italic","underline","|","justifyleft","justifycenter","justifyright","justifyfull","|","subscript","superscript","removeformat","|","image","multiimage","emoticons","|","link","unlink","fullscreen","preview","|"]},essayCmtOptions={basePath:editor_basePath,width:"710px",minWidth:"710px",maxWidth:"710px",height:"180px",minHeight:"180px",resizeType:0,items:["emoticons","link"],themeType:"simple"},pieceCmtOptions={basePath:editor_basePath,width:"380px",minWidth:"380px",maxWidth:"380px",height:"330px",minHeight:"330px",resizeType:0,items:["emoticons","link"],themeType:"simple"};jQuery(function(e){init()});