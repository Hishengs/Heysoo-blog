var heysoo=angular.module("Index",["ui.router","ipCookie"]),tpl_piece_url=public_path+"/templates/Piece",tpl_essay_url=public_path+"/templates/Essay",tpl_index_url=public_path+"/templates/Index/index.html",tpl_message_url=public_path+"/templates/message",tpl_tag_url=public_path+"/templates/tag",tpl_search_url=public_path+"/templates/search.html",tpl_setting_url=public_path+"/templates/setting",tpl_follow_url=public_path+"/templates/follow",tpl_action_url=public_path+"/templates/action";heysoo.config(["$locationProvider","$urlRouterProvider","$compileProvider",function($locationProvider,$urlRouterProvider,$compileProvider){$urlRouterProvider.otherwise(""),$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/)}]),heysoo.config(["$httpProvider",function($httpProvider){$httpProvider.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded;charset=utf-8",$httpProvider.defaults.headers.common["Content-Type"]="application/x-www-form-urlencoded;charset=utf-8";var param=function(obj){var name,value,fullSubName,subName,subValue,innerObj,i,query="";for(name in obj)if(value=obj[name],value instanceof Array)for(i=0;i<value.length;++i)subValue=value[i],fullSubName=name+"["+i+"]",innerObj={},innerObj[fullSubName]=subValue,query+=param(innerObj)+"&";else if(value instanceof Object)for(subName in value)subValue=value[subName],fullSubName=name+"["+subName+"]",innerObj={},innerObj[fullSubName]=subValue,query+=param(innerObj)+"&";else void 0!==value&&null!==value&&(query+=encodeURIComponent(name)+"="+encodeURIComponent(value)+"&");return query.length?query.substr(0,query.length-1):query};$httpProvider.defaults.transformRequest=[function(data){return angular.isObject(data)&&"[object File]"!==String(data)?param(data):data}]}]),heysoo.service("User",function($http){this.getUserConfig=function(){return $http({method:"GET",url:home_path+"/User/ng_get_user_config.html"})}}),heysoo.service("Piece",function($http){this["delete"]=function(piece_id){return $http({method:"POST",url:home_path+"/Piece/delete.html",data:{piece_id:piece_id}})},this.getPieceComments=function(piece_id){return $http({method:"GET",url:home_path+"/Piece/get_piece_comment.html?piece_id="+piece_id})},this.postComment=function(comment){return $http({method:"POST",url:home_path+"/Piece/post_comment.html",data:comment})},this.deleteComment=function(comment_id){return $http({method:"POST",url:home_path+"/Piece/delete_comment.html",data:{comment_id:comment_id}})}}),heysoo.config(["$stateProvider",function($stateProvider){$stateProvider.state("home",{url:"/"})}]),heysoo.config(["$stateProvider",function($stateProvider){$stateProvider.state("edit",{url:"/edit",views:{content:{templateUrl:tpl_essay_url+"/edit.html"}}}).state("essay",{url:"/essay/page/:page",views:{content:{templateUrl:tpl_essay_url+"/index.html"}}}).state("view",{url:"/view/:id",params:{id:null},controller:"c_view",views:{content:{templateUrl:tpl_essay_url+"/view.html"}}}).state("setting_profile_userName",{url:"/modifyUserName",views:{mask:{templateUrl:tpl_action_url+"/setting/modifyUserName.html"}}}).state("modify",{url:"/modify/type/:type/id/:id",views:{content:{templateUrl:tpl_essay_url+"/modify.html"}}})}]),heysoo.config(["$stateProvider",function($stateProvider){$stateProvider.state("piece",{url:"/piece/page/:page",views:{content:{templateUrl:tpl_piece_url+"/index.html"}}}).state("comment",{url:"/comment/:id",views:{mask:{templateUrl:tpl_piece_url+"/comment.html"}}})}]),heysoo.config(["$stateProvider",function($stateProvider){$stateProvider.state("message",{url:"/message",views:{content:{templateUrl:tpl_message_url+"/message.html"}}}).state("msg_comment",{url:"/comment",parent:"message",views:{message:{templateUrl:tpl_message_url+"/comment.html"}}}).state("msg_at",{url:"/at",parent:"message",views:{message:{templateUrl:tpl_message_url+"/at.html"}}}).state("msg_whisper",{url:"/whisper",parent:"message",views:{message:{templateUrl:tpl_message_url+"/whisper.html"}}}).state("msg_notice",{url:"/notice",parent:"message",views:{message:{templateUrl:tpl_message_url+"/notice.html"}}})}]),heysoo.config(["$stateProvider",function($stateProvider){$stateProvider.state("follow",{url:"/follow",views:{content:{templateUrl:tpl_follow_url+"/follow.html"}}}).state("follow_followed",{url:"/followed",parent:"follow",views:{follow:{templateUrl:tpl_follow_url+"/followed.html"}}}).state("follow_following",{url:"/following",parent:"follow",views:{follow:{templateUrl:tpl_follow_url+"/following.html"}}})}]),heysoo.config(["$stateProvider",function($stateProvider){$stateProvider.state("setting",{url:"/setting",views:{content:{templateUrl:tpl_setting_url+"/setting.html"}}}).state("setting_profile",{url:"/profile",parent:"setting",views:{v_setting:{templateUrl:tpl_setting_url+"/profile.html"}}}).state("setting_interface",{url:"/interface",parent:"setting",views:{v_setting:{templateUrl:tpl_setting_url+"/interface.html"}}}).state("setting_push",{url:"/push",parent:"setting",views:{v_setting:{templateUrl:tpl_setting_url+"/push.html"}}}).state("setting_privacy",{url:"/privacy",parent:"setting",views:{v_setting:{templateUrl:tpl_setting_url+"/privacy.html"}}})}]),heysoo.config(["$stateProvider",function($stateProvider){$stateProvider.state("tag",{url:"/tag",views:{content:{templateUrl:tpl_tag_url+"/tag.html"}}}).state("tag_essay",{url:"/essay",parent:"tag",views:{tag:{templateUrl:tpl_tag_url+"/essay_tag.html"}}}).state("tag_piece",{url:"/piece",parent:"tag",views:{tag:{templateUrl:tpl_tag_url+"/piece_tag.html"}}}).state("tag_friend",{url:"/friend",parent:"tag",views:{tag:{templateUrl:tpl_tag_url+"/friend_tag.html"}}})}]),heysoo.config(["$stateProvider",function($stateProvider){$stateProvider.state("search",{url:"/search",views:{content:{templateUrl:tpl_search_url}}})}]),heysoo.controller("c_sidePanel",function($http,$rootScope,$scope){var url=home_path+"/Index/ng_init_side_panel.html";$http.get(url).success(function(res){0===res.error&&($rootScope.avatar=res.user.avatar,$rootScope.user_info=res.user,$rootScope.essay_nums=res.essay_nums,$rootScope.piece_nums=res.piece_nums,$rootScope.diary_nums=res.diary_nums,$rootScope.unread_msg_num=res.unread_msg_num)}),$("body").mousemove(function(e){var xx=e.originalEvent.x||e.originalEvent.layerX||0;20>=xx&&($("#content").css("padding-left","400px"),$("#left-panel").fadeIn(500))}),$scope.toggleSidePanel=function(){$("#left-panel").fadeOut(500,function(){$("#content").css("padding-left",0)})};var timer=6e4;setInterval(function(){var url=home_path+"/Message/ng_get_unread_msg_num.html";$http.get(url).success(function(res){res.unread_msg_num<1||$rootScope.unread_msg_num===res.unread_msg_num?timer-=1e3:timer+=1e3,timer=3e4>timer?6e4:timer,$rootScope.unread_msg_num=res.unread_msg_num})},timer)}),heysoo.controller("c_index",function($scope,$rootScope,$state,$stateParams,$http,$timeout,Piece,ipCookie,User){$rootScope.mask_show=!1,$rootScope.style={},User.getUserConfig().success(function(res){0===res.error?($rootScope.user_config=res.user_config,$rootScope.interface_color=res.user_config.interface_color?res.user_config.interface_color:ipCookie("interface_color"),$rootScope.mainBg=res.user_config.main_bg,$rootScope.sideBarBg=res.user_config.sidebar_bg,$rootScope.style.sidebar_bg={"background-image":"url("+$rootScope.sideBarBg+"?imageView2/2/w/400)"},$rootScope.style.main_bg={"background-image":"url("+$rootScope.mainBg+")"}):hMessage(res.msg)}),$http.get(home_path+"/Index/ng_index.html").success(function(res){$rootScope.index_items=res,$scope.index_page=2}),$state.go("home"),$scope.indexLoadMore=function(){$("button.index-load-more").html('<i class="hs-icon-spinner"></i> 加载中...'),$http.get(home_path+"/Index/ng_index.html?index_page="+$scope.index_page).success(function(res){if($("button.index-load-more").html('<i class="hs-icon-arrow-down"></i> 加载更多'),!res.length)return void hMessage("沒有更多了！");for(var i=0;i<res.length;i++)$scope.index_items.push(res[i]);$scope.index_page++})},$scope.getPage=function(page){if(progress_bar.start(),"piece"===page){var url=home_path+"/Piece/ng_get_piece_page.html",c_state="piece";$rootScope.item_nums=$rootScope.piece_nums}else{if("essay"!==page)return;var url=home_path+"/Essay/ng_get_essay_page.html",c_state="essay";$rootScope.item_nums=$rootScope.essay_nums,$scope.view_path=home_path+"/Essay/ng_view.html"}$http.get(url).success(function(res){$rootScope.items=res.items,$scope.res_empty=res.items.length<1?!0:!1,$scope.page=res.page,$state.go(c_state,{page:1}),paginator_index=1,progress_bar.done()})},$scope.showPublish=function(){$scope.edit_post_path=home_path+"/Action/deal_post.html",$state.go("edit")},$scope.getViewPage=function(id){$state.go("view",{id:id})},$scope.deleteItem=function(type,id){if(confirm("你确定要删除？")){var url=home_path+"/Action/ng_delete.html";$http.get(url,{params:{type:type,id:id}}).success(function(res){0===res.error?($("#"+id).remove(),hMessage(res.msg)):hMessage(res.msg)})}},$scope.modify=function(type,id){$rootScope.type=type,$rootScope.id=id,$state.go("modify",{type:type,id:id})},$scope.showMessage=function(){progress_bar.start(),$scope.msg_tip_show=!1;var msg_url=home_path+"/Message/get_msg_list.html";$http.get(msg_url).success(function(res){0===res.error?($scope.msgs=res.items,$scope.senders=res.senders,$scope.msg_tip_show=res.items.length<1?!0:!1):$scope.msg_tip_show=!0,progress_bar.done(),$rootScope.unread_msg_num=""}),$state.go("message"),$state.go("msg_comment")},$scope.showTag=function(){$state.go("tag")},$scope.showSetting=function(){$scope.setting_tab="profile",$scope.origin_user_avatar_path="FgW07muueXq9EI9OIdezcY5ODe4f",$state.go("setting"),$state.go("setting_profile")},$scope.showSearch=function(){$state.go("search")},$scope.showFollow=function(){$rootScope.follow_items=new Array(0),$state.go("follow");var url=home_path+"/User/get_follow_list.html?type=followed";$http.get(url).success(function(res){0===res.error&&res.items.length>0?($rootScope.follow_items=res.items,$rootScope.follow_tip_show=!1):$rootScope.follow_tip_show=!0}),$state.go("follow_followed")},$rootScope.viewUser=function(userName){var url=home_path+"/User/index.html?user="+userName;window.open(url)}});var paginator_index=1,num_per_page=10,url_prefix=home_path+"/Action/ng_paginator.html";heysoo.controller("c_paginator",function($scope,$rootScope,$state,$http){$scope.paginator_pages=new Array;for(var i=0;i<$rootScope.item_nums/num_per_page;i++)$scope.paginator_pages[i]={id:parseInt(i+1),name:"第 "+parseInt(i+1)+" 页"};$scope.paginator_index=paginator_index,$scope.paginator_current_page=$scope.paginator_pages[paginator_index-1],$scope.paginator=function(type,action){if("prev"===action){if(1===paginator_index)return void hMessage("当前已是第一页");url=url_prefix+"?type="+type+"&page="+parseInt(paginator_index-1)}else if("go"===action){if(parseInt($scope.paginator_current_page.id)===paginator_index)return;url=url_prefix+"?type="+type+"&page="+parseInt($scope.paginator_current_page.id)}else"next"===action&&(url=url_prefix+"?type="+type+"&page="+parseInt(paginator_index+1));$http.get(url).success(function(res){if(0===res.error){if(res.items.length<1)return void hMessage("当前已是最后一页！");$rootScope.items=res.items,$state.go(type,{page:res.page}),$(document).scrollTop(0),paginator_index=res.page}else hMessage(res.msg)})}}),heysoo.controller("c_view",function($scope,$rootScope,$http,$stateParams){$scope.essay_view_tip_show=!1,$rootScope.reply_to_id=$rootScope.parent_cmt_id=null,url=home_path+"/Essay/ng_view.html?id="+$stateParams.id,progress_bar.start(),$http.get(url).success(function(res){0===res.error?($scope.essay=res.essay,$scope.comments=res.comments,$rootScope.essay_comments_tip_show=res.comments.length<1?!0:!1,$scope.essay_comment_on=res.essay_comment_on,$scope.avatar_path=public_path+"/img/me.jpg",$(document).scrollTop(0),setLightBox(),progress_bar.done()):($scope.essay=$scope.comments=[],$rootScope.essay_comments_tip_show=!0,$scope.essay_comment_on=!1,$scope.essay_view_tip="<i class='hs-icon-warning'></i> "+res.msg,$scope.essay_view_tip_show=!0,progress_bar.done())}),$scope.showEssayReplyCmtModal=function(reply_to_id,parent_cmt_id){$rootScope.reply_to_id=reply_to_id,$rootScope.parent_cmt_id=parent_cmt_id,$("#essay-comment-reply-modal").modal("toggle")}}),heysoo.controller("c_modify",function($scope,$rootScope,$state,$http){$scope.post_piece_check=!1;var url=home_path+"/Action/ng_modify.html";$http.get(url,{params:{type:$rootScope.type,id:$rootScope.id}}).success(function(res){0===res.error?(modify_editor.html(res.items.content),$scope.essay_title=res.items.title,$scope.essay_tag=res.items.tag,$scope.essay_visible=res.items.visible):hMessage(res.msg)}),$scope.postModify=function(){var content=modify_editor.html();$http({method:"POST",url:home_path+"/Action/ng_deal_modify.html",data:{type:$rootScope.type,id:$rootScope.id,content:content,title:$scope.essay_title,tag:$scope.essay_tag,visible:$scope.essay_visible,post_piece:$scope.post_piece_check}}).success(function(res){0===res.error?(modify_editor.html(""),hMessage(res.msg),window.history.go(-1)):hMessage(res.msg)})}}),heysoo.controller("c_essay_cmt",function($scope,$rootScope,$state,$http){$scope.postEssayCmt=function(essay_id){$("button.post-essay-comment-btn").html('<i class="hs-icon-spinner"></i> 发布中...'),essay_editor.sync();var content=$("#essay-comment-form").children("textarea[name='comment-content']").val();$http({method:"POST",url:home_path+"/Essay/post_comment.html",data:{essay_id:essay_id,comment_content:content}}).success(function(res){if(0===res.error){essay_editor.html(""),hMessage(res.msg),$("button.post-essay-comment-btn").html("发布评论");var html='<li class="hs-comment"><article class="hs-comment essay-comment"><a href=""><img class="hs-comment-avatar comment-user-avatar" src="'+$rootScope.avatar+'" alt=""/></a><div class="hs-comment-main"><header class="hs-comment-hd"><div class="hs-comment-meta"><a href="#link-to-user" class="hs-comment-author">'+res.comment.user+'</a> 评论于 <time datetime="">'+res.comment.date+'</time><span class="essay-comment-right" style="float:right;"><a href="javascript:;" ng-click="showEssayReplyCmtModal(res.user_id,res.comment_id)">回复</a></span></div></header><div class="hs-comment-bd">'+res.comment.content+"</div></div></article></li>";$("div.comment-tip").remove(),$rootScope.essay_comments_tip_show=!1,$("div.essay-comments").children("ul").prepend(html)}else hMessage(res.msg),$("button.post-essay-comment-btn").html("发布评论")})},$scope.replyEssayCmt=function(essay_id){$("button.reply-essay-comment-btn").html('<i class="hs-icon-spinner"></i> 发布中...'),essay_reply_editor.sync();var reply_content=$("#essay-reply-comment-form").children("textarea[name='reply-comment-content']").val();$http({method:"POST",url:home_path+"/Essay/essay_comment_reply.html",data:{essay_id:essay_id,replyTo_id:$rootScope.reply_to_id,parent_cmt_id:$rootScope.parent_cmt_id,reply_content:reply_content}}).success(function(res){if(0===res.error){essay_reply_editor.html(""),hMessage(res.msg),$("button.reply-essay-comment-btn").html("发布评论");var html='<li class="hs-comment"><article class="hs-comment essay-comment"><a href=""><img class="hs-comment-avatar comment-user-avatar" src="'+public_path+'/img/me.jpg" alt=""/></a><div class="hs-comment-main"><header class="hs-comment-hd"><div class="hs-comment-meta"><a href="#link-to-user" class="hs-comment-author">'+res.comment.user+'</a>评论于 <time datetime="">'+res.comment.date+'</time><span class="essay-comment-right" style="float:right;"><a href="javascript:;" ng-click="showEssayReplyCmtModal(res.user_id,res.comment_id)">回复</a></span></div></header><div class="hs-comment-bd">'+res.comment.content+"</div></div></article></li>";$("div.comment-tip").remove(),$rootScope.essay_comments_tip_show=!1,$("div.essay-comments").children("ul").prepend(html),$("#essay-comment-reply-modal").modal("toggle"),$state.reload(),window.location.hash="#essay-comment-lists"}else hMessage(res.msg),$("button.reply-essay-comment-btn").html("发布评论"),$("#essay-comment-reply-modal").modal("toggle")})}}),heysoo.controller("c_piece",function($scope,$state,Piece){$scope.deletePiece=function(piece_id){confirm("你确定要删除该碎片?")&&Piece["delete"](piece_id).success(function(res){0===res.error?($("#piece-"+piece_id).remove(),hMessage(res.msg)):hMessage(res.msg)})},$scope.piece_comments={},$scope.updateComment=function(piece_id){Piece.getPieceComments(piece_id).success(function(res){0===res.error?($scope.piece_comments=res.comments,$scope.piece_comment_tip="",$scope.piece_comment_tip_show=!1):($scope.piece_comment_tip_show=!0,$scope.piece_comment_tip='<i class="hs-icon hs-icon-warning"></i> '+res.msg)})},$scope.pieceCommentToggle=function(piece_id){"none"==$("#piece-comment-"+piece_id).css("display")&&($scope.piece_comments=[],$scope.piece_comment_tip_show=!0,$scope.piece_comment_tip='<i class="hs-icon hs-icon-spinner"></i> 正在获取评论...',$scope.updateComment(piece_id)),$("#piece-comment-"+piece_id).slideToggle()},$scope.postedComment={},$scope.postedComment.reply_to_id=null,$scope.postComment=function(piece_id,piece_user_id){return $scope.postedComment.comment_content?($scope.postedComment.piece_id=piece_id,$scope.postedComment.obj_id=piece_user_id,null!==$scope.postedComment.reply_to_id&&(void 0!==$scope.postedComment.comment_content.split(":")?$scope.postedComment.comment_content=$scope.postedComment.comment_content.split(":")[1]:$scope.postedComment.reply_to_id=null),console.log($scope.postedComment),void Piece.postComment($scope.postedComment).success(function(res){0===res.error?($scope.postedComment.comment_content="",$scope.postedComment.reply_to_id=null,$("button.post-piece-comment-btn").html("发 布"),$scope.updateComment(piece_id)):hMessage(res.msg)})):void hMessage("评论内容不能为空！")},$scope.replyComment=function(comment_user_id,comment_user_name){$scope.postedComment.comment_content="@"+comment_user_name+" : ",$scope.postedComment.reply_to_id=comment_user_id},$scope.deleteComment=function(piece_id,comment_id){confirm("确定删除该评论?")&&Piece.deleteComment(comment_id).success(function(res){0===res.error?$scope.updateComment(piece_id):hMessage(res.msg)})}}),heysoo.controller("c_message",function($scope,$state,$http){$scope.msg_tab="comment",$scope.msgSwitchTab=function(tab,id){$scope.msg_tab=tab;var msg_url=home_path+"/Message/get_msg_list.html?type="+tab+"&id="+id;$http.get(msg_url).success(function(res){0===res.error?($scope.msgs=res.items,$scope.senders=res.senders,$scope.msg_tip_show=res.items.length<1?!0:!1):$scope.msg_tip_show=!0}),$state.go("msg_"+tab)},$scope.deleteMsg=function(type,msg_id){if(confirm("你确定要删除？")){var url=home_path+"/Message/delete_msg.html";$http.get(url,{params:{type:type,msg_id:msg_id}}).success(function(res){0===res.error?($("#msg-"+type+"-"+msg_id).remove(),hMessage(res.msg)):hMessage(res.msg)})}}}),heysoo.controller("c_message_comment",function($scope,$rootScope,$http){$scope.show_piece_text="查看碎片",$scope.show_original_piece=!1,$scope.showPiece=function(){$scope.show_original_piece?($scope.show_original_piece=!1,$scope.show_piece_text="查看碎片"):($scope.show_original_piece=!0,$scope.show_piece_text="收起碎片")},$scope.showMsgDetail=function(msg_obj_type,msg_obj_id){if($scope.current_cmt=null,"essay"==msg_obj_type)var url=home_path+"/Comment/ng_get_essay_comment.html?cmt_id="+msg_obj_id;else if("piece"==msg_obj_type)var url=home_path+"/Comment/ng_get_piece_comment.html?cmt_id="+msg_obj_id;$http.get(url).success(function(res){0===res.error?($scope.current_cmt=res.comment,$("#msgDetailModal_"+msg_obj_type).modal("toggle")):hMessage(res.msg)})}}),heysoo.controller("c_follow",function($scope,$rootScope,$state,$http){$rootScope.follow_tip_show=$rootScope.follow_items.length<1?!0:!1,$scope.follow_tab="followed",$scope.followSwitchTab=function(tab){$scope.follow_tab=tab,$rootScope.follow_items=new Array(0);var url=home_path+"/User/get_follow_list.html?type="+tab;$http.get(url).success(function(res){0===res.error&&res.items.length>0?($rootScope.follow_items=res.items,$rootScope.follow_tip_show=!1):$rootScope.follow_tip_show=!0}),$state.go("follow_"+tab),$scope.remvoeFollow=function(type,follow_id){url=home_path+"/User/remove_follow.html",$http({method:"POST",url:url,data:{type:type,follow_id:follow_id}}).success(function(res){0===res.error?($("#"+follow_id).remove(),hMessage(res.msg)):hMessage(res.msg)})}}}),heysoo.controller("c_edit",function($scope,$state,$http){$scope.edit_visible="1",$scope.edit_type="piece",$scope.post_piece_check=!0,$scope.edit_song_key="",$scope.songs=new Array,$scope.song_search_tip_show=!1,$scope.song_search_tip="查询中...";var url=home_path+"/Action/ng_deal_post.html";$scope.editPost=function(){console.log($scope.post_piece_check),$scope.edit_content=edit_post.html(),$http({method:"POST",url:url,data:{title:$scope.edit_title,tag:$scope.edit_tag,type:$scope.edit_type,visible:$scope.edit_visible,content:$scope.edit_content,post_piece:$scope.post_piece_check}}).success(function(res){console.log(res),0===res.error?(hMessage(res.msg),edit_post.html(""),"essay"==$scope.edit_type?$state.go("view",{id:res.id}):$state.go("home")):hMessage(res.msg)})},$scope.searchSong=function(){$scope.songs=new Array,$url=home_path+"/Essay/song_search.html?s_key="+$scope.edit_song_key,$http.get($url).success(function(res){if(res.songs.length){$scope.songs=res.songs;var songs_num=res.songs.length;$scope.song_search_tip="共找到 "+songs_num+" 首相关歌曲",$scope.song_search_tip_show=!0}else $scope.song_search_tip_show=!0,$scope.song_search_tip="无相关歌曲"})},$scope.insertMusicBox=function(song_id){music_frame='<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=380 height=86 src="http://music.163.com/outchain/player?type=2&id='+song_id+'&auto=0&height=66"></iframe>',edit_post.appendHtml(music_frame),$("#edit_song_search_modal").modal("toggle")}}),heysoo.controller("c_setting",function($scope,$state,$http){$scope.settingSwitchTab=function(tab){$scope.setting_tab=tab,$state.go("setting_"+tab)}}),heysoo.controller("c_setting_profile",function($scope,$rootScope,$http,$state){$scope.invite_code=$rootScope.user_info.invite_code,$scope.modifyProfile=function(option){$("#setting_profile_modal_"+option).modal("toggle")},$scope.createInviteCode=function(){$http.get(home_path+"/User/create_invite_code.html").success(function(res){0===res.error?$scope.invite_code=res.invite_code:hMessage(res.msg)})}}),heysoo.controller("c_setting_interface",function($scope,$rootScope,$http,$state){$scope.modifyInterface=function(option){$("#setting_interface_modal_"+option).modal("toggle")}}),heysoo.controller("c_setting_profile_modal",function($scope,$rootScope,$http){$scope.new_username=$scope.new_signature="",$scope.modifyUserName=function(option){$("#setting_profile_modal_"+option).modal("toggle"),$http({method:"POST",url:home_path+"/User/modify_userName.html",data:{new_username:$scope.new_username}}).success(function(res){0===res.error?($rootScope.user_info.username=$scope.new_username,hMessage("用户名已成功修改为："+$scope.new_username)):hMessage(res.msg)})},$scope.modifySignature=function(option){$("#setting_profile_modal_"+option).modal("toggle"),$http({method:"POST",url:home_path+"/User/modify_signature.html",data:{new_signature:$scope.new_signature}}).success(function(res){0===res.error?($rootScope.user_info.signature=$scope.new_signature,hMessage("签名已成功修改为："+$scope.new_signature)):hMessage(res.msg)})}}),heysoo.controller("c_setting_interface_modal",function($scope,$http,$rootScope,ipCookie){$scope.interface_color="primary",$scope.interface_mainBg="bg_day",$scope.interface_sideBarBg="bg_sidebar_lake",$scope.modifyTheme=function(option){$("#setting_interface_modal_"+option).modal("toggle"),hMessage("主题定制中，请耐心等候...")},$scope.modifyColor=function(option){$("#setting_interface_modal_"+option).modal("toggle"),$http.get(home_path+"/User/modify_interface_color.html?interface_color="+$scope.interface_color).success(function(res){hMessage(res.msg)}),$rootScope.interface_color=$scope.interface_color,ipCookie("interface_color",$scope.interface_color)},$scope.modifySidebarBg=function(option){$http.get(home_path+"/User/modify_bg.html?type=sidebar&select="+$scope.interface_sideBarBg).success(function(res){0===res.error?($rootScope.sideBarBg=res.url,hMessage(res.msg)):hMessage(res.msg)}),$("#setting_interface_modal_"+option).modal("toggle")},$scope.modifyMainBg=function(option){$http.get(home_path+"/User/modify_bg.html?type=mainBg&select="+$scope.interface_mainBg).success(function(res){0===res.error?($rootScope.mainBg=res.url,hMessage(res.msg)):hMessage(res.msg)}),$("#setting_interface_modal_"+option).modal("toggle")}}),heysoo.controller("c_setting_privacy_modal",function($scope,$http){}),heysoo.controller("c_setting_push_modal",function($scope,$http){}),heysoo.controller("c_reset_passwd",function($scope,$http){$scope.old_passwd=$scope.new_passwd="",$scope.resetPasswd=function(){if(""===$scope.old_passwd||""===$scope.new_passwd)return void hMessage("密码不能为空！");if($scope.old_passwd===$scope.new_passwd)return void hMessage("新旧密码不能一样！");var url=home_path+"/User/reset_passwd.html";$http({method:"POST",url:url,data:{old_passwd:$scope.old_passwd,new_passwd:$scope.new_passwd}}).success(function(res){0===res.error?(hMessage(res.msg),setTimeout(function(){window.location.href=home_path+"/Action/logout.html"},2e3)):hMessage(res.msg)})}}),heysoo.controller("c_modify_avatar",function($scope,$rootScope,$http,$interval){$scope.selectAvatar=function(){document.getElementById("new_avatar").click()},$scope.new_avatar=null,$scope.uploadAvatarBtn="上传",$http.get(get_token_path+"?upload_type=avatar").success(function(res){$scope.upload_avatar_token=res.token}),$scope.uploadAvatar=function(){$http.get(get_token_path+"?upload_type=avatar").success(function(res){$scope.upload_avatar_token=res.token});var uploadable=!0,checkTime=200,imgFile=document.getElementById("new_avatar").files[0];if(null==imgFile)hMessage("请先选择图片！"),uploadable=!1;else{"image/jpeg"!=imgFile.type&&"image/jpg"!=imgFile.type&&"image/png"!=imgFile.type&&uploadable&&(hMessage("请选择正确的图片格式：jpeg,jpg,png！"),uploadable=!1);var imgSize=imgFile.size/1048576;imgSize>2&&uploadable&&(hMessage("上传图片请限制在2M以内！"),uploadable=!1)}if(uploadable){$(".upload-avatar-form").submit(),$scope.uploadAvatarBtn="上传中...";var stop=$interval(function(){if(void 0!=$(window.frames.upload_avatar_ifm.document).find("pre").html()){var callback=JSON.parse($(window.frames.upload_avatar_ifm.document).find("pre").html());if(0==callback.error){$rootScope.avatar=callback.url,$scope.uploadAvatarBtn="上传成功！",hMessage("上传成功！");var url=home_path+"/User/updateAvatar.html?new_avatar="+$rootScope.avatar;$http.get(url).success(function(res){$scope.uploadAvatarBtn="上传",console.log(0==res.error?"同步成功！":"同步失败！")})}else hMessage("头像修改失败，请稍后重试！");$(window.frames.upload_avatar_ifm.document).find("pre").html(""),$interval.cancel(stop)}},checkTime)}}}),heysoo.controller("c_setting_push",function($scope,$rootScope,$http){$rootScope.user_config.push_comment="1"==$rootScope.user_config.push_comment?!0:!1,$rootScope.user_config.push_at="1"==$rootScope.user_config.push_at?!0:!1,$rootScope.user_config.push_whisper="1"==$rootScope.user_config.push_whisper?!0:!1,$rootScope.user_config.push_notice="1"==$rootScope.user_config.push_notice?!0:!1,$scope.savePush=function(){$http({method:"POST",url:home_path+"/User/modify_push.html",data:{comment_on:$rootScope.user_config.push_comment?1:0,at_on:$rootScope.user_config.push_at?1:0,whisper_on:$rootScope.user_config.push_whisper?1:0,notice_on:$rootScope.user_config.push_notice?1:0}}).success(function(res){hMessage(0===res.error?res.msg:res.msg)})}}),heysoo.controller("c_setting_privacy",function($scope,$rootScope,$http){$rootScope.user_config.privacy_followable="1"==$rootScope.user_config.privacy_followable?!0:!1,$rootScope.user_config.privacy_visitable="1"==$rootScope.user_config.privacy_visitable?!0:!1,$rootScope.user_config.privacy_essay_comment="1"==$rootScope.user_config.privacy_essay_comment?!0:!1,$rootScope.user_config.privacy_piece_comment="1"==$rootScope.user_config.privacy_piece_comment?!0:!1,$scope.savePrivacy=function(){$http({method:"POST",url:home_path+"/User/modify_privacy.html",data:{followable:$rootScope.user_config.privacy_followable?1:0,visitable:$rootScope.user_config.privacy_visitable?1:0,essay_comment:$rootScope.user_config.privacy_essay_comment?1:0,piece_comment:$rootScope.user_config.privacy_piece_comment?1:0}}).success(function(res){hMessage(0===res.error?res.msg:res.msg)})}}),heysoo.controller("c_tag",function($scope,$rootScope,$state,$http){$rootScope.tag_tab="essay",$rootScope.tag_tip=!0,$http.get(home_path+"/User/get_user_tag.html?type=essay").success(function(res){0===res.error&&($rootScope.tag_items=res.items,res.items.length>0&&($rootScope.tag_tip=!1))}),$state.go("tag_essay"),$scope.tagSwitchTab=function(tab,id){$rootScope.tag_tab=tab,$http.get(home_path+"/User/get_user_tag.html?type="+tab).success(function(res){0===res.error&&($rootScope.tag_items=res.items,$rootScope.tag_tip=res.items.length>0?!1:!0)}),$state.go("tag_"+tab)},$scope.newTagModal=function(type){$("#tag_new_modal").modal("toggle")},$scope.newTag=function(type){$("#tag_new_modal").modal("toggle"),hMessage("创建成功！")},$scope.removeTag=function(tag_id){$("#tag_"+tag_id).remove(),hMessage("移除成功！")}}),heysoo.controller("c_tag_essay",function($scope,$rootScope,$http){}),heysoo.filter("trustHtml",function($sce){return function(input){return $sce.trustAsHtml(input)}}),heysoo.filter("subStr",function(){return function(input,limit){return input.replace(/<[^>]+>/g,"").substr(0,limit)}});