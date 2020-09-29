const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const purgecss = require('gulp-purgecss');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const runSequence = require('run-sequence');

// compile scss into css
function style() {
  // where is the scss file
  return (
    gulp
      .src('./scss/**/*.scss')

      // autoprefixer
      .pipe(autoprefixer())

      // pass through scss compiler, no minify
      .pipe(sass().on('error', sass.logError))

      // where to save
      .pipe(gulp.dest('./css'))

      // stream changes to all browsers
      .pipe(browserSync.stream())
  );
}

function watch() {
  browserSync.init({
    //proxy: '', //place WAMP url here

    //If not using WAMP/MAMP/LAMP
    server: {
      baseDir: './',
    },
  });
  gulp.watch('./scss/**/*.scss', style);
  gulp.watch('./**/*.html').on('change', browserSync.reload);
  gulp.watch('./js/*.js').on('change', browserSync.reload);
  gulp.watch('./**/*.php').on('change', browserSync.reload);
}

gulp.task('purgecss', () => {
  return gulp
    .src('./css/*.css')
    .pipe(
      purgecss({
        content: ['./*.html'],
      })
    )
    .pipe(gulp.dest('./css/'));
});

// minify css
gulp.task('styles', () => {
  return (
    gulp
      .src('./scss/**/*.scss')

      // autoprefixer
      .pipe(autoprefixer())

      // pass through scss compiler AND minify
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))

      // where to save
      .pipe(gulp.dest('./css'))
  );
});

// minify JS
gulp.task('scripts', () => {
  return (
    gulp
      .src('./js/*.js')
      // minify the files
      .pipe(uglify())
      // where to save
      .pipe(gulp.dest('./js'))
  );
});

// minify HTML
gulp.task('pages', function () {
  return gulp
    .src(['./**/*.html'])
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
      })
    )
    .pipe(gulp.dest('./'));
});

// Minify JS, HTML, and CSS
gulp.task('minify', function () {
  runSequence('styles', 'scripts', 'pages');
});

gulp.task('clean', () => del(['./']));

exports.style = style;
exports.watch = watch;
