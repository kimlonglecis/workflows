var gulp = require('gulp');
	gutil = require('gulp-util');
	coffee = require('gulp-coffee');
	browserify = require('gulp-browserify');
	compass = require('gulp-compass');
    connect = require('gulp-connect');
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
    gulp.watch(htmlSources, ['html']);
    gulp.watch(jsonSources, ['json'])
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
  gulp.src(htmlSources)
    .pipe(connect.reload())
}); 

/* -------Gulp-Connect-JSON----------*/
gulp.task('json', function() {
  gulp.src(jsonSources)
    .pipe(connect.reload())
});

/* -------Gulp-Default----------*/
gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);