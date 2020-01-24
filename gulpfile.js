const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');

// compile scss into css
function style() {
  // where is the scss file
  return (
    gulp
      .src('./scss/**/*.scss')
      // autoprefixer
      .pipe(autoprefixer())
      // pass through scss compiler
      .pipe(sass().on('error', sass.logError))
      // where to save
      .pipe(gulp.dest('.'))
      // stream changes to all browsers
      .pipe(browserSync.stream())
  );
}

function watch() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  gulp.watch('./scss/**/*.scss', style);
  gulp.watch('./**/*.html').on('change', browserSync.reload);
  gulp.watch('./js/.**/*.js').on('change', browserSync.reload);
}

exports.style = style;
exports.watch = watch;
