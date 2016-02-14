var gulp = require('gulp'),
    wiredep = require('wiredep').stream,
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),/
    minifyCss = require('gulp-minify-css'),
    clean = require('gulp-clean'),
    spritesmith = require('gulp.spritesmith'),
    watch = require('gulp-watch'),
    autoprefixer = require('gulp-autoprefixer'),
    gutil = require('gulp-util'),
    ftp = require('gulp-ftp');

    //upload ftp
    gulp.task('ftp', function () {
        return gulp.src('dist/**/*')
            .pipe(ftp({
                host: 'fortuna.timeweb.ru',
                user: 'cj22317_ozon',
                pass: 'L0tuV6Ez',
                remotePath: '/testovyi/public_html/news'
            }))
            .pipe(gutil.noop());
    });

    //prefix css
    gulp.task('prefixer', function () {
        return gulp.src('app/css/*.css')
            .pipe(autoprefixer({
                browsers: ['last 5 versions'],
                cascade: false
            }))
            .pipe(gulp.dest('app/css'));
    });

    //clean dist
    gulp.task('clean', function () {
        return gulp.src('dist', {read: false})
            .pipe(clean());
    });

    gulp.task('clean_img', function () {
        return gulp.src('app/img_min', {read: false})
            .pipe(clean());
    });

    //Sprite build
    gulp.task('sprite', function () {
      var spriteData = gulp.src('app/img/icon/*.{jpg,png,jpeg}').pipe(spritesmith({
        imgName: '../img/sprite.png',
        cssName: 'sprite.css'
      }));
      return spriteData.pipe(gulp.dest('app/img'));
    });

    //WATCH Мониторит файлы на изминения
    gulp.task('watch', function(){
      gulp.watch('bower.json', ['bower']);
    });

    //bower
    gulp.task('bower', function () {
      gulp.src('app/*.html')
        .pipe(wiredep({
          directory:"app/bower_components"
        }))
        .pipe(gulp.dest('app/'));
    });

    //build project
    gulp.task('build',['clean','prefixer'], function () {
        var assets = useref.assets();
        var opts = {
        quotes: true
    };

    gulp.src('app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));

    gulp.src('app/images/**/*')
    .pipe(gulp.dest('dist/images'));

    gulp.src('app/img/**/*')
    .pipe(gulp.dest('dist/img'));

    gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});