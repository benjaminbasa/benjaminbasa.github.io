/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  /**
   * The `build_dir` folder is where our projects are compiled during
   * development and the `compile_dir` folder is where our app resides once it's
   * completely built.
   */
  build_dir: 'build',
  compile_dir: 'bin',

  /**
   * These are CSS files to be concat and minified
   */
  application_files: {
    css: [
      // 'application/assets/css/font-awesome.css',
    ]
  },
  
  /**
   * These are JS and CSS files of the 3rd party plugins to be concat and minified
   */
  plugins_files: {
    js: [

    ],
    css: [

    ]
  },
};
