// var gulp = require('gulp');
import gulp from 'gulp';
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');		//concat files
var uglify = require('gulp-uglify');		//minify
var gulpIf = require('gulp-if');
var babel = require('gulp-babel');
var cleanCSS = require('gulp-clean-css');	//minify
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('build-css', function() {
	return gulp.src('./app/scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('./app/css'))
		.pipe(browserSync.reload({
			stream: true,
		}))
});

gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'app'
		},
	});
});

gulp.task('useref', function() {
	return gulp.src('./app/*.html')
		.pipe(useref())																						//Concat CSS/JS
		.pipe(gulpIf('*.js', babel({presets: ['es2015']})))				//Transpile JS
		.pipe(gulpIf('*.js', uglify()))														//Minify JS
		.pipe(gulpIf('*.css', cleanCSS({compatibility: 'ie8'})))	//Minify CSS										//Minify CSS
		.pipe(gulp.dest('dist'))																	//Copy CSS/JS
});

gulp.task('fonts', function() {																//Copy fonts to dit
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean:dist', function() {													//Delete the dist folder
  return del.sync('dist');
})

gulp.task('watch', ['browserSync', 'build-css'], function() {
	gulp.watch('./app/scss/**/*.scss', ['build-css']);
	// Also reloads the browser when HTML or JS changes
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/**/*.js', browserSync.reload); 
});

gulp.task('build', function (callback) {											//Prep dist
  runSequence('clean:dist', 
    ['build-css', 'useref', 'fonts'],
    callback
  )
})

gulp.task('default', function (callback) {										//Initial dev build then watch
  runSequence(['build-css','browserSync', 'watch'],
    callback
  )
})
