//文章，碎片，日记发布
heysoo.register.controller('c_edit',['$scope','$rootScope','$state','$http','Music','$ocLazyLoad','ngDialog','$stateParams','User',
    function($scope,$rootScope,$state,$http,Music,$ocLazyLoad,ngDialog,$stateParams,User){
    //--------------- 动态创建编辑器 -------------
    $scope.post = {};//待发布或编辑的文章
    $scope.edit_song_key = '';//查找音乐的关键词
    $scope.songs = [];//查找到的音乐结果
    $scope.song_search_tip_show = false;
    window.essay_md_editor = editormd("essay-md-editor",essay_md_editor_opt);//初始化Markdown编辑器
    $scope.current_editor = 'markdown';//当前的编辑器类型：markdown/regular
    //两种编辑器的资源路径数组
    var regular_editor_resource = [public_path+'/editor/kindeditor-min.js',public_path+'/editor/themes/simple/simple.css'];
    var markdown_editor_resource = [];
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
            piece_check:false
        };
        $scope.selected_tags = '';
        //新建的编辑器由用户偏好来决定
        User.getUserConfig().success(function(res){
            if(res.user_config.editor=='regular'){
                $ocLazyLoad.load(regular_editor_resource).then(function(){
                    window.essay_editor = KindEditor.create('#essay-editor',regular_essay_editor_opt);
                    $scope.current_editor = 'regular';
                },function(e){
                    console.log('初始化时加载编辑器出错！');
                });
            }else {
                window.essay_md_editor = editormd("essay-md-editor",essay_md_editor_opt);
                $scope.current_editor = 'markdown';
            }
        });
    }else {//编辑文章
        $scope.action = 'edit';
        //修改的编辑器由文章新建时所使用的编辑器决定
        //---------------- 获取文章内容 ----------------
        $http({
            method:'POST',
            url:home_path+"/Essay/get_essay.html",
            data:{'id':$stateParams.id}
        }).success(function(res){
            if(res.error === 0){
                $scope.post = {
                    id:$stateParams.id,
                    title:res.items.title,
                    tag:res.items.tag,
                    visible:res.items.visible,
                    visible_tag:res.items.visible_tag,
                    archive:res.items.archive,
                    content:parseInt(res.items.is_md)?res.items.content_md:res.items.content,
                    piece_check:false
                }
                $scope.selected_tags = res.items.selected_tags;
                //将html转为md
                if(!parseInt(res.items.is_md)){//如果文章原来使用普通编辑器编辑则继续使用该编辑器
                    //加载普通编辑器
                    $ocLazyLoad.load(regular_editor_resource).then(function(){
                        window.essay_editor = KindEditor.create('#essay-editor',regular_essay_editor_opt);
                        window.essay_editor.html($scope.post.content);
                        $scope.current_editor = 'regular';
                    },function(e){
                        console.log('初始化时加载编辑器出错！');
                    });
                }else{
                    window.essay_md_editor = editormd("essay-md-editor",essay_md_editor_opt);//初始化Markdown编辑器
                    $scope.current_editor = 'markdown';
                    setTimeout(function(){window.essay_md_editor.setMarkdown($scope.post.content);},1000);//这里需延迟等编辑器初始化好了再设置内容
                }
            }else{hMessage(res.msg);}
        });
    }
    //-------------- 初始化编辑器 ------------
    //1.归档信息 2.etc
    $http({
        method:'POST',
        url:home_path+'/Essay/get_edit_init_info.html',
        data:{}
    }).success(function(res){
        if(res.error === 0){
            $scope.archiveItems = res.data.archive;
            if($scope.action == 'new')
            $scope.post.archive = $scope.archiveItems[0].id;
        }else{hMessage(res.msg);}
    });
    //--------------- 发布文章 ------------------
    $scope.editPost = function(){
        var is_sys = arguments[0] && arguments[0]=='sys';//是否是内部调用
        //return;
        if($scope.current_editor=='markdown'){
            $scope.post.content = window.essay_md_editor.getHTML();//获取markdown编辑器的html
            $scope.post.content_md = window.essay_md_editor.getMarkdown();
        }else {
            //ps,如果使用普通编辑器，将html转为md可能会有问题
            $scope.post.content_md = toMarkdown(window.essay_editor.html());
            $scope.post.content = window.essay_editor.html();
        }
        $scope.post.is_md = $scope.current_editor=='markdown'?1:0;//文章的编辑方式
        if($scope.action == 'new' && !$scope.post['id'])
            $http({
                method:'POST',
                url:home_path+"/Essay/post.html",
                data:$scope.post
            }).success(function(res){
                console.log(res);
                if(res.error === 0){
                    if(is_sys)$scope.post.id = res.id;
                    else{
                        hMessage(res.msg);
                        if($scope.current_editor=='markdown')window.essay_md_editor.setValue('');//将编辑器内容置空
                        else window.essay_editor.html('');
                        $state.go('essay',{page:1});
                    }
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
                    if(is_sys);
                    else{
                        hMessage(res.msg);
                        if($scope.current_editor=='markdown')window.essay_md_editor.setValue('');//将编辑器内容置空
                        else window.essay_editor.html('');
                        $state.go('essay',{page:1});
                    }
                }else{hMessage(res.msg);}
            });

    }
    //---------------- 查找音乐 --------------
    $scope.searchSong = function(){
      if(isEmpty($scope.edit_song_key)){hMessage("输入不能为空！");return;}
      $rootScope.song_search_tip = '查询中...';
      $rootScope.current_editor = $scope.current_editor=='markdown'?window.essay_md_editor:window.essay_editor;
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
    //-------------- 更换编辑器 --------------
    $scope.changeEditor = function(){
        //如果要转为普通编辑器需要异步加载脚本文件
        if($scope.current_editor=='markdown'){
            $ocLazyLoad.load([public_path+'/editor/kindeditor-min.js',public_path+'/editor/themes/simple/simple.css']).then(function(){
                //动态创建编辑器
                var essay_content = essay_md_editor.getHTML();
                $scope.current_editor = 'regular';
                window.essay_editor = KindEditor.create('#essay-editor',regular_essay_editor_opt);
                console.log('进入异步加载了');
                essay_editor.html(essay_content);
                $scope.post.content = essay_content;
                var ke_container = document.getElementsByClassName('ke-container')[0];
                if(ke_container !== undefined)ke_container.style.cssText = 'display:block;';
                console.log('current_editor:'+$scope.current_editor);
            },function(e){
                console.log('普通编辑器加载出错！');
                return;
            });
        }else {
            $scope.post.content = toMarkdown(window.essay_editor.html());
            essay_md_editor.setMarkdown($scope.post.content);
            $scope.current_editor = 'markdown';
            document.getElementsByClassName('ke-container')[0].style.cssText = 'display:none;';
            window.essay_editor = null;
            //console.log('current_editor:'+$scope.current_editor);
        }
    }    
    //-------------- 实现自动保存 --------------
    $scope.auto_save = {time_gap:30*1000,tip:'',show_tip:false,id:0,saved_content:'',begin_after:60*1000};
    $scope.autoSave = function(){
        //console.log('autoSave 被调用');
        //如果文章内容为空，则不保存
        $scope.post.content = $scope.current_editor=='markdown'?window.essay_md_editor.getMarkdown():window.essay_editor.html();
        //如果文章内容为空或者内容没有变化则不保存
        if(isEmpty($scope.post.content) || ($scope.auto_save.saved_content == $scope.post.content)){/*console.log('文章内容为空或者内容没有变化');*/return;}
        else{
            $scope.auto_save.saved_content = $scope.post.content;
            $scope.post.title = isEmpty($scope.post.title)?'未标题':$scope.post.title;
            $scope.editPost('sys');//提交保存
            $scope.auto_save.tip = '已自动保存：' + new Date().toLocaleString();
            $scope.auto_save.show_tip = true;
            setTimeout(function(){$scope.auto_save.show_tip = false;},500);//0.5秒后隐藏提示
        }
    }
    //页面打开1分钟开启自动保存
    if($scope.action=='new')//只对新增开启
    setTimeout(function(){
        //console.log('已开启自动保存');
        $scope.auto_save.id = setInterval(function(){
            $scope.autoSave();
            if(!$state.is('edit')){clearInterval($scope.auto_save.id);/*console.log('autoSave 被停止调用');*/}//如果离开了当前状态则停止自动保存
        },$scope.auto_save.time_gap);
    },$scope.auto_save.begin_after);
    //舍弃已保存的文章
    $scope.dropPost = function(){
        if(confirm('确定舍弃已保存的内容？')){
            //删除已保存的文章
            $http({
                method:'POST',
                url:home_path+"/Essay/delete.html",
                data:{essay_id:$scope.post.id}
            }).success(function(res){
                console.log(res);
                if(res.error === 0){
                    history.go(-1);//返回前一页
                }else{/*hMessage(res.msg);*/}
            });
        }
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
//移到home.js
/*heysoo.register.controller('c_song_search',function($scope,$rootScope){
    //往编辑器插入音乐
    $scope.insertMusicBox = function(song_id){
        console.log('往编辑器插入音乐');
        music_frame = '<iframe class="netease-music" frameborder="no" border="0" marginwidth="0" marginheight="0" min-width='+music_player_width+' height=86 src="http://music.163.com/outchain/player?type=2&id='+song_id+'&auto=0&height=66"></iframe>';
        //edit_post.appendHtml(music_frame);
        if($rootScope.current_editor['insertValue'] !== undefined)
            $rootScope.current_editor.insertValue(music_frame);
        else $rootScope.current_editor.appendHtml(music_frame);
        $('#song_search_modal').modal('toggle');
    }
});*/