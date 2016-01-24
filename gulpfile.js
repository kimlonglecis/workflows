var gulp = require('gulp');
	gutil = require('gulp-util');
	coffee = require('gulp-coffee');
	browserify = require('gulp-browserify');
	compass = require('gulp-compass');
    connect = require('gulp-connect');
    gulpif = require('gulp-if');
    uglify = require('gulp-uglify');
    minHTML = require('gulp-minify-html');
    minJSON = require('gulp-jsonminify');
    minImage = require('gulp-imagemin');
    pngcrush = require('imagemin-pngcrush');
	concat = require('gulp-concat');



var env,
    coffeeSources,
    jsSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle,
    sassComments;



//Setting up envionment condition
env = process.env.NODE_ENV || 'development';

if (env==='development') {
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
    sassComments = 'true';
} else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
    sassComments = 'false';
}


/* -------Sources Location----------*/
coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = ['components/scripts/*.js'];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];


/* -------Gulp-Coffee----------*/
gulp.task('coffee', function(){
	gulp.src(coffeeSources)
	.pipe(coffee({bare: true})
		.on('error', gutil.log))
	.pipe(gulp.dest('components/scripts'))
	});

/* -------Gulp-concat----------*/
gulp.task('js', function() {
   gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulpif(env==='production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())
});

/* -------Gulp-Compass----------*/
gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
        css: outputDir + 'css',
    	sass: 'components/sass',
    	image: outputDir + 'images',
    	style: sassStyle,
        comments: sassComments
    	}))    
    .on('error', gutil.log)
    .pipe(gulp.dest(outputDir + 'css'))
        .pipe(connect.reload())
});

/* -------Gulp-Watch----------*/
gulp.task('watch', function(){
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch('builds/development/*.html', ['html']);
    gulp.watch('builds/development/js/*.json', ['json']);
    gulp.watch('builds/development/images/**/*.*', ['json'])
    });

/* -------Gulp-Connect----------*/
gulp.task('connect', function(){
    connect.server({
        root: outputDir,
        livereload: true
        })
    });

/* -------Gulp-Connect-HTML----------*/
gulp.task('html', function() {
  gulp.src('builds/development/*.html')
  .pipe(gulpif(env==='production', minHTML()))
  .pipe(gulpif(env==='production', gulp.dest(outputDir)))
    .pipe(connect.reload())
}); 
    
/* -------Gulp-Connect-JSON----------*/
gulp.task('json', function() {
  gulp.src('builds/development/js/*.json')
    .pipe(gulpif(env==='production', minJSON()))
    .pipe(gulpif(env==='production', gulp.dest('builds/production/js')))
    .pipe(connect.reload())
});

gulp.task('images', function() {
    gulp.src('builds/development/images/**/*.*')
    .pipe(gulpif(env==='production', minImage({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false}],
        use: [pngcrush()]
        })))
    .pipe(gulpif(env==='production', gulp.dest(outputDir + 'images')))
        .pipe(connect.reload())

    });

/* -------Gulp-Default----------*/
gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'images','connect', 'watch']);