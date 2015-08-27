// 引入 gulp
var gulp = require('gulp');

// 引入 Plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');

// 创建 Compass 任务
gulp.task('index', function() {
  gulp.src(['./js/index.js'])
    .pipe(concat('index.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js/dist/'));
});
gulp.task('angular-concat', function() {
  gulp.src(['./bower/angular/angular.min.js','./bower/angular-ui-router/release/angular-ui-router.min.js','./bower/ng-infinite-scroll/ng-infinite-scroll.min.js'])
    .pipe(concat('angular.js'))
    .pipe(gulp.dest('./js/dist/'));
});
gulp.task('plugins-concat', function() {
  gulp.src(['./bower/jquery/dist/jquery.min.js','./bower/amazeui/dist/js/amazeui.min.js','./bower/lightbox2/dist/js/lightbox.min.js','./bower/layzrjs/dist/layzr.min.js','./editor/Kindeditor.js',
    './editor/lang/zh_CN.js','./js/jqpaginator.min.js'])
    .pipe(concat('plugins.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js/dist/'));
});
gulp.task('index-css', function() {
  gulp.src(['./css/index.css','./css/piece/piece.css','./css/diary/diary.css','./css/essay/essay.css',
    './css/view.css','./css/message.css'])
    .pipe(concat('index.css'))
    .pipe(minify())
    .pipe(gulp.dest('./css/dist/'));
});
gulp.task('plugins-css', function() {
  gulp.src(['./bower/amazeui/dist/css/amazeui.css'])
    .pipe(concat('plugins.css'))
    .pipe(minify())
    .pipe(gulp.dest('./css/dist/'));
});
//concat angular files
gulp.task('angular-app', function() {
  gulp.src(['./js/angular/index.js','./js/angular/config.js','./js/angular/controller.js',
    './js/angular/factory.js','./js/angular/filter.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./js/dist/'));
});
// 默认任务
gulp.task('default', function() {
    gulp.run('index');
});
gulp.task('watch', function () {
   gulp.watch('./js/angular/*.js', function (event) {
     console.log('Event type: ' + event.type); // added, changed, or deleted
     console.log('Event path: ' + event.path); // The path of the modified file
  });
});
