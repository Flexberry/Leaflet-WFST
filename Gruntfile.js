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
                src: 'src/**/*.js',
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
                    'src/Util.js',
                    'src/GmlUtil.js',
                    'src/GML/*.js',
                    'src/WFS.js',
                    'src/WFS.Transaction.js',
                    'src/WFS.Transaction.Helpers.js',
                    'src/WFS.Transaction.Requests.js'
                ],
                dest: 'dist/<%= pkg.name %>.src.js'
            }
        },
        jshint: {
            options: {
                jshintrc: true
            },
            dev: {
                files: {
                    src: ['src/**/*.js']
                }
            },
            spec: {
                files: {
                    src: ['spec/**/*.js']
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['concat', 'jshint:dev'],
                options: {
                    spawn: false
                }
            },
            spec: {
                files: ['spec/**/*.js'],
                tasks: ['jshint:spec']
            }
        },
        copy: {
            libs: {
                cwd: 'bower_components/',
                expand: true,
                flatten: true,
                src: [
                    'Leaflet.Toolbar/dist/leaflet.toolbar.*',
                    'L.EasyButton/easy-button.js',
                    'Leaflet.Editable/src/Leaflet.Editable.js',
                    'proj4leaflet/lib/proj4-compressed.js',
                    'proj4leaflet/src/proj4leaflet.js'
                ],
                dest: 'examples/lib/'
            }
        },
        'gh-pages': {
            options: {
                add: true,
                push: false,
                message: 'Auto update gh-pages'
            },
            examples: {
                src: [
                    'examples/**/*',
                    'dist/Leaflet-WFST.src.js'
                ]
            }
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('publish', ['copy:libs', 'gh-pages:examples']);
};