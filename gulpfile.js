var spawn = require('child_process').spawn;
var gulp = require('gulp');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');

gulp.task('jekyll', function (done) {
  var jekyll = spawn('jekyll', ['build'], {
    detached: true,
    stdio: 'inherit'
  });
});

gulp.task('compress', function (done) {
  return gulp.src('_site/css/*.css')
    .pipe(minifyCss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('_site/css'));
});

gulp.task('serve', ['compress', 'jekyll'], function (done) {
  gulp.watch('_site/css/main.css', ['compress']);
  gulp.start('jekyll', function (code) {
    process.exit(code); // because it doesn't exit for some reason
  });
});
