var paginator_index = 1;
var num_per_page = 10;
var url_prefix = home_path+"/Action/ng_paginator.html";
heysoo.controller('c_index',['$scope','$rootScope','$state','$stateParams','$http','$timeout','Piece','ipCookie','User','$ocLazyLoad',
    function($scope,$rootScope,$state,$stateParams,$http,$timeout,Piece,ipCookie,User,$ocLazyLoad){
    //前端路由的统一管理
    $rootScope.$on('$locationChangeStart', function(event){
        if(!ipCookie('fingerprint')){
          //如果未登录，除了注册登陆不允许跳转到别的地方
          console.log(arguments);
          var pattern1 = /\/(view|user)\/[\d]+/i;
          var pattern2 = /\/Action\/register\.html/i;
          if(!pattern1.test(arguments[1])){
            redirect('login');
          }else if(pattern2.test(arguments[1])){
            redirect('register');
          }
        }
    });
    $rootScope.mask_show = false;
    $rootScope.style = {};
    $scope.index_empty = false;
    //------------- 记录状态变化历史 -------------
    $rootScope.state_history = [];
    //------------- 获取用户配置 -------------
    User.getUserConfig().success(function(res){
      if(res.error === 0){
        $rootScope.user_config = res.user_config;
        $rootScope.interface_color = res.user_config.interface_color?res.user_config.interface_color:ipCookie('interface_color');//主题颜色
        $rootScope.mainBg = res.user_config.main_bg;//主页背景
        $rootScope.sideBarBg = res.user_config.sidebar_bg; //边栏背景
        $rootScope.style.sidebar_bg = {'background-image': 'url('+$rootScope.sideBarBg+'?imageView2/2/w/400)'};
        $rootScope.style.main_bg = {'background-image': 'url('+$rootScope.mainBg+')'};
      }else hMessage(res.msg);
    });
    $state.go('index');
    //------------- 更新首页内容 -------------
    $scope.updateHomePageContent = function(){
        $http.get(home_path+"/Index/ng_index.html").success(function(res){
            console.log(res);
            if(res.error == 0){
                $rootScope.items = res.pieces;
                if($rootScope.items.length <= 0)$scope.index_empty = true;
                else $scope.index_empty = false;
                $scope.index_page = 2;
            }else hMessage(res.msg);
        }).error(function(data,header,config,status){
            console.log(data);
            console.log(status);
        });
    }
    $scope.updateHomePageContent();
    //------------- 首頁加載更多按鈕 -------------
    $scope.indexLoadMore = function(){
      $('a.index-load-more').html('<i class="hs-icon-spinner"></i> 加载中...');
      $http.get(home_path+"/Index/ng_index.html?index_page="+$scope.index_page).success(function(res){
        if(res.error === 0){
          if(!res.pieces.length){$('a.index-load-more').html('<i class="hs-icon-warning"></i> 没有更多了！');return;}
          for (var i = 0; i < res.pieces.length; i++) {
              $scope.items.push(res.pieces[i]);
          }
          $scope.index_page++;
          $('a.index-load-more').html('<i class="hs-icon-arrow-down"></i> 加载更多');
        }else {
          hMessage(res.msg);
          $('a.index-load-more').html('<i class="hs-icon-arrow-down"></i> 加载更多');
        }
      });
    }
    //------------- 发布 -------------
    $scope.showPublish = function(){
      $scope.edit_post_path = home_path+"/Action/deal_post.html";
      $state.go('edit');
    }
    //------------- 文章详情页 -------------
    $scope.getViewPage = function(id){
      $state.go('view',{id:id});
      /*url = home_path+"/Essay/ng_view.html?id="+id;
      progress_bar.start();
      $http.get(url).success(function(res){
            $scope.essay = res.essay;
            $scope.comments = res.comments;
            if(res.comments.length < 1)$rootScope.essay_comments_tip_show = true;
            else $rootScope.essay_comments_tip_show = false;
            $scope.essay_comment_on = res.essay_comment_on;
            $scope.avatar_path = public_path+"/img/me.jpg";
            $state.go('view',{id:id});
            $(document).scrollTop(0);
            setLightBox();
            progress_bar.done();
      });*/
    }
    //------------- 删除 -------------
    $scope.deleteItem = function(type,id){
      if(confirm('你确定要删除？')){
        var url = home_path+"/Action/ng_delete.html";
          $http.get(url,{params:{'type':type,'id':id}}).success(function(res){
              if(res.error === 0){
                $("#"+id).remove();
                hMessage(res.msg);
              }else{hMessage(res.msg);}
          });
      }
    }
    //------------- 修改 -------------
    $scope.modify = function(type,id){
      //$rootScope.type = type;
      //$rootScope.id = id;
      $state.go('modify',{type:type,id:id,action:'update'});
    }
    //------------- 消息面板 -------------
    $scope.showMessage = function(){
      progress_bar.start();
      $scope.msg_tip_show = false;
      var msg_url = home_path+"/Message/get_msg_list.html";
      $http.get(msg_url).success(function(res){
        if(res.error === 0){
           $scope.msgs = res.items;
           $scope.senders = res.senders;
           if(res.items.length < 1)$scope.msg_tip_show = true;
           else $scope.msg_tip_show = false;
         }else{$scope.msg_tip_show = true;}
         progress_bar.done();
         $rootScope.unread_msg_num = '';
      });
      $state.go('message');
      $state.go('msg_comment');
    }
    //------------- 标签面板 -------------
    $scope.showTag = function(){
      $state.go('tag');
    }
    //------------- 设置面板 -------------
    $scope.showSetting = function(){
      $scope.setting_tab = 'profile';
      /*var url = home_path+"/User/ng_get_user_info.html";
      $http.get(url).success(function(res){
        $scope.user_info = res.items;
      });*/
      $scope.origin_user_avatar_path = "FgW07muueXq9EI9OIdezcY5ODe4f";
      $state.go('setting');
      $state.go('setting_profile');
    }
    //------------- 搜索面板 -------------
    $scope.showSearch = function(){
      $state.go('search');
    }
    //------------- 好友 -------------
    $scope.showFollow = function(){
      $rootScope.follow_items = new Array(0);
      $state.go('follow');
      var url = home_path+"/User/get_follow_list.html?type=followed";
      $http.get(url).success(function(res){
        if(res.error === 0 && res.items.length > 0){
          $rootScope.follow_items = res.items;
          $rootScope.follow_tip_show = false;
        }else $rootScope.follow_tip_show = true;
      });
      $state.go("follow_followed");
    }
    //------------- 查看用户主页 -------------
    $rootScope.viewUser = function(userName){
      var url = home_path+"/User/index.html?user="+userName;
      window.open(url);
    }
    //---------------- 切换状态 -------------
    $scope.switchState = function(state,controller){
        dependencies = controller.split(',');
        var urls = [];
        if(Array.isArray(dependencies)){
            for(var i=0;i<dependencies.length;i++){
                if(loaded_js.indexOf(dependencies[i]) < 0){loaded_js.push(dependencies[i]);urls.push(public_path + dependencies[i]);}
            }
        }else {
            if(loaded_js.indexOf(dependencies) < 0){
                loaded_js.push(dependencies);
                urls.push(public_path + dependencies[i]);
            }else urls = [];
        }
        if(urls.length)
            $ocLazyLoad.load(urls).then(function () {
                $state.go(state.name,state.params);
            }, function (e){});
        else $state.go(state.name,state.params);
    }
    //------------ 监听更新首页内容 ----------------
    $rootScope.$on('updateHomePageContent',function(event,mass){
        $scope.updateHomePageContent();
    });
    //------------ 延迟加载其他文件 -----------------
    $ocLazyLoad.load([public_path+'/editor/meditor/js/editormd.min.js',
      public_path+'/js/to-markdown.min.js',
      public_path+'/editor/meditor/css/editormd.min.css',
      public_path+'/bower/ng-dialog/css/ngDialog.css',
      public_path+'/bower/amazeui/dist/js/amazeui.min.js']).then(function () {
        console.log('成功延迟加载所需文件！');
        var progress_bar = $.AMUI.progress;//全局进度条，依赖amazeui.min.js
    }, function (e){});
}])
//管理分頁
.controller('c_paginator',['$scope','$rootScope','$state','$http',function($scope,$rootScope,$state,$http){
    $scope.paginator = function(type,action){
        if(action === 'prev'){//前一页
            if(paginator_index === 1){hMessage('当前已是第一页');return;}
            url = url_prefix+"?type="+type+"&page="+parseInt(paginator_index-1);
        }else if(action === 'next'){//后一页
            url = url_prefix+"?type="+type+"&page="+parseInt(paginator_index+1);
        }else{//任意页
            console.log(action);
            if(parseInt(action) === paginator_index)return;//如果选择的页数正是当前页数，则忽略
            url = url_prefix+"?type="+type+"&page="+parseInt(action);
        }
        console.log(url);
        $http.get(url).success(function(res){
            console.log(res);
            if(res.error === 0){
                if(res.items.length < 1){hMessage('当前已是最后一页！');return;}
                $rootScope.items = res.items;
                $state.go(type,{page:res.page});
                $(document).scrollTop(0);
                paginator_index = res.page;
                $rootScope.paginator_pages = [];
                for (var i = 0; i < res.count/num_per_page; i++) {
                    $rootScope.paginator_pages[i] = {'id':parseInt(i+1),'name':"第 "+parseInt(i+1)+" 页"}
                }
                console.log($rootScope.paginator_pages);
            }else{
                hMessage(res.msg);
            }
        });
    }
}])
//边栏管理
.controller('c_sidePanel',['$http','$rootScope','$scope',function($http,$rootScope,$scope){
  var url = home_path+"/Index/ng_init_side_panel.html";
  $http.get(url).success(function(res){
    if(res.error === 0){
      $rootScope.avatar = res.user.avatar;
      $rootScope.user_info = res.user;
      $rootScope.essay_nums = res.essay_nums;
      $rootScope.piece_nums = res.piece_nums;
      $rootScope.diary_nums = res.diary_nums;
      $rootScope.unread_msg_num = res.unread_msg_num;
    }
  });
  //检测是否是移动设备
  $rootScope.device = isMobile();
  //监听窗口大小变化
  window.onresize = function(){
    $rootScope.device = isMobile();
  }
  //设置定时器，定时获取未读消息数目#每1分钟
  var timer = 60000;
  setInterval(function(){
    var url = home_path+"/Message/ng_get_unread_msg_num.html";
    $http.get(url).success(function(res){
      if(res.unread_msg_num < 1 || $rootScope.unread_msg_num === res.unread_msg_num)timer -= 1000;//若没有新消息或者新消息条目没变化，则加快读取
      else timer += 1000;//若有新消息，则延缓读取
      timer = timer<30000?60000:timer;//如果timer小于一半，则重置timer
      $rootScope.unread_msg_num = res.unread_msg_num;
    });
  },timer);
  //显示发布器
  $rootScope.togglePublisher = function(){
    //动态创建一个编辑器
    window.piece_editor = editormd("piece-editor", piece_editor_opt);
    $('#publisher').slideToggle();
  }
}])
.controller('c_piece_publisher',['$scope','$rootScope','$state','$http','Music','$ocLazyLoad','ngDialog',
    function($scope,$rootScope,$state,$http,Music,$ocLazyLoad,ngDialog){
    $scope.edit_song_key = '';
    $scope.post = {
        visible:'1',
        visible_tag:'',
        tag:'',
        content:'',
        is_capsule:false,
        capsule_days:1
    };
    $scope.selected_tags = '';
    $scope.post.visible_tag = '';
    //设置可见性
    $scope.setPieceVisible = function(visible){
      $scope.post.visible = visible+'';
    }
    //设置为时光胶囊
    $scope.setTimeCapsule = function(visible){
      $scope.post.is_capsule = !$scope.post.is_capsule;
      $scope.post.capsule_days = $scope.post.capsule_days>=1?$scope.post.capsule_days:1;
    }
    //查找音乐
    $scope.searchSong = function(){
      if(isEmpty($scope.edit_song_key)){hMessage("输入不能为空！");return;}
      $rootScope.song_search_tip = '查询中...';
      $rootScope.current_editor = window.piece_editor;
      $rootScope.search_songs = new Array();
      Music.search($scope.edit_song_key).success(function(res){
        if(res.songs.length){
          $rootScope.search_songs = res.songs;
          var songs_num = res.songs.length;
          $rootScope.song_search_tip = '共找到 '+ songs_num +' 首相关歌曲';
          $rootScope.song_search_tip_show = true;
        }
        else {$rootScope.song_search_tip_show = true;$rootScope.song_search_tip = '无相关歌曲';}
      });
    }
    $scope.postPiece = function(){
        var data = angular.copy($scope.post);
        data.content = window.piece_editor.getHTML();//获取markdown编辑器的html
        console.log(data);
        $http({
            method:'POST',
            url:home_path+"/Piece/post.html",
            data:data
        }).success(function(res){
            console.log(res);
            if(res.error === 0){
                hMessage(res.msg);
                //重置编辑器状态
                window.piece_editor.setValue('');//将编辑器内容置空
                $rootScope.togglePublisher();
                $scope.post = {
                    visible:'1',
                    visible_tag:'',
                    tag:'',
                    content:'',
                    is_capsule:false,
                    capsule_days:1
                };
                //向首页发送广播更新内容
                $rootScope.$emit('updateHomePageContent',{});
            }else{hMessage(res.msg);}
        });
    }
    //-------------- 编辑可见性 --------------
    $scope.editVisible = function(){
        switch($scope.post.visible){
            case '0':
                visible_type = '仅自己可见';
                break;
            case '2':
                visible_type = '选中可见';
                break;
            case '3':
                visible_type = '选中不可见';
                break;
            case '1':
            default:
                visible_type = '公开';
                break;
        }
        $ocLazyLoad.load([public_path+'/js/angular/controller/dialog/visible/SelectVisibleTagController.js']).then(function(){
            ngDialog.openConfirm({
                template: public_path+'/templates/dialog/visible/index.html',
                className: 'ngdialog-theme-default', //弹窗的类名
                controller : 'SelectVisibleTagController',
                preCloseCallback: function(){ //关闭前的触发事件
                    //return confirm('你确定要退出吗？');
                    return true;
                },
                closeByDocument: false, //点击背景关闭弹窗
                closeByEscape: false, //通过键盘Esc按钮关闭弹窗
                showClose: false, //显示关闭按钮
                scope: $scope,
                appendTo: '#publisher', //绑定到哪个元素节点
                resolve: { //将所需参数传递给弹窗的控制器
                    params : function(){
                        return {
                            dialog_title : '选择可见性',
                            visible_type:visible_type
                        };
                    }
                }
            }).then(function (value) {
            }, function (reason) {
            });
        }, function(e){
        });
    }
    //-------------- 监听可见性选项变化 --------------
    $scope.$watch('post.visible',function(newValue,oldValue,scope){
        if(newValue == 2 || newValue == 3)$scope.editVisible();
        else {$scope.selected_tags = '';$scope.post.visible_tag = '';}
    });
    //--------------- 监听可见性弹窗返回结果 -------------
    $scope.$on('visibleDialogReturn',function(event,mass){
        console.log(mass);
        if(mass.action == 'cancel'){
            $scope.post.visible = '1';
            $scope.selected_tags = '';
            $scope.post.visible_tag = '';
        }else if(mass.action == 'confirm'){
            $scope.post.visible_tag = _.pluck(mass.selected_tags,'id').toString();
            $scope.selected_tags = '#'+_.pluck(mass.selected_tags,'name').join('#');
        }
    });
}])
.controller('c_song_search',['$scope','$rootScope',function($scope,$rootScope){
  //往编辑器插入音乐
  $scope.insertMusicBox = function(song_id){
    music_frame = '<iframe class="netease-music" frameborder="no" border="0" marginwidth="0" marginheight="0" min-width='+music_player_width+' height=86 src="http://music.163.com/outchain/player?type=2&id='+song_id+'&auto=0&height=66"></iframe>';
    //edit_post.appendHtml(music_frame);
    $rootScope.current_editor.insertValue(music_frame);
    $('#song_search_modal').modal('toggle');
  }
}]);

angular.bootstrap(document.body,['Index']);