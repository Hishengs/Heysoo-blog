function init(){$(this).scroll(function(){$(document).scrollTop()>500?$("#backTop").css("display","inline"):$("#backTop").css("display","none")}),setLightBox(),setLazyload()}function gotoTop(){$(document).scrollTop(0)}function setLightBox(){}function setLazyload(){}function hideControlPanel(){$("#left-panel").fadeOut(1500,function(){$("#content").css("padding-left",0)})}function showLoadingMask(e){var t=$("<img>");t.attr("src",public_path+"/img/loading.gif"),t.css("margin","100px auto"),showMask(e,t)}function showMask(e,t){if($("#"+e).css("position","relative"),$("#content-mask").length>0)$("#content-mask").html(""),$("#content-mask").append(t),$("#content-mask").show();else{var i=$("<div id='content-mask'></div>");i.append(t),i.css({position:"fixed",left:"0",top:"0","z-index":"1000",width:"100%",height:"100%","background-color":"#fff",opacity:"0.8","text-align":"center"}),$("#"+e).prepend(i),i.show()}}function hideMask(){$("#content-mask").hide()}function hMessage(e){var t=arguments[1]?arguments[1]:2e3;if($("#hMessage").length>0)$("#hMessage").html(e),$("#hMessage-mask").append($("#hMessage")),$("#hMessage").css("display","block"),$("body").css({"overflow-x":"hidden","overflow-y":"hidden"}),$("#hMessage-mask").show(),setTimeout(function(){$("#hMessage").hide().empty(),$("#hMessage-mask").hide().empty(),$("body").css({"overflow-x":"auto","overflow-y":"auto"})},t);else{var i=$('<div id="hMessage ">'+e+"</div>");i.css({position:"fixed","z-index":"1000",left:"50%",top:"200px","margin-left":"-150px","text-align":"center",width:"300px",height:"auto",background:"#f5f5f5",color:"#666",padding:"20px","font-size":"16px","box-shadow":"0px 2px 5px 1px rgba(0, 0, 0, 0.5)"}),$("#hMessage-mask").append(i),i.css("display","block"),$("body").css({"overflow-x":"hidden","overflow-y":"hidden"}),$("#hMessage-mask").show(),setTimeout(function(){$("#hMessage").hide().empty(),$("#hMessage-mask").hide().empty(),$("body").css({"overflow-x":"auto","overflow-y":"auto"})},t)}}function tag(e){hMessage(e)}function updatePieceCmt(e){$("div.piece-comment-tip").html('<i class="icon-spinner"></i> 获取评论...'),$.ajax({url:home_path+"/Piece/get_piece_comment.html",type:"GET",data:{piece_id:e},dataType:"json",success:function(e){if(0===e.error){for(var t="",i=0;i<e.comments.length;i++)t+='<div class="piece-comment-item"><div class="piece-comment-item-info"><a class="piece-comment-user" href="javascript:;">'+e.comments[i].username+'</a>&nbsp;<span class="piece-comment-date"><i class="icon-time"></i> '+e.comments[i].comment_date+'</span></div><div class="piece-comment-item-content">'+e.comments[i].comment_content+'</div><div class="piece-comment-item-footer"></div></div>';$("div.piece-comment-tip").remove(),$("div.piece-comment-list").prepend(t)}else $("div.piece-comment-tip").html('<i class="icon-warning-sign"></i> '+e.msg)},error:function(e,t,i){console.log(e)}})}var progress_bar=$.AMUI.progress,editOpts={width:"100%",height:"400px",basePath:editor_basePath,themeType:"simple",items:["|","forecolor","hilitecolor","fontname","bold","italic","underline","|","justifyleft","justifycenter","justifyright","justifyfull","|","subscript","superscript","removeformat","|","image","multiimage","emoticons","|","link","unlink","fullscreen","preview","|"]},essayCmtOptions={basePath:editor_basePath,width:"710px",minWidth:"710px",maxWidth:"710px",height:"180px",minHeight:"180px",resizeType:0,items:["emoticons","link"],themeType:"simple"},pieceCmtOptions={basePath:editor_basePath,width:"380px",minWidth:"380px",maxWidth:"380px",height:"330px",minHeight:"330px",resizeType:0,items:["emoticons","link"],themeType:"simple"};jQuery(function(e){init()});