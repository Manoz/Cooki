/**
 * Gulpfile.js - Html5 Starter builder
 *
 * (c) 2014 Contributors.
 * Released under the MIT license.
 */

'use strict';


/**
 * Dependencies
 */
var gulp = require('gulp');
var plug = require('gulp-load-plugins')();


/**
 * Constants
 */
var AUTOPREFIXER = [
    'chrome >= 30',
    'ie >= 8',
    'ff >= 24',
    'safari >= 6',
    'opera >= 12',
    'ios >= 6',
    'android 2.3',
    'android >= 4',
    'ie_mob >= 9'
];


/**
 * CSS Task
 * @todo Move minify and .rename in min:css task
 */
gulp.task('dist:css', function () {

    return gulp.src('src/scss/main.scss')
        .pipe(plug.plumber())
        .pipe(plug.sass({
            outputStyle: 'compressed'   // 'nested' or 'compressed'
        }))
        .pipe(plug.autoprefixer(AUTOPREFIXER))
        .pipe(plug.rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'))
        .pipe(plug.size({ title: 'dist:css' }))

});


/**
 * JS Task
 */
gulp.task('dist:js', function() {

    return gulp.src('src/js/*.js')
        .pipe(plug.plumber())
        .pipe(gulp.dest('dist/js'))
        .pipe(plug.size({ title: 'dist:js' }))

});

// Run our JS and CSS tasks
gulp.task('dist', ['dist:css', 'dist:js']);


/**
 * Minify and concat tasks
 */

// JS
gulp.task('min:js', function () {

    return gulp.src('src/js/main.js')
        .pipe(plug.uglify())
        .pipe(plug.rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'))
        .pipe(plug.size({ title: 'dist:min:js' }))

});

// Run our JS and CSS minify tasks
gulp.task('min', ['min:js']);


/**
 * Lint JS
 */
gulp.task('lint:js', function () {

    return gulp.src('src/js/*.js')
        .pipe(plug.plumber())
        .pipe(plug.jshint())
        .pipe(plug.jshint.reporter(plug.stylish))
        //.pipe(plug.jshint.reporter('fail'))

});

// Run the lint task
gulp.task('lint', ['lint:js']);


/**
 * Create our default task and watch for changes
 */
gulp.task('default', ['dist', 'lint', 'min'], function() {

    gulp.watch('src/scss/**/*.scss', ['dist:css']);
    gulp.watch('src/js/**/*.js', ['lint:js', 'dist:js']);

});
