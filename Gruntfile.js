module.exports = function(grunt) {

    "use strict";

    var watching = grunt.option('watching');
    var tasks;

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        banner: '/*\n' +
            ' * mQuery v<%= pkg.version %> (<%= pkg.repository.url %>)\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> by <%= pkg.author.name %>\n' +
            ' * Licensed under <%= pkg.license %>\n' +
            ' */\n',

        clean: {
            build: ['build']
        },

        concat: {
            js: {
                options: {
                    banner: '<%= banner %>',
                    footer: "",
                    stripBanners: true
                },
                src: [
                    'src/*.js'
                ],
                dest: 'build/mQuery.js'
            }
        },

        uglify: {
            options: {
                sourceMap: true,
                preserveComments: false
            },
            core: {
                src: 'build/mQuery.js',
                dest: 'build/mQuery.min.js'
            }
        },

        watch: {
            scripts: {
                files: ['src/*.js', 'Gruntfile.js'],
                tasks: ['clean',  'concat', 'uglify']
            }
        }
    });

    tasks = ['clean', 'concat', 'uglify'];

    if (watching) {
        tasks.push('watch');
    }

    grunt.registerTask('default', tasks);
};