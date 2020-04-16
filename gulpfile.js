const gulp = require('gulp');
const uglifyes = require('uglify-es');
const composer = require('gulp-uglify/composer');
var concat = require('gulp-concat');
gulp.task('minify-js', () => {
    return gulp.src(['index.js'])
    .pipe(concat('index.js'))
    .pipe(composer(uglifyes, console)())
    .pipe(gulp.dest('./'));
});
gulp.task('minify-js-test', () => {
    return gulp.src(['test/test.ts'])
    .pipe(concat('test.js'))
    .pipe(composer(uglifyes, console)())
    .pipe(gulp.dest('./test'));
});