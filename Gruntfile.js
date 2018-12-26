module.exports = function(grunt) {

    "use strict";

    var watching = grunt.option('watching');
    var tasks;

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copyright: '/*\n' +
            ' * m4q v<%= pkg.version %> (<%= pkg.repository.url %>)\n' +
            ' * Copyright 2018 - <%= grunt.template.today("yyyy") %> by <%= pkg.author.name %>\n' +
            ' * <%= pkg.description %>\n' +
            ' * Licensed under <%= pkg.license %>\n' +
            ' */\n',

        banner: "( function( global, factory ) {\n" +
            "\n" +
            "\t\"use strict\";\n" +
            "\n" +
            "\tif ( typeof module === \"object\" && typeof module.exports === \"object\" ) {\n" +
            "\n" +
            "\t\tmodule.exports = global.document ?\n" +
            "\t\t\tfactory( global, true ) :\n" +
            "\t\t\tfunction( w ) {\n" +
            "\t\t\t\tif ( !w.document ) {\n" +
            "\t\t\t\t\tthrow new Error( \"m4q requires a window with a document\" );\n" +
            "\t\t\t\t}\n" +
            "\t\t\t\treturn factory( w );\n" +
            "\t\t\t};\n" +
            "\t} else {\n" +
            "\t\tfactory( global );\n" +
            "\t}\n" +
            "\n" +
            "// Pass this if window is not defined yet\n" +
            "} )( typeof window !== \"undefined\" ? window : this, function( window, noGlobal ) {",

        clean: {
            build: ['build']
        },

        concat: {
            js: {
                options: {
                    banner: '<%= copyright %>' + "\n" + "<%= banner %>\n",
                    footer: "\n\treturn m4q; \n});\n",
                    stripBanners: true,
                    process: function(src, filepath) {
                        return src.replace(/\n/g, '\n\t');
                    }
                },
                src: [
                    'src/mode.js',
                    'src/func.js',
                    'src/core.js',
                    'src/each.js',
                    'src/data.js',
                    'src/utils.js',
                    'src/events.js',
                    'src/html.js',
                    'src/ajax.js',
                    'src/css.js',
                    'src/parser.js',
                    'src/size.js',
                    'src/search.js',
                    'src/attr.js',
                    'src/proxy.js',
                    'src/init.js',
                    'src/populate.js'
                ],
                dest: 'build/m4q.js'
            }
        },

        uglify: {
            options: {
                sourceMap: true,
                preserveComments: false
            },
            core: {
                src: 'build/m4q.js',
                dest: 'build/m4q.min.js'
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