//文章，碎片，日记发布
heysoo.register.controller('c_edit',['$scope','$rootScope','$state','$http','Music','$ocLazyLoad','ngDialog','$stateParams',
    function($scope,$rootScope,$state,$http,Music,$ocLazyLoad,ngDialog,$stateParams){
    //--------------- 动态创建编辑器 -------------
    window.essay_editor = editormd("essay-editor",essay_editor_opt);
    //------------ 初始化数据 ----------------
    if($stateParams.action == 'new'){//新增文章
        $scope.action = 'new';
        $scope.post = {
            title:'',
            tag:'',
            visible:'1',
            visible_tag:'',
            archive:'',
            content:'',
            post_piece:true
        };
        $scope.selected_tags = '';
    }else {//编辑文章
        $scope.action = 'edit';
        //---------------- 获取文章内容 ----------------
        $http({
            method:'POST',
            url:home_path+"/Essay/get_essay.html",
            data:{'id':$stateParams.id}
        }).success(function(res){
            console.log(res);
            if(res.error === 0){
                $scope.post = {
                    id:$stateParams.id,
                    title:res.items.title,
                    tag:res.items.tag,
                    visible:res.items.visible,
                    visible_tag:res.items.visible_tag,
                    archive:res.items.archive,
                    content:res.items.content,
                    piece_check:false
                }
                $scope.selected_tags = res.items.selected_tags;
                setTimeout(function(){window.essay_editor.setMarkdown(toMarkdown(res.items.content?res.items.content:''));},1500);
            }else{hMessage(res.msg);}
        });
    }
    $scope.edit_song_key = '';//查找音乐的关键词
    $scope.songs = [];
    $scope.song_search_tip_show = false;
    //-------------- 初始化编辑器 ------------
    $http({
        method:'POST',
        url:home_path+'/Essay/get_edit_init_info.html',
        data:{}
    }).success(function(res){
        console.log(res);
        if(res.error === 0){
            $scope.archiveItems = res.data.archive;
            if($scope.action == 'new')
            $scope.post.archive = $scope.archiveItems[0].id;
        }else{hMessage(res.msg);}
    });
    //setTimeout(function(){window.essay_editor.fullscreen();},500);
    //--------------- 发布文章 ------------------
    $scope.editPost = function(){
        $scope.post.content = window.essay_editor.getHTML();//获取markdown编辑器的html
        console.log($scope.post);
        if($scope.action == 'new')
            $http({
                method:'POST',
                url:home_path+"/Essay/post.html",
                data:$scope.post
            }).success(function(res){
            console.log(res);
                if(res.error === 0){
                    hMessage(res.msg);
                    //edit_post.html('');
                    window.essay_editor.setValue('');//将编辑器内容置空
                    if($scope.edit_type == 'essay')
                        $state.go('view',{id:res.id});
                    else
                    {$state.go('home');}
                }else{hMessage(res.msg);}
            });
        else 
            $http({
                method:'POST',
                url:home_path+"/Essay/update.html",
                data:$scope.post
            }).success(function(res){
            console.log(res);
                if(res.error === 0){
                    hMessage(res.msg);
                    window.essay_editor.setValue('');//将编辑器内容置空
                    $state.go('essay',{page:1});
                }else{hMessage(res.msg);}
            });

    }
    //---------------- 查找音乐 --------------
    $scope.searchSong = function(){
      if(isEmpty($scope.edit_song_key)){hMessage("输入不能为空！");return;}
      $rootScope.song_search_tip = '查询中...';
      $rootScope.current_editor = window.essay_editor;
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
                appendTo: '#edit', //绑定到哪个元素节点
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
    $scope.onVisibleChange = function(){
        if($scope.post.visible == 2 || $scope.post.visible == 3)$scope.editVisible();
        else {$scope.selected_tags = '';$scope.post.visible_tag = '';}
    }
    //-------------- 设置可见性 --------------
    $scope.setPieceVisible = function(visible){
      $scope.post.visible = visible+'';
      $scope.onVisibleChange();
    }
    //--------------- 监听可见性弹窗返回结果 -------------
    $scope.$on('visibleDialogReturn',function(event,mass){
        console.log(mass);
        if(mass.action == 'cancel' && $scope.action == 'new'){
            $scope.post.visible = '1';
            $scope.selected_tags = '';
            $scope.post.visible_tag = '';
        }else if(mass.action == 'confirm'){
            //$scope.selected_tags = '#'+mass.selected_tags.join('#');
            $scope.post.visible_tag = _.pluck(mass.selected_tags,'id').toString();
            $scope.selected_tags = '#'+_.pluck(mass.selected_tags,'name').join('#');
        }
    });
    //-------------- 设置归档 --------------
    $scope.setArchive = function(index,id){
      $scope.post.archive = id;
    }
    //--------------- 监听归档弹窗返回结果 -------------
    $scope.$on('archiveDialogReturn',function(event,mass){
        console.log(mass);
        if(mass.action == 'cancel'){
            //更新归档信息
            $http({
                method:'POST',
                url:home_path+'/Archive/getList.html',
                data:{}
            }).success(function(res){
                console.log(res);
                if(res.error === 0){
                    $scope.archiveItems = res.archives;
                }else{hMessage(res.msg);}
            });
        }
    });
    //-------------- 编辑归档 --------------
    $scope.editArchive = function(){
        $ocLazyLoad.load([public_path+'/js/angular/controller/dialog/archive/ArchiveListController.js']).then(function(){
            ngDialog.openConfirm({
                template: public_path+'/templates/dialog/archive/list.html',
                className: 'ngdialog-theme-default', //弹窗的类名
                controller : 'ArchiveListController',
                preCloseCallback: function(){ //关闭前的触发事件
                    //return confirm('你确定要退出吗？');
                    return true;
                },
                closeByDocument: false, //点击背景关闭弹窗
                closeByEscape: false, //通过键盘Esc按钮关闭弹窗
                showClose: false, //显示关闭按钮
                scope: $scope,
                appendTo: 'body', //绑定到哪个元素节点
                resolve: { //将所需参数传递给弹窗的控制器
                    params : function(){
                        return {
                            dialog_title : '归档',
                        };
                    }
                }
            }).then(function (value) {
            }, function (reason) {
            });
        }, function(e){
        });
    }
    //-------------- 是否同时发布碎片 --------------
    $scope.setPieceCheck = function(){
      $scope.post.piece_check = !$scope.post.piece_check;
    }
}]);

heysoo.register.controller('c_piece_publisher',function($scope,$rootScope,$state,$http,Music){
    $scope.piece_visible = "1";//可见性
    $scope.piece_type = "piece";
    $scope.piece_tag = '';
    $scope.edit_song_key = '';
    $scope.post_piece_check = false;//是否同时发布碎片
    //设置可见性
    $scope.setPieceVisible = function(visible){
      $scope.piece_visible = visible+'';
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
      $scope.piece_content = window.piece_editor.getHTML();//获取markdown编辑器的html
      /*console.log({
          'title':'',
          'tag':$scope.piece_tag,
          'type':$scope.piece_type,
          'visible':$scope.piece_visible,
          'content':$scope.piece_content,
          'post_piece':$scope.post_piece_check
        });*/
      $http({
        method:'POST',
        url:home_path+"/Action/ng_deal_post.html",
        data:{
          'title':'',
          'tag':$scope.piece_tag,
          'type':$scope.piece_type,
          'visible':$scope.piece_visible,
          'content':$scope.piece_content,
          'post_piece':$scope.post_piece_check
        }
      }).success(function(res){
        console.log(res);
        if(res.error === 0){
          hMessage(res.msg);
          window.piece_editor.setValue('');//将编辑器内容置空
          $rootScope.togglePublisher();
          if($scope.piece_type == 'essay')
            $state.go('view',{id:res.id});
          else{
            $http.get(home_path+"/Index/ng_index.html").success(function(res){
              $rootScope.index_items = res;
            });
            $state.go('home');
          }
        }else{hMessage(res.msg);}
      });
    }
});
heysoo.register.controller('c_song_search',function($scope,$rootScope){
  //往编辑器插入音乐
  $scope.insertMusicBox = function(song_id){
    music_frame = '<iframe class="netease-music" frameborder="no" border="0" marginwidth="0" marginheight="0" min-width='+music_player_width+' height=86 src="http://music.163.com/outchain/player?type=2&id='+song_id+'&auto=0&height=66"></iframe>';
    //edit_post.appendHtml(music_frame);
    $rootScope.current_editor.insertValue(music_frame);
    $('#song_search_modal').modal('toggle');
  }
});