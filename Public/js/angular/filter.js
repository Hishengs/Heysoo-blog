heysoo.filter('trustHtml', ['$sce',function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    }
}]);
heysoo.filter('subStr', [function () {
    return function (input,limit) {
        //去掉所有的html标记
        //去掉所有的&gt;$lt;&nbsp;
        return input.replace(/<[^>]+>/g,"").replace(/&gt;/g,"").replace(/&lt;/g,"").replace(/&nbsp;/g,"").substr(0,limit);
    }
}]);
heysoo.filter('addStr', [function () {
    return function (input,str) {
        return input + str;
    }
}]);
heysoo.filter('highLight',[function(){
    return function (input,key) {
        var pattern = eval("/("+key+")/gi");
        //console.log("pattern:",pattern);
        //console.log(input.replace(pattern,"<em class=\"search-highlight\">$1</em>"));
        return input.replace(pattern,"<em class=\"search-highlight\">$1</em>");
    }
}]);
//处理发布时间显示
heysoo.filter('transferPostDate',[function(){
    return function(input){
        var date = new Date(input);
        if(date.toString() !== 'Invalid Date'){
            var current_date = new Date();

            if(current_date.getYear() == date.getYear() && current_date.getMonth() == date.getMonth()){//如果是同一年且同一个月
                if(current_date.getDate() == date.getDate()){//如果是同一天
                    if(current_date.getHours() == date.getHours()){//如果是同一个时辰
                        var minute_gap = current_date.getMinutes() - date.getMinutes();
                        if(minute_gap <= 0){//如果是同一分钟
                            return ' 刚刚';
                        }else return minute_gap + ' 分钟前';
                    }else return (current_date.getHours() - date.getHours()) + ' 小时前';
                }else return (current_date.getDate() - date.getDate()) + ' 天前';
            }else return input;//不是同一个月则返回原始时间不格式
        }return input;
    }
}]);
//html显示照片
heysoo.filter('imgView',[function(){
    return function(input,type){
        var re = /<img.*?(?:>|\/>)/gi;
        if(type == 1){//预览
            var imgs = input.match(re);
            if(imgs !== null){
                // return imgs.join('');
                for(var i=0;i<imgs.length;i++){
                    var src = imgs[i].match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i);
                    console.log(src);
                    if(src)
                        imgs[i] = '<div class="img-wrapper" style="background-image:url(\''+src[1]+'\');background-repeat:no-repeat;width:80px;height:80px;">'+'</div>';
                    else imgs[i] = '';
                    console.log(imgs[i]);
                }
                return imgs.join('');
            }
            else return '';
        }else {
            var imgs = input.match(re);
            if(imgs !== null)return imgs.join('<br/>');
            else return '';
        }
    }
}]);