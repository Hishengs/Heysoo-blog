var heysoo=angular.module("Index",["ui.router","ipCookie","oc.lazyLoad","ngDialog"]),tpl_piece_url=public_path+"/templates/piece",tpl_essay_url=public_path+"/templates/essay",tpl_index_url=public_path+"/templates/Index",tpl_message_url=public_path+"/templates/message",tpl_tag_url=public_path+"/templates/tag",tpl_search_url=public_path+"/templates/search",tpl_setting_url=public_path+"/templates/setting",tpl_follow_url=public_path+"/templates/follow",tpl_action_url=public_path+"/templates/action",tpl_user_url=public_path+"/templates/user",tpl_todo_url=public_path+"/templates/todo",loaded_js=[];heysoo.config(["$locationProvider","$urlRouterProvider","$compileProvider","$controllerProvider","$filterProvider","$provide",function(e,t,o,s,r,n){e.html5Mode(!0),t.otherwise(""),o.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/),heysoo.register={controller:s.register,directive:o.directive,filter:r.register,factory:n.factory,service:n.service},heysoo.lazyLoad=function(e){return urls=angular.copy(e),["$ocLazyLoad",function(e){if(Array.isArray(urls))for(var t=0;t<urls.length;t++)urls[t]=public_path+urls[t];else urls=[public_path+urls];return e.load(urls)}]}}]),heysoo.config(["$httpProvider",function(e){e.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded;charset=utf-8",e.defaults.headers.common["Content-Type"]="application/x-www-form-urlencoded;charset=utf-8";var t=function(e){var o,s,r,n,i,a,l,c="";for(o in e)if(s=e[o],s instanceof Array)for(l=0;l<s.length;++l)i=s[l],r=o+"["+l+"]",a={},a[r]=i,c+=t(a)+"&";else if(s instanceof Object)for(n in s)i=s[n],r=o+"["+n+"]",a={},a[r]=i,c+=t(a)+"&";else void 0!==s&&null!==s&&(c+=encodeURIComponent(o)+"="+encodeURIComponent(s)+"&");return c.length?c.substr(0,c.length-1):c};e.defaults.transformRequest=[function(e){return angular.isObject(e)&&"[object File]"!==String(e)?t(e):e}]}]),heysoo.service("User",["$http",function(e){this.getUserConfig=function(){return e({method:"GET",url:home_path+"/User/ng_get_user_config.html"})},this.getUserInfo=function(t){return e({method:"GET",url:home_path+"/User/ng_get_user_info.html?user_id="+t})},this.getFollowInfo=function(t){return e({method:"GET",url:home_path+"/User/get_follow_info.html?user_id="+t})},this.addFollow=function(t){return e({method:"GET",url:home_path+"/User/follow.html?action=add&user_id="+t})},this.disFollow=function(t){return e({method:"GET",url:home_path+"/User/follow.html?action=dis&user_id="+t})},this.getPieces=function(t,o){return e({method:"POST",url:home_path+"/User/get_pieces.html",data:{user_id:t,page:o}})},this.getEssays=function(t,o){return e({method:"POST",url:home_path+"/User/get_essays.html",data:{user_id:t,page:o}})}}]),heysoo.service("Piece",["$http",function(e){this["delete"]=function(t){return e({method:"POST",url:home_path+"/Piece/delete.html",data:{piece_id:t}})},this.getPieceComments=function(t){return e({method:"GET",url:home_path+"/Piece/get_piece_comment.html?piece_id="+t})},this.postComment=function(t){return e({method:"POST",url:home_path+"/Piece/post_comment.html",data:t})},this.deleteComment=function(t){return e({method:"POST",url:home_path+"/Piece/delete_comment.html",data:{comment_id:t}})}}]),heysoo.service("Search",["$http",function(e){this.searchEssay=function(t){return e({method:"POST",url:home_path+"/Search/search_essay.html",data:{search_key:t}})},this.searchPiece=function(t){return e({method:"POST",url:home_path+"/Search/search_piece.html",data:{search_key:t}})},this.searchUser=function(t){return e({method:"POST",url:home_path+"/Search/search_user.html",data:{search_key:t}})}}]),heysoo.service("Music",["$http",function(e){this.search=function(t){return e({url:home_path+"/Essay/song_search.html?s_key="+t,method:"GET"})}}]),heysoo.config(["$stateProvider",function(e){e.state("home",{url:"/",controller:"c_piece",views:{content:{templateUrl:tpl_index_url+"/index.html"}},resolve:{deps:["$ocLazyLoad",function(e){return e.load([public_path+"/js/angular/controller/piece.js"])}]}}).state("index",{url:"/index",controller:"c_piece",views:{content:{templateUrl:tpl_index_url+"/index.html"}},resolve:{deps:["$ocLazyLoad",function(e){return e.load([public_path+"/js/angular/controller/piece.js"])}]}})}]),heysoo.config(["$stateProvider",function(e){e.state("edit",{url:"/edit/:type/:action",views:{content:{templateUrl:tpl_essay_url+"/edit.html"}},resolve:{deps:["$ocLazyLoad",function(e){return e.load([public_path+"/js/angular/controller/publish.js"])}]}}).state("essay",{url:"/essay/page/:page",views:{content:{templateUrl:tpl_essay_url+"/index.html"}},resolve:{deps:["$ocLazyLoad",function(e){return e.load([public_path+"/js/angular/controller/essay.js"])}]}}).state("view",{url:"/view/:id",params:{id:null},controller:"c_view",views:{content:{templateUrl:tpl_essay_url+"/view.html"}},resolve:{deps:["$ocLazyLoad",function(e){return e.load([public_path+"/js/angular/controller/essay.js"])}]}}).state("setting_profile_userName",{url:"/modifyUserName",views:{mask:{templateUrl:tpl_action_url+"/setting/modifyUserName.html"}}}).state("modify",{url:"/edit/:type/:action/:id",views:{content:{templateUrl:tpl_essay_url+"/edit.html"}},resolve:{deps:["$ocLazyLoad",function(e){return e.load([public_path+"/js/angular/controller/publish.js"])}]}})}]),heysoo.config(["$stateProvider",function(e){e.state("piece",{url:"/piece/page/:page",views:{content:{templateUrl:tpl_piece_url+"/index.html"}}}).state("comment",{url:"/comment/:id",views:{mask:{templateUrl:tpl_piece_url+"/comment.html"}}})}]),heysoo.config(["$stateProvider",function(e){e.state("message",{url:"/message",views:{content:{templateUrl:tpl_message_url+"/message.html"}},resolve:{deps:["$ocLazyLoad",function(e){return e.load([public_path+"/js/angular/controller/message.js"])}]}}).state("msg_comment",{url:"/comment",parent:"message",views:{message:{templateUrl:tpl_message_url+"/comment.html"}},resolve:{deps:["$ocLazyLoad",function(e){return e.load([public_path+"/js/angular/controller/message.js"])}]}}).state("msg_at",{url:"/at",parent:"message",views:{message:{templateUrl:tpl_message_url+"/at.html"}}}).state("msg_whisper",{url:"/whisper",parent:"message",views:{message:{templateUrl:tpl_message_url+"/whisper.html"}}}).state("msg_notice",{url:"/notice",parent:"message",views:{message:{templateUrl:tpl_message_url+"/notice.html"}}})}]),heysoo.config(["$stateProvider",function(e){e.state("follow",{url:"/follow",views:{content:{templateUrl:tpl_follow_url+"/follow.html"}},resolve:{deps:["$ocLazyLoad",function(e){return e.load([public_path+"/js/angular/controller/follow.js"])}]}}).state("follow_followed",{url:"/followed",parent:"follow",views:{follow:{templateUrl:tpl_follow_url+"/followed.html"}}}).state("follow_following",{url:"/following",parent:"follow",views:{follow:{templateUrl:tpl_follow_url+"/following.html"}}})}]),heysoo.config(["$stateProvider",function(e){e.state("setting",{url:"/setting",views:{content:{templateUrl:tpl_setting_url+"/setting.html"}},resolve:{deps:["$ocLazyLoad",function(e){return e.load([public_path+"/js/angular/controller/setting.js"])}]}}).state("setting_profile",{url:"/profile",parent:"setting",views:{v_setting:{templateUrl:tpl_setting_url+"/profile.html"}}}).state("setting_interface",{url:"/interface",parent:"setting",views:{v_setting:{templateUrl:tpl_setting_url+"/interface.html"}}}).state("setting_push",{url:"/push",parent:"setting",views:{v_setting:{templateUrl:tpl_setting_url+"/push.html"}}}).state("setting_privacy",{url:"/privacy",parent:"setting",views:{v_setting:{templateUrl:tpl_setting_url+"/privacy.html"}}})}]),heysoo.config(["$stateProvider",function(e){e.state("tag",{url:"/tag",views:{content:{templateUrl:tpl_tag_url+"/tag.html"}},resolve:{deps:["$ocLazyLoad",function(e){return e.load([public_path+"/js/angular/controller/tag.js"])}]}}).state("tag_essay",{url:"/essay",parent:"tag",views:{tag:{templateUrl:tpl_tag_url+"/essay_tag.html"}}}).state("tag_piece",{url:"/piece",parent:"tag",views:{tag:{templateUrl:tpl_tag_url+"/piece_tag.html"}}}).state("tag_friend",{url:"/friend",parent:"tag",views:{tag:{templateUrl:tpl_tag_url+"/friend_tag.html"}}})}]),heysoo.config(["$stateProvider",function(e){e.state("search",{url:"/search",views:{content:{templateUrl:tpl_search_url+"/search.html"}},resolve:{deps:["$ocLazyLoad",function(e){return e.load([public_path+"/js/angular/controller/search.js"])}]}})}]),heysoo.config(["$stateProvider",function(e){e.state("user",{url:"/user/:user_id",views:{content:{templateUrl:tpl_user_url+"/user.html"}},resolve:{deps:["$ocLazyLoad",function(e){return e.load([public_path+"/js/angular/controller/user.js"])}]}})}]),heysoo.config(["$stateProvider",function(e){e.state("todo",{url:"/todo",views:{content:{templateUrl:tpl_todo_url+"/index.html"}},resolve:{deps:["$ocLazyLoad",function(e){return e.load([public_path+"/js/angular/controller/todo.js"])}]}})}]),heysoo.filter("trustHtml",["$sce",function(e){return function(t){return e.trustAsHtml(t)}}]),heysoo.filter("subStr",[function(){return function(e,t){return e.replace(/<[^>]+>/g,"").replace(/&gt;/g,"").replace(/&lt;/g,"").replace(/&nbsp;/g,"").substr(0,t)}}]),heysoo.filter("addStr",[function(){return function(e,t){return e+t}}]),heysoo.filter("highLight",[function(){return function(input,key){var pattern=eval("/("+key+")/gi");return input.replace(pattern,'<em class="search-highlight">$1</em>')}}]),heysoo.filter("transferPostDate",[function(){return function(e){var t=new Date(e);if("Invalid Date"!==t.toString()){var o=new Date;if(o.getYear()==t.getYear()&&o.getMonth()==t.getMonth()){if(o.getDate()==t.getDate()){if(o.getHours()==t.getHours()){var s=o.getMinutes()-t.getMinutes();return 0>=s?" 刚刚":s+" 分钟前"}return o.getHours()-t.getHours()+" 小时前"}return o.getDate()-t.getDate()+" 天前"}return e}return e}}]),heysoo.filter("imgView",[function(){return function(e,t){var o=/<img.*?(?:>|\/>)/gi;if(1==t){var s=e.match(o);if(null!==s){for(var r=0;r<s.length;r++){var n=s[r].match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i);console.log(n),n?s[r]='<div class="img-wrapper" style="background-image:url(\''+n[1]+"');background-repeat:no-repeat;width:80px;height:80px;\"></div>":s[r]="",console.log(s[r])}return s.join("")}return""}var s=e.match(o);return null!==s?s.join("<br/>"):""}}]);var paginator_index=1,num_per_page=10,url_prefix=home_path+"/Action/ng_paginator.html",progress_bar;heysoo.controller("c_index",["$scope","$rootScope","$state","$stateParams","$http","$timeout","Piece","ipCookie","User","$ocLazyLoad",function(e,t,o,s,r,n,i,a,l,c){t.$on("$locationChangeStart",function(e){if(!a("fingerprint")){console.log(arguments);var t=/\/(view|user)\/[\d]+/i,o=/\/Action\/register\.html/i;t.test(arguments[1])?o.test(arguments[1])&&redirect("register"):redirect("login")}}),t.mask_show=!1,t.style={},e.index_empty=!1,t.state_history=[],l.getUserConfig().success(function(e){0===e.error?(t.user_config=e.user_config,t.interface_color=e.user_config.interface_color?e.user_config.interface_color:a("interface_color"),t.mainBg=e.user_config.main_bg,t.sideBarBg=e.user_config.sidebar_bg,t.style.sidebar_bg={"background-image":"url("+t.sideBarBg+"?imageView2/2/w/400)"},t.style.main_bg={"background-image":"url("+t.mainBg+")"}):hMessage(e.msg)}),o.go("index"),e.updateHomePageContent=function(){r.get(home_path+"/Index/ng_index.html").success(function(o){console.log(o),0==o.error?(t.items=o.pieces,t.items.length<=0?e.index_empty=!0:e.index_empty=!1,e.index_page=2):hMessage(o.msg)}).error(function(e,t,o,s){console.log(e),console.log(s)})},e.updateHomePageContent(),e.indexLoadMore=function(){$("a.index-load-more").html('<i class="hs-icon-spinner"></i> 加载中...'),r.get(home_path+"/Index/ng_index.html?index_page="+e.index_page).success(function(t){if(0===t.error){if(!t.pieces.length)return void $("a.index-load-more").html('<i class="hs-icon-warning"></i> 没有更多了！');for(var o=0;o<t.pieces.length;o++)e.items.push(t.pieces[o]);e.index_page++,$("a.index-load-more").html('<i class="hs-icon-arrow-down"></i> 加载更多')}else hMessage(t.msg),$("a.index-load-more").html('<i class="hs-icon-arrow-down"></i> 加载更多')})},e.showPublish=function(){e.edit_post_path=home_path+"/Action/deal_post.html",o.go("edit")},e.getViewPage=function(e){o.go("view",{id:e})},e.deleteItem=function(e,t){if(confirm("你确定要删除？")){var o=home_path+"/Action/ng_delete.html";r.get(o,{params:{type:e,id:t}}).success(function(e){0===e.error?($("#"+t).remove(),hMessage(e.msg)):hMessage(e.msg)})}},e.modify=function(e,t){o.go("modify",{type:e,id:t,action:"update"})},e.showMessage=function(){progress_bar.start(),e.msg_tip_show=!1;var s=home_path+"/Message/get_msg_list.html";r.get(s).success(function(o){0===o.error?(e.msgs=o.items,e.senders=o.senders,o.items.length<1?e.msg_tip_show=!0:e.msg_tip_show=!1):e.msg_tip_show=!0,progress_bar.done(),t.unread_msg_num=""}),o.go("message"),o.go("msg_comment")},e.showTag=function(){o.go("tag")},e.showSetting=function(){e.setting_tab="profile",e.origin_user_avatar_path="FgW07muueXq9EI9OIdezcY5ODe4f",o.go("setting"),o.go("setting_profile")},e.showSearch=function(){o.go("search")},e.showFollow=function(){t.follow_items=new Array(0),o.go("follow");var e=home_path+"/User/get_follow_list.html?type=followed";r.get(e).success(function(e){0===e.error&&e.items.length>0?(t.follow_items=e.items,t.follow_tip_show=!1):t.follow_tip_show=!0}),o.go("follow_followed")},t.viewUser=function(e){var t=home_path+"/User/index.html?user="+e;window.open(t)},e.switchState=function(e,t){dependencies=t.split(",");var s=[];if(Array.isArray(dependencies))for(var r=0;r<dependencies.length;r++)loaded_js.indexOf(dependencies[r])<0&&(loaded_js.push(dependencies[r]),s.push(public_path+dependencies[r]));else loaded_js.indexOf(dependencies)<0?(loaded_js.push(dependencies),s.push(public_path+dependencies[r])):s=[];s.length?c.load(s).then(function(){o.go(e.name,e.params)},function(e){}):o.go(e.name,e.params)},t.$on("updateHomePageContent",function(t,o){e.updateHomePageContent()}),c.load([public_path+"/editor/meditor/js/editormd.min.js",public_path+"/js/to-markdown.min.js",public_path+"/editor/meditor/css/editormd.min.css",public_path+"/bower/ng-dialog/css/ngDialog.css",public_path+"/bower/amazeui/dist/js/amazeui.min.js"]).then(function(){updateAmazeUIEvent(),console.log("成功延迟加载所需文件！"),progress_bar=$.AMUI.progress},function(e){})}]).controller("c_paginator",["$scope","$rootScope","$state","$http",function(e,t,o,s){e.paginator=function(e,r){if("prev"===r){if(1===paginator_index)return void hMessage("当前已是第一页");url=url_prefix+"?type="+e+"&page="+parseInt(paginator_index-1)}else if("next"===r)url=url_prefix+"?type="+e+"&page="+parseInt(paginator_index+1);else{if(console.log(r),parseInt(r)===paginator_index)return;url=url_prefix+"?type="+e+"&page="+parseInt(r)}console.log(url),s.get(url).success(function(s){if(console.log(s),0===s.error){if(s.items.length<1)return void hMessage("当前已是最后一页！");t.items=s.items,o.go(e,{page:s.page}),$(document).scrollTop(0),paginator_index=s.page,t.paginator_pages=[];for(var r=0;r<s.count/num_per_page;r++)t.paginator_pages[r]={id:parseInt(r+1),name:"第 "+parseInt(r+1)+" 页"};console.log(t.paginator_pages)}else hMessage(s.msg)})}}]).controller("c_sidePanel",["$http","$rootScope","$scope",function(e,t,o){var s=home_path+"/Index/ng_init_side_panel.html";e.get(s).success(function(e){0===e.error&&(t.avatar=e.user.avatar,t.user_info=e.user,t.essay_nums=e.essay_nums,t.piece_nums=e.piece_nums,t.diary_nums=e.diary_nums,t.unread_msg_num=e.unread_msg_num)}),t.device=isMobile(),window.onresize=function(){t.device=isMobile()};var r=6e4;setInterval(function(){var o=home_path+"/Message/ng_get_unread_msg_num.html";e.get(o).success(function(e){e.unread_msg_num<1||t.unread_msg_num===e.unread_msg_num?r-=1e3:r+=1e3,r=3e4>r?6e4:r,t.unread_msg_num=e.unread_msg_num})},r),t.togglePublisher=function(){window.piece_editor=editormd("piece-editor",piece_editor_opt),$("#publisher").slideToggle()}}]).controller("c_piece_publisher",["$scope","$rootScope","$state","$http","Music","$ocLazyLoad","ngDialog",function(e,t,o,s,r,n,i){e.edit_song_key="",e.post={visible:"1",visible_tag:"",tag:"",content:"",is_capsule:!1,capsule_days:1},e.selected_tags="",e.post.visible_tag="",e.setPieceVisible=function(t){e.post.visible=t+""},e.setTimeCapsule=function(t){e.post.is_capsule=!e.post.is_capsule,e.post.capsule_days=e.post.capsule_days>=1?e.post.capsule_days:1},e.searchSong=function(){return isEmpty(e.edit_song_key)?void hMessage("输入不能为空！"):(t.song_search_tip="查询中...",t.current_editor=window.piece_editor,t.search_songs=new Array,void r.search(e.edit_song_key).success(function(e){if(e.songs.length){t.search_songs=e.songs;var o=e.songs.length;t.song_search_tip="共找到 "+o+" 首相关歌曲",t.song_search_tip_show=!0}else t.song_search_tip_show=!0,t.song_search_tip="无相关歌曲"}))},e.postPiece=function(){var o=angular.copy(e.post);o.content=window.piece_editor.getHTML(),console.log(o),s({method:"POST",url:home_path+"/Piece/post.html",data:o}).success(function(o){console.log(o),0===o.error?(hMessage(o.msg),window.piece_editor.setValue(""),t.togglePublisher(),e.post={visible:"1",visible_tag:"",tag:"",content:"",is_capsule:!1,capsule_days:1},t.$emit("updateHomePageContent",{})):hMessage(o.msg)})},e.editVisible=function(){switch(e.post.visible){case"0":visible_type="仅自己可见";break;case"2":visible_type="选中可见";break;case"3":visible_type="选中不可见";break;case"1":default:visible_type="公开"}n.load([public_path+"/js/angular/controller/dialog/visible/SelectVisibleTagController.js"]).then(function(){i.openConfirm({template:public_path+"/templates/dialog/visible/index.html",className:"ngdialog-theme-default",controller:"SelectVisibleTagController",preCloseCallback:function(){return!0},closeByDocument:!1,closeByEscape:!1,showClose:!1,scope:e,appendTo:"#publisher",resolve:{params:function(){return{dialog_title:"选择可见性",visible_type:visible_type}}}}).then(function(e){},function(e){})},function(e){})},e.$watch("post.visible",function(t,o,s){2==t||3==t?e.editVisible():(e.selected_tags="",e.post.visible_tag="")}),e.$on("visibleDialogReturn",function(t,o){console.log(o),"cancel"==o.action?(e.post.visible="1",e.selected_tags="",e.post.visible_tag=""):"confirm"==o.action&&(e.post.visible_tag=_.pluck(o.selected_tags,"id").toString(),e.selected_tags="#"+_.pluck(o.selected_tags,"name").join("#"))})}]).controller("c_song_search",["$scope","$rootScope",function(e,t){e.insertMusicBox=function(e){music_frame='<iframe class="netease-music" frameborder="no" border="0" marginwidth="0" marginheight="0" min-width='+music_player_width+' height=86 src="http://music.163.com/outchain/player?type=2&id='+e+'&auto=0&height=66"></iframe>',t.current_editor.insertValue?t.current_editor.insertValue(music_frame):t.current_editor.appendHtml(music_frame),$("#song_search_modal").modal("toggle")}}]),angular.bootstrap(document.body,["Index"]);