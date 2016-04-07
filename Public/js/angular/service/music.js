//Netease Music Service
heysoo.service('Music',['$http',function($http){
	//查找歌曲
	this.search = function(key){
		return $http({
			url:home_path+'/Essay/song_search.html?s_key='+key,
			method:'GET'
		});
	}
}]);