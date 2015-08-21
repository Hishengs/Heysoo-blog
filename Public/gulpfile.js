// 引入 gulp
var gulp = require('gulp');

// 引入 Plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');

// 创建 Compass 任务
gulp.task('index', function() {
  gulp.src(['./js/index.js','./js/page.js','./js/piece.js'])
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
  gulp.src(['./css/index.css','./css/piece/piece.css','./css/diary/diary.css','./css/essay/essay.css','./css/view.css'])
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
// 默认任务
gulp.task('default', function() {
    gulp.run('index');
});