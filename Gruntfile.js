
module.exports = function (grunt) {

  /**
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  /**
   * Load in our build configuration file.
   */
  var userConfig = require( './build.config.js' );

  /**
   * This is the configuration object Grunt uses to give each plugin its 
   * instructions.
   */
  var taskConfig = {
    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON("package.json"),

    // Banner
    meta: {
      version: '0.1.0',
      banner: 
        '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' */\n'
    },

    /**
     * Creates a changelog on a new version.
     */
    changelog: {
      options: {
        dest: 'CHANGELOG.md',
        template: 'changelog.tpl'
      }
    },

    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: [
      '<%= build_dir %>',
      '<%= compile_dir %>'
    ],

    // Watch Less stylesheets
    // =====================================
    watch: {
      less: {
        files: ['source/less/**/*.less'],
        tasks: ['less:development']
      }
    },

    // Compile Less stylesheets
    // =====================================
    less: {
      development: {
        options: {
          strictMath: true,
          sourceMap: false
        },
        files: {
          
          "application/assets/css/<%= pkg.name %>-<%= pkg.version %>.css": "source/less/main.less"//,
          //"application/assets/css/kaliwaan.css": "source/less/kaliwaan/kaliwaan.less"
        }
      }
    },

    // JSHINT
    // =====================================
    jshint: {
      src: [
        'application/assets/js/*.js',
        // Angular stuff
        'application/app/*.js',
        'application/app/**/*.js',
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true
      },
      globals: {}
    },

// Image optimisation
    imagemin: {
      dynamic: {
        options: {
          pngquant: true,
          optimizationLevel: 3
        },
        files:[
          {
            expand: true,
            cwd: 'application/assets',
            src: ['img/*.{png,jpg,gif}', 'img/default/*.{png,jpg,gif}', 'img/error/*.{png,jpg,gif}'],
            dest: '<%= build_dir %>/assets/'
          }
        ]
      }
    },

    // Copy the app folder to the build directory
    copy: {
      html: {
        cwd: 'application',
        src: ['*.html', '.htaccess'],
        dest: '<%= build_dir %>',
        expand: true
      },

      app_files: {
        cwd: 'application',
        src: ['app/**'],
        dest: '<%= build_dir %>',
        expand: true
      },

      required_js: {
        cwd: 'application',
        src: ['assets/js/lib/ace/**','assets/js/lib/ui-ace/**', 'assets/js/lib/angular/**'],
        dest: '<%= build_dir %>',
        expand: true
      },

      fonts: {
        cwd: 'application/assets',
        src: ['fonts/**'],
        dest: '<%= build_dir %>/assets/',
        expand: true
      }
    },

    // Prepares the configuration to transform specific construction
    useminPrepare: {
      html: 'application/index.html',
      options: {
        dest: '<%= build_dir %>'
      }
    },

    // Concatenates multiple source files into a single file.
    concat: {
      pluginjs: {
        '<%= build_dir %>/assets/js/optimized.min.js' : ['<%= plugins_files.js %>'] 
      },

      app_css: {
        src: ['<%= application_files.css %>'],
        dest: '<%= build_dir %>/assets/css/application.css'
      },

      app_js: {

      }
    },

    // Minify the javascript
    uglify: {
      options: {
        mangle: false
      },

      // JS codes for the applcation
      js: {
        files: {
          '<%= build_dir %>/assets/js/optimized.min.js' : ['.tmp/concat/assets/js/optimized.min.js'],
          '<%= build_dir %>/app/api/controller.js' : ['<%= build_dir %>/app/api/controller.js']
        }
      }
    },

    usemin: {
      html: '<%= build_dir %>/index.html'
    }

  };

  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

  // Watch CSS Development
  grunt.registerTask('watchless', ['watch']);

  // Default task.
  grunt.registerTask('default',['clean', 'copy', 'imagemin', 'useminPrepare', 'concat', 'uglify', 'usemin']);

};
