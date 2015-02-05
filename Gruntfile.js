/**
 * Created by PRadostev on 04.02.2015.
 */
module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/*.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n' +
                '(function(window, document, undefined) {\n\n"use strict";\n\n',
                footer: '\n\n})(window, document);'
            },
            dist: {
                src: ['src/Request.js', 'src/Format.js', 'src/Format.GeoJSON.js', 'src/WFST.js'],
                dest: 'dist/<%= pkg.name %>-src.js'
            }
        },
        jshint: {
            options: {
                jshintrc: true
            },
            scripts: {
                src: ['src/*.js']
            }
        },
        watch: {
            scripts: {
                files: ['src/*.js'],
                tasks: ['jshint', 'concat'],
                options: {
                    spawn: false
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'concat']);
};