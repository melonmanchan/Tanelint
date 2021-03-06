'use strict';
var del              = require('del');
var gulp             = require('gulp');
var eslint           = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var plumber          = require('gulp-plumber');
var babel            = require('gulp-babel');

// Initialize the babel transpiler so ES2015 files gets compiled
// when they're loaded
require('babel-core/register');

gulp.task('static', function () {
  return gulp.src('**/*.js')
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('clean', function() {
  return del('dist');
});

gulp.task('babel', ['clean'], function () {
  return gulp.src('lib/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('prepublish', [ 'clean', 'babel']);
gulp.task('default', ['static', 'test']);
