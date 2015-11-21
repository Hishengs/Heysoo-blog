heysoo.filter('trustHtml', function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
});
heysoo.filter('subStr', function () {
        return function (input,limit) {
            //去掉所有的html标记
            return input.replace(/<[^>]+>/g,"").substr(0,limit);
        }
});