/**
 * Gulpfile.js - My Cooki builder
 *
 * (c) 2014 Contributors.
 * Released under the MIT license.
 */

'use strict';


/**
 * Load Dependencies
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

var HEADER = [
  '/*!',
  ' * <%= pkg.name %> v<%= pkg.version %>',
  ' * <%= pkg.homepage %>',
  ' *',
  ' * Copyright <%= date %> Contributors',
  ' * Released under the <%= pkg.license.type %> license',
  ' * <%= pkg.license.url %>',
  ' */',
  ''
].join('\n');
var pkg = require('./package');
var HEADER_SETTINGS = { pkg: pkg, date: new Date().getFullYear() };


/**
 * CSS Task
 */
gulp.task('dist:css', function () {

    return gulp.src('src/scss/cooki.scss')
        .pipe(plug.rubySass({
            style: 'expanded',
            loadPath: ['scss']
        }))
        .on('error', function (e) { console.error(e.message) })
        .pipe(plug.autoprefixer(AUTOPREFIXER))
        .pipe(plug.header(HEADER, HEADER_SETTINGS))
        .pipe(gulp.dest('dist/css'))
        .pipe(plug.size({ title: 'dist:css' }))

});


/**
 * JS Task
 */
gulp.task('dist:js', function() {

    return gulp.src('src/js/*.js')
        .pipe(plug.header(HEADER, HEADER_SETTINGS))
        .pipe(gulp.dest('dist/js'))
        .pipe(plug.size({ title: 'dist:js' }))

});

// Run our JS and CSS tasks
gulp.task('dist', ['dist:css', 'dist:js']);


/**
 * Minify and concat tasks
 */

// CSS
gulp.task('minify:css', function () {
    return gulp.src('dist/css/cooki.css')
        .pipe(plug.csso())
        .pipe(plug.rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'))
        .pipe(plug.size({ title: 'dist:min:css' }))
});

// JS
gulp.task('minify:js', function () {

    return gulp.src('dist/js/cooki.js')
        .pipe(plug.uglify())
        .pipe(plug.rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'))
        .pipe(plug.size({ title: 'dist:min:js' }))

});

// Run our JS and CSS minify tasks
gulp.task('minify', ['minify:css', 'minify:js']);


/**
 * Lint JS
 */
gulp.task('lint:js', function () {

    return gulp.src('src/js/*.js')
        .pipe(plug.cached('lint'))
        .pipe(plug.jshint())
        .pipe(plug.jshint.reporter('jshint-stylish'))
        .pipe(plug.jshint.reporter('fail'))

});

// Run the lint task
gulp.task('lint', ['lint:js']);


/**
 * Create our default task and watch for changes
 */
gulp.task('default', ['lint', 'dist', 'minify'], function() {

    gulp.watch('src/scss/**/*.scss', ['dist:css']);
    gulp.watch('src/js/**/*.js', ['lint:js', 'dist:js']);

});
