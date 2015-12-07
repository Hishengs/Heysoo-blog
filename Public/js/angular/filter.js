heysoo.filter('trustHtml', function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
});
heysoo.filter('subStr', function () {
        return function (input,limit) {
            //去掉所有的html标记
            //去掉所有的&gt;$lt;&nbsp;
            return input.replace(/<[^>]+>/g,"").replace(/&gt;/g,"").replace(/&lt;/g,"").replace(/&nbsp;/g,"").substr(0,limit);
        }
});
heysoo.filter('addStr', function () {
        return function (input,str) {
            return input + str;
        }
});