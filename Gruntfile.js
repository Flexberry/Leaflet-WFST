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
                src: [
                    'src/XmlUtil.js',
                    'src/Request.js',
                    'src/Filter.js',
                    'src/Filter.GmlObjectID.js',
                    'src/Format.js',
                    'src/Format.GeoJSON.js',
                    'src/Format.GML.js',
                    'src/WFS.js',
                    'src/WFS.Transaction.js'],
                dest: 'dist/<%= pkg.name %>-src.js'
            }
        },
        jshint: {
            options: {
                jshintrc: true
            },
            dev: {
                files: {
                    src: ['src/*.js']
                }
            },
            spec: {
                files: {
                    src: ['spec/*.js']
                }
            },
            min: {
                files: {
                    src: ['dist/leaflet-WFST.min.js']
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/*.js'],
                tasks: ['concat', 'jshint:dev'],
                options: {
                    spawn: false
                }
            },
            spec: {
                files: ['spec/*.js'],
                tasks: ['jshint:spec']
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('minification', ['uglify', 'jshint:min']);
};