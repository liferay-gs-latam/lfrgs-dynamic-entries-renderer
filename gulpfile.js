'use strict';

const gulp = require('gulp');
const webpack = require('webpack-stream');

gulp.task('default', function(done) {

    return gulp.src('./index.js')
    .pipe(webpack({
        mode: "production",
        output: {
            filename: "DynamicEntriesRenderer.js"
        }
    }))
    .pipe(gulp.dest('./dist'))
    .on('end', done);

})
