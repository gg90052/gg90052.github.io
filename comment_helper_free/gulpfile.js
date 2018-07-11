var gulp = require('gulp'),
    connect = require('gulp-connect'), //微型伺服器
    plumber = require('gulp-plumber'), //錯誤攔截
    sass = require('gulp-sass'),
    merge = require('merge-stream'), //合併工作流 for spritesmith
    spritesmith = require('gulp.spritesmith'), //產生sprite
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'), //自動前綴 for postcss
    sourcemaps = require('gulp-sourcemaps');
    babel = require("gulp-babel");

// Paths
var paths = {
  'source': './',
  'component': '.component/',
  'js': './es6js/',
  'sass': './sass/',
  'img': './images/icons',
  'public': './'
}

gulp.task('webserver', function(){
  connect.server({
    livereload: true
  });
});

gulp.task('babel', function() {
    return gulp.src(paths.js +'./*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.public + './js'))
        .pipe(connect.reload());
});

gulp.task('sass', function() {
  var processors = [
    autoprefixer({browsers: ['last 1 version']})
  ];
  gulp.src([paths.sass + '**/**.scss'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'})
    .on('error', sass.logError))
      .pipe(postcss(processors))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(paths.public + './css'))
      .pipe(connect.reload());
});

gulp.task('sprite', function () {
  var spriteData = gulp.src(paths.img+'/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../images/sprite.png',
    cssName: 'sprite.css'
  }));

  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteData.img
    .pipe(gulp.dest(paths.public+'/images/'));

  // Pipe CSS stream through CSS optimizer and onto disk
  var cssStream = spriteData.css
    .pipe(gulp.dest(paths.public+'/css/'));

  return merge(imgStream, cssStream);
});


gulp.task('default',['webserver'],function(){
  gulp.watch(paths.img+'/icon/*',['sprite']);
  gulp.watch(paths.sass+'/*',['sass']);
  gulp.watch(paths.js+'/*',['babel']);
  gulp.watch(paths.source+'/*.html', ['babel']);
});