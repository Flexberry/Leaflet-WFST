/**
 * Created by PRadostev on 04.02.2015.
 */
module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n' +
                '(function(window, document, undefined) {\n\n"use strict";\n\n',
                footer: '\n\n})(window, document);'
            },
            main: {
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
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            main: {
                src: '<%= concat.main.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            options: {
                jshintrc: true
            },
            scripts: {
                files: {
                    src: '<%= concat.main.src %>'
                }
            },
            spec: {
                files: {
                    src: ['spec/**/*.js']
                }
            }
        },
        copy: {
            libs: {
                files: [{
                    cwd: 'bower_components/',
                    expand: true,
                    src: [
                        'font-awesome/**/*',
                        '!font-awesome/.bower.json',
                        '!font-awesome/.gitignore',
                        '!font-awesome/.npmignore',
                        '!font-awesome/bower.json'
                    ],
                    dest: 'examples/lib/'
                }, {
                    cwd: 'bower_components/',
                    expand: true,
                    flatten: true,
                    src: [
                        'leaflet/dist/*',
                        '!leaflet/dist/leaflet-src.js'
                    ],
                    dest: 'examples/lib/leaflet'
                }, {
                    cwd: 'bower_components/',
                    expand: true,
                    flatten: true,
                    src: [
                        'leaflet/dist/images/**/*',
                    ],
                    dest: 'examples/lib/leaflet/images'
                }, {
                    cwd: 'bower_components/',
                    expand: true,
                    flatten: true,
                    src: [
                        'spin.js/spin.js',

                        'Leaflet.toolbar/dist/leaflet.toolbar.css',
                        'Leaflet.toolbar/dist/leaflet.toolbar.js',

                        'Leaflet.label/dist/leaflet.label.css',
                        'Leaflet.label/dist/leaflet.label.js',

                        'leaflet.markercluster/dist/MarkerCluster.css',
                        'leaflet.markercluster/dist/MarkerCluster.Default.css',
                        'leaflet.markercluster/dist/leaflet.markercluster.js',

                        'leaflet-sidebar/src/L.Control.Sidebar.css',
                        'leaflet-sidebar/src/L.Control.Sidebar.js',

                        'leaflet.editable/src/Leaflet.Editable.js',

                        'proj4leaflet/lib/proj4-compressed.js',
                        'proj4leaflet/src/proj4leaflet.js'
                    ],
                    dest: 'examples/lib/'
                }]
            }
        },
        watch: {
            scripts: {
                files: '<%= concat.main.src %>',
                tasks: ['jshint:scripts', 'concat', 'uglify'],
                options: {
                    spawn: false
                }
            },
            spec: {
                files: ['spec/**/*.js'],
                tasks: ['jshint:spec']
            },
            libs: {
                files: ['bower_components/**/*'],
                tasks: ['copy:libs']
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

    grunt.registerTask('default', ['jshint:scripts', 'jshint:spec', 'concat', 'uglify', 'copy:libs']);
    grunt.registerTask('watchAll', ['watch:scripts', 'watch:spec', 'watch:libs']);
    grunt.registerTask('publish', ['copy:libs', 'gh-pages:examples']);
};