require.config({
	baseUrl:"/ThinkPHP/Public/js"
    paths: {
        jquery: 'jQuery/jquery-2.1.1.min',
        index:'index',
        page:'pages',
        essay:'essay',
        view:'view',
        kindeditor:'../editor/kindeditor.js',
        kindeditor-lang:'../editor/lang/zh_CN.js'
    }
});
 
require(['jquery','index','pages','essay','view'], function($,a,b,c,d,e,f) {
});