/*
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var gulp = require('gulp');
var ts = require('gulp-typescript');
var webpack = require('webpack-stream');
//var webpackStream = require('webpack-stream');
// var uglify = require('gulp-uglify');
var gulp = require('gulp');;
var sass = require('gulp-sass');
var watch = require('gulp-watch');

gulp.task('webpack', ['transpile'], function() {
  return gulp.src('./Output/ui/home.js')
      .pipe(webpack(require('./webpack.config.js')))
      .pipe(gulp.dest('public/Built'));
});

gulp.task('transpile', function() {
  var paths = ['typings/index.d.ts', 'App/**/*.ts', 'App/**/*.tsx'];
  return gulp.src(paths)
    .pipe(ts({
      noImplicitAny: false,
      jsx: 'react'
    }))
    .pipe(gulp.dest('Output'));
});

gulp.task('sass', function () {
  var input = 'App/**/*.scss';
  var output = 'public';
  return gulp
    // Find all `.scss` files from the `stylesheets/` folder
    .src(input)
    // Run Sass on those files
    .pipe(sass())
    // Write the resulting CSS in the output folder
    .pipe(gulp.dest(output));
});

gulp.task('default', ['transpile', 'webpack', 'sass']);
