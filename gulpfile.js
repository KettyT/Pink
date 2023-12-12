"use strict";

var gulp = require('gulp');
const less = require("gulp-less");
const concat = require("gulp-concat");
const debug = require("gulp-debug");
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");
const newer = require("gulp-newer");
const uglify = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');

const sourceDir = "source";
const destinationPath = "dest";
const destinationHTML = "dest";

//NODE_ENV=prod gulp buildStyles
const isDevelopment = (process.env.NODE_ENV != "prod");


gulp.task("copyFonts", function () {
    return gulp.src(sourceDir + "/fonts/**/*.{woff2,woff,ttf}", {since: gulp.lastRun("copyFonts"), base: sourceDir})
               .pipe(gulp.dest(destinationPath));
});

gulp.task("copyImages", function () {
    return gulp.src(sourceDir + "/img/**/*.{jpg,jpeg,png,ico,svg}", {since: gulp.lastRun("copyImages"), base: sourceDir})
        .pipe(gulp.dest(destinationPath));
});

gulp.task("copyCss", function () {
    var vinyl = gulp.src([sourceDir + "/**/*.css"], {since: gulp.lastRun("copyCss"), base: sourceDir})
        .pipe(newer(destinationPath));

    if (!isDevelopment) {
        vinyl = vinyl.pipe(cleanCSS({compatibility: 'ie8'}));
    }
    return vinyl.pipe(debug({title: "copyCss"}))
        .pipe(gulp.dest(destinationPath));
});

gulp.task("styles", function () {

  let vinyl = gulp.src("source/less/style.less");
        if (isDevelopment) {
            vinyl = vinyl.pipe(sourcemaps.init());
        }
        vinyl = vinyl.pipe(less())
            .pipe(concat("style.css"));

        if (isDevelopment) {
            vinyl = vinyl.pipe(sourcemaps.write());
        }
        vinyl.pipe(gulp.dest(destinationPath + "/css/"));
    // }

    if (vinyl) {
        return vinyl;
    } else {
        completeCallback();
    }
});

gulp.task("clean", function () {
    return del(destinationPath, {
        force: true
    });
});

gulp.task("copyHtml", function () {
    return gulp.src(sourceDir + "/**/*.{html,js}", {since: gulp.lastRun("copyHtml"), base: sourceDir})
        .pipe(gulp.dest(destinationHTML));
});

//"generateTemplates"
// Главная задача.
gulp.task("start", gulp.series("clean",
    gulp.parallel("styles", "copyCss", "copyImages", "copyFonts",
        "copyHtml")));

if (isDevelopment) {
    gulp.watch(sourceDir + "/less/**/*.less*", gulp.series("styles"));
    gulp.watch(sourceDir + "/**/*.css", gulp.series("copyCss"));
    gulp.watch(sourceDir + "/img/**/*.{jpg,jpeg,png,ico,svg}", gulp.series("copyImages"));
    gulp.watch(sourceDir + "/fonts/**/*.{woff2,woff,ttf}", gulp.series("copyFonts"));
    gulp.watch(sourceDir + "/**/*.{html,js}", gulp.series("copyHtml"));
}

