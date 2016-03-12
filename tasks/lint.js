"use strict";
const fs = require("fs");
const del = require("del");
const sequence = require("gulp-sequence");
const mocha = require('gulp-mocha');
const tslint = require('gulp-tslint');
const filter = require("gulp-filter");
const projects = require("./projects");

module.exports = function(gulp) {
    projects.forEach((projectConfig) => {
        const project = projectConfig.name;
        const paths = projectConfig.paths;
        const config = projectConfig.buildConfig;
        
        // Not all tasks need to use streams
        // A gulpfile is just another node program and you can use any package available on npm
        gulp.task(`lint:${project}`, function() {
            var toLint = paths.scripts;
            if (config.lintFiles) {
                toLint = config.lintFiles.map(function(file) {
                    return `${__dirname}/../visuals/${project}/${file}`;
                });
            }
            return gulp.src(toLint)
                .pipe(filter(['**/*.ts']))
                .pipe(require("gulp-debug")())
                .pipe(tslint())
                .pipe(tslint.report('verbose'))
        });
    });

    gulp.task("lint", function(cb) {
        return sequence.apply(this, [projects.map(n => `lint:${n.name}`)].concat(cb));
    });
};