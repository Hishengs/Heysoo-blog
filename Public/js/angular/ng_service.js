
//用户相关的服务
heysoo.service('User',function($http){
	//获取用户相关配置项
	this.getUserConfig = function(){
		return $http({
			method:'GET',
			url:home_path+"/User/ng_get_user_config.html"
		});
	}
	//获取用户基本信息
	this.getUserInfo = function(user_id){
		return $http({
			method:'GET',
			url:home_path+"/User/ng_get_user_info.html?user_id="+user_id
		});
	}
	//获取关注信息
	this.getFollowInfo = function(user_id){
		return $http({
			method:'GET',
			url:home_path+"/User/get_follow_info.html?user_id="+user_id
		});
	}
	//添加关注
	this.addFollow = function(user_id){
		return $http({
			method:'GET',
			url:home_path+"/User/follow.html?action=add&user_id="+user_id
		});
	}
	//取消关注
	this.disFollow = function(user_id){
		return $http({
			method:'GET',
			url:home_path+"/User/follow.html?action=dis&user_id="+user_id
		});
	}
	//获取碎片
	this.getPieces = function(user_id,page){
		return $http({
			method:'POST',
			url:home_path+"/User/get_pieces.html",
			data:{'user_id':user_id,'page':page}
		});
	}
	//获取文章
	this.getEssays = function(user_id,page){
		return $http({
			method:'POST',
			url:home_path+"/User/get_essays.html",
			data:{'user_id':user_id,'page':page}
		});
	}
});
//碎片服务
heysoo.service('Piece',function($http){
	//获取主页的碎片信息
	
	//删除碎片
	this.delete = function(piece_id){
		return $http({
			method:'POST',
			url:home_path+"/Piece/delete.html",
			data:{piece_id:piece_id}
		});
	}
	//获取碎片评论
	this.getPieceComments = function(piece_id){
		return $http({
			method:'GET',
			url:home_path+"/Piece/get_piece_comment.html?piece_id="+piece_id
		});
	}
	//提交碎片评论
	this.postComment = function(comment){
		return $http({
			method:'POST',
			url:home_path+"/Piece/post_comment.html",
			data:comment
		});
	}
	//删除碎片评论
	this.deleteComment = function(comment_id){
		return $http({
			method:'POST',
			url:home_path+"/Piece/delete_comment.html",
			data:{comment_id:comment_id}
		});
	}
});





/*deal with search engine*/
heysoo.service('Search',function($http){
	//搜索文章
	this.searchEssay = function(search_key){
		return $http({
			method:'POST',
			url:home_path+"/Search/search_essay.html",
			data:{'search_key':search_key}
		});
	}
	//搜索碎片
	this.searchPiece = function(search_key){
		return $http({
			method:'POST',
			url:home_path+"/Search/search_piece.html",
			data:{'search_key':search_key}
		});
	}
	//搜索用户
	this.searchUser = function(search_key){
		return $http({
			method:'POST',
			url:home_path+"/Search/search_user.html",
			data:{'search_key':search_key}
		});
	}
});
//Netease Music Service
heysoo.service('Music',function($http){
	//查找歌曲
	this.search = function(key){
		return $http({
			url:home_path+'/Essay/song_search.html?s_key='+key,
			method:'GET'
		});
	}
});