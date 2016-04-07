require.config({
    waitSeconds : 20,
    baseUrl: 'Public/js/',
    paths: {
        'plugins':'./dist/plugins',
        'angular':'./dist/angular',
        'ng-home':'./angular/home',
        'ng-service':'./angular/ng_service',
        'ng-state':'./angular/ng_state',
        'ng-config':'./angular/config',
        'ng-filter':'./angular/filter',
        'index':'./index',
        'ocLazyLoad':'../bower/ocLazyLoad/dist/ocLazyLoad.min',
        'ng-dialog':'../bower/ng-dialog/js/ngDialog.min',
    },
    shim: {
        'angular': {
            exports: "angular"
        },
        'ocLazyLoad': ['angular'],
        'ng-home': ['ng-config','ng-service','ng-state','ng-filter','index','ng-dialog'],
        'index': ['ocLazyLoad'],
        'ng-service': ['angular'],
        'ng-state': ['angular'],
        'ng-config': ['angular'],
        'ng-filter': ['angular'],
        'ng-dialog': ['angular']
    },
    priority: [
        'angular'
    ],
    deps: [
        'ng-home'
    ]
});
require(['ng-home'], function() {
    console.log('开始加载所需JS文件...\n');
});