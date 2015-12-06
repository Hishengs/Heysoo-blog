// 引入 gulp
var gulp = require('gulp');

// 引入 Plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');

// 创建 Compass 任务
//----------------css-----------------------
gulp.task('index-css', function() {
  gulp.src(['./css/index.css','./css/piece/piece.css','./css/essay/essay.css',
    './css/message.css','./css/setting.css'])
    .pipe(concat('index.css'))
    .pipe(minify())
    .pipe(gulp.dest('./css/dist/'));
});
gulp.task('plugins-css', function() {
  gulp.src(['./bower/amazeui/dist/css/amazeui.css','./editor/meditor/css/editormd.min.css'])
    .pipe(concat('plugins.css'))
    .pipe(minify())
    .pipe(gulp.dest('./css/dist/'));
});
//--------------js---------------------------
gulp.task('index', function() {
  gulp.src(['./js/index.js','./js/to-markdown.js'])
    .pipe(concat('index.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js/dist/'));
});
gulp.task('angular', function() {
  gulp.src(['./bower/angular/angular.min.js','./bower/angular-ui-router/release/angular-ui-router.min.js','./bower/angular-cookie/angular-cookie.min.js'])
    .pipe(concat('angular.js'))
    .pipe(gulp.dest('./js/dist/'));
});
gulp.task('plugins-js', function() {
  gulp.src(['./bower/jquery/dist/jquery.min.js',
    './bower/amazeui/dist/js/amazeui.min.js',
    './editor/meditor/js/editormd.js'])
    .pipe(concat('plugins.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js/dist/'));
});
//--------------------------------angular-app----------------------------------
gulp.task('ng-app', function() {
  gulp.src(['./js/angular/index.js','./js/angular/config.js','./js/angular/ng_service.js','./js/angular/ng_state.js',
    './js/angular/ng_controller.js',
    './js/angular/factory.js','./js/angular/filter.js'])
    .pipe(concat('app.js'))
    .pipe(uglify({mangle:false}))//不使用混淆，一用就出错
    .pipe(gulp.dest('./js/dist/'));
});
//--controller
gulp.task('ng-controller', function() {
  gulp.src(['./js/angular/controller/navigator.js','./js/angular/controller/home.js','./js/angular/controller/essay.js',
    './js/angular/controller/piece.js','./js/angular/controller/message.js','./js/angular/controller/follow.js',
    './js/angular/controller/publish.js','./js/angular/controller/setting.js','./js/angular/controller/tag.js',
    './js/angular/controller/search.js'])
    .pipe(concat('ng_controller.js'))
    .pipe(gulp.dest('./js/angular/'));
});
//--state
gulp.task('ng-state', function() {
  gulp.src(['./js/angular/state/home.js','./js/angular/state/essay.js',
    './js/angular/state/piece.js','./js/angular/state/message.js','./js/angular/state/follow.js',
    './js/angular/state/publish.js','./js/angular/state/setting.js','./js/angular/state/tag.js',
    './js/angular/state/search.js'])
    .pipe(concat('ng_state.js'))
    .pipe(gulp.dest('./js/angular/'));
});
//--service
gulp.task('ng-service', function() {
  gulp.src(['./js/angular/service/essay.js','./js/angular/service/user.js',
    './js/angular/service/piece.js','./js/angular/service/message.js','./js/angular/service/follow.js',
    './js/angular/service/publish.js','./js/angular/service/setting.js','./js/angular/service/tag.js',
    './js/angular/service/search.js','./js/angular/service/music.js'])
    .pipe(concat('ng_service.js'))
    .pipe(gulp.dest('./js/angular/'));
});

// 默认任务
gulp.task('default', function() {
    gulp.run('index');
});
/*gulp.task('watch', function () {
   gulp.watch('./js/angular/*.js', function (event) {
     console.log('Event type: ' + event.type); // added, changed, or deleted
     console.log('Event path: ' + event.path); // The path of the modified file
  });
});*/
