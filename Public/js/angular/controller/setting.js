//设置控制器
heysoo.controller('c_setting',function($scope,$state,$http){
  $scope.settingSwitchTab = function(tab){
    $scope.setting_tab = tab;
    $state.go("setting_"+tab);
  }
});
/**setting*/
heysoo.controller('c_setting_profile',function($scope,$rootScope,$http,$state){
  $scope.invite_code = $rootScope.user_info.invite_code;

  $scope.modifyProfile = function(option){
    $("#setting_profile_modal_"+option).modal('toggle');
  }
  //生成邀请码
  $scope.createInviteCode = function(){
    $http.get(home_path+"/User/create_invite_code.html").success(function(res){
      if(res.error === 0){
        $scope.invite_code = res.invite_code;
        //hMessage(res.msg);
      }else hMessage(res.msg);
    });
  }
})
heysoo.controller('c_setting_interface',function($scope,$rootScope,$http,$state){
  $scope.modifyInterface = function(option){
    $("#setting_interface_modal_"+option).modal('toggle');
  }
});
//管理对话框
heysoo.controller('c_setting_profile_modal',function($scope,$rootScope,$http){
  $scope.new_username = $scope.new_signature = '';
  $scope.modifyUserName = function(option){
    $("#setting_profile_modal_"+option).modal('toggle');
    $http({
          method:'POST',
          url:home_path+"/User/modify_userName.html",
          data:{'new_username':$scope.new_username}
        }).success(function(res){
          if(res.error === 0){
            $rootScope.user_info.username = $scope.new_username;
            hMessage('用户名已成功修改为：'+$scope.new_username);
          }else{hMessage(res.msg);}
    });
  }
  $scope.modifySignature = function(option){
    $("#setting_profile_modal_"+option).modal('toggle');
    $http({
          method:'POST',
          url:home_path+"/User/modify_signature.html",
          data:{'new_signature':$scope.new_signature}
        }).success(function(res){
          if(res.error === 0){
            $rootScope.user_info.signature = $scope.new_signature;
            hMessage('签名已成功修改为：'+$scope.new_signature);
          }else{hMessage(res.msg);}
    });
  }
});
heysoo.controller('c_setting_interface_modal',function($scope,$http,$rootScope,ipCookie){
  $scope.interface_color = 'primary';
  $scope.interface_mainBg = "bg_day";
  $scope.interface_sideBarBg = "bg_sidebar_lake";
  $scope.modifyTheme = function(option){
    $("#setting_interface_modal_"+option).modal('toggle');
    hMessage('主题定制中，请耐心等候...');
  }
  $scope.modifyColor = function(option){
    $("#setting_interface_modal_"+option).modal('toggle');
    //修改主题颜色
    $http.get(home_path+"/User/modify_interface_color.html?interface_color="+$scope.interface_color).success(function(res){
      hMessage(res.msg);
    });
    $rootScope.interface_color = $scope.interface_color;
    ipCookie('interface_color',$scope.interface_color);
  }
  $scope.modifySidebarBg = function(option){
    $http.get(home_path+"/User/modify_bg.html?type=sidebar&select="+$scope.interface_sideBarBg).success(function(res){
      if(res.error === 0){
        $rootScope.sideBarBg = res.url;
        hMessage(res.msg);
      }
      else hMessage(res.msg);
    });
    $("#setting_interface_modal_"+option).modal('toggle');
  }
  $scope.modifyMainBg = function(option){
    $http.get(home_path+"/User/modify_bg.html?type=mainBg&select="+$scope.interface_mainBg).success(function(res){
      if(res.error === 0){
        $rootScope.mainBg = res.url;
        hMessage(res.msg);
      }
      else hMessage(res.msg);
    });
    $("#setting_interface_modal_"+option).modal('toggle');
  }
});
heysoo.controller('c_setting_privacy_modal',function($scope,$http){
  //
});
heysoo.controller('c_setting_push_modal',function($scope,$http){
  //
});
//reset password 重置密码
heysoo.controller('c_reset_passwd',function($scope,$http){
  $scope.old_passwd = $scope.new_passwd = '';
  $scope.resetPasswd = function(){
    if($scope.old_passwd === '' || $scope.new_passwd === ''){hMessage('密码不能为空！');return;}
    else if($scope.old_passwd === $scope.new_passwd){hMessage('新旧密码不能一样！');return;}
    var url = home_path+"/User/reset_passwd.html";
    $http({
          method:'POST',
          url:url,
          data:{'old_passwd':$scope.old_passwd,'new_passwd':$scope.new_passwd}
        }).success(function(res){
          if(res.error === 0){
            hMessage(res.msg);
            setTimeout(function(){window.location.href=home_path+"/Action/logout.html";},2000);
          }else hMessage(res.msg);
      });
  }
});
//modify user avatar 修改头像
heysoo.controller('c_modify_avatar',function($scope,$rootScope,$http,$interval){
  //$scope.selectAvatarBtn = "选择头像";
  $scope.selectAvatar = function(){
    document.getElementById("new_avatar").click();
  }
  $scope.new_avatar = null;
  $scope.uploadAvatarBtn = "上传";
  //获取并设置七牛token
  $http.get(get_token_path+"?upload_type=avatar").success(function(res){
    $scope.upload_avatar_token = res.token;
  });
  
  $scope.uploadAvatar = function(){
    //获取并设置七牛token
    $http.get(get_token_path+"?upload_type=avatar").success(function(res){
      $scope.upload_avatar_token = res.token;
    });
    var uploadable = true;
    var checkTime=200;
    //先检查文件，判空，类型和大小
    var imgFile = document.getElementById("new_avatar").files[0];
    if(imgFile == null){hMessage('请先选择图片！');uploadable = false;}else{
        if(imgFile.type != "image/jpeg" && imgFile.type != "image/jpg" && imgFile.type != "image/png" && uploadable){hMessage('请选择正确的图片格式：jpeg,jpg,png！'); uploadable = false;}
        var imgSize = imgFile.size / (1024*1024);
        if(imgSize > 2 && uploadable){hMessage('上传图片请限制在2M以内！'); uploadable = false;}
    }

   //执行上传操作
      if(uploadable){
        $(".upload-avatar-form").submit();
        $scope.uploadAvatarBtn = "上传中...";
        var stop = $interval(function(){
          if($(window.frames["upload_avatar_ifm"].document).find('pre').html() != undefined)
          {
            var callback = JSON.parse($(window.frames["upload_avatar_ifm"].document).find('pre').html());
            if(callback.error == 0){
              $rootScope.avatar = callback.url;
              $scope.uploadAvatarBtn = "上传成功！";
              hMessage('上传成功！');
              //同步数据库
              var url = home_path+"/User/updateAvatar.html?new_avatar="+$rootScope.avatar;
              $http.get(url).success(function(res){
                $scope.uploadAvatarBtn = "上传";
                if(res.error == 0){
                        console.log('同步成功！');
                  }else console.log('同步失败！');
              });
            }else hMessage('头像修改失败，请稍后重试！');
           $(window.frames["upload_avatar_ifm"].document).find('pre').html('');
            $interval.cancel(stop);
          }
      },checkTime);
    }
  }
});
/**setting_push*/
heysoo.controller('c_setting_push',function($scope,$rootScope,$http){
  $rootScope.user_config.push_comment = $rootScope.user_config.push_comment=='1'?true:false;
  $rootScope.user_config.push_at = $rootScope.user_config.push_at=='1'?true:false;
  $rootScope.user_config.push_whisper = $rootScope.user_config.push_whisper=='1'?true:false;
  $rootScope.user_config.push_notice = $rootScope.user_config.push_notice=='1'?true:false;
 
  $scope.savePush = function(){
    $http({
        method:'POST',
        url:home_path+"/User/modify_push.html",
        data:{
          'comment_on':$rootScope.user_config.push_comment?1:0,
          'at_on':$rootScope.user_config.push_at?1:0,
          'whisper_on':$rootScope.user_config.push_whisper?1:0,
          'notice_on':$rootScope.user_config.push_notice?1:0
        }
      }).success(function(res){
        if(res.error === 0){
          hMessage(res.msg);
        }else{hMessage(res.msg);}
      });
  }
});
/**setting_privacy*/
heysoo.controller('c_setting_privacy',function($scope,$rootScope,$http){
  $rootScope.user_config.privacy_followable = $rootScope.user_config.privacy_followable=='1'?true:false;
  $rootScope.user_config.privacy_visitable = $rootScope.user_config.privacy_visitable=='1'?true:false;
  $rootScope.user_config.privacy_essay_comment = $rootScope.user_config.privacy_essay_comment=='1'?true:false;
  $rootScope.user_config.privacy_piece_comment = $rootScope.user_config.privacy_piece_comment=='1'?true:false;
  $scope.savePrivacy = function(){
    $http({
        method:'POST',
        url:home_path+"/User/modify_privacy.html",
        data:{
          'followable':$rootScope.user_config.privacy_followable?1:0,
          'visitable':$rootScope.user_config.privacy_visitable?1:0,
          'essay_comment':$rootScope.user_config.privacy_essay_comment?1:0,
          'piece_comment':$rootScope.user_config.privacy_piece_comment?1:0
        }
      }).success(function(res){
        if(res.error === 0){
          hMessage(res.msg);
        }else{hMessage(res.msg);}
      });
  }
});