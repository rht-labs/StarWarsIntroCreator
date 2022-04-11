var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass')(require('sass'));
var del = require('del');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-clean-css');

gulp.task('connect', function() {
  connect.server({
    root: 'public',
    livereload: true
  });
});

gulp.task('sass', async function () {
  gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public'))
    .pipe(connect.reload());
});

gulp.task('reload', function () {
  gulp.src(['./public/**/*','!./public/**/*.scss'])
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./public/**/*','!./public/**/*.scss'],['reload']);
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('clean-build', async function(){
    del.sync('./dist/*');
});

// gulp.series('sass','clean-build')

gulp.task('build', async function(){
    gulp.src('public/index.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('styles.css', minifyCss()))
        .pipe(gulp.dest('dist'));

    gulp.src(['./public/*.*','./public/.nojekyll','!public/index.html','!public/styles.css','!public/bb8.css','!public/*.js'])
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', gulp.series('sass', 'connect', 'watch'));
