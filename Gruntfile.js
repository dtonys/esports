var templatePath = 'public/templates/';
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsvalidate: {
      options:{
        globals: {},
        esprimaOptions: {},
        verbose: true
      },
      targetName:{
        files:{
          src:[
            'public/js/**/*.js',
          ]
        }
      }
    },
    watch: {
      jst: {
        files: ['public/templates/**/*.tmpl.html'],
        tasks: ['jst']
      }
    },
    jst: {
      compile: {
        options: {
          prettify: true,
          namespace: 'templates',
          //strip whitespace
          processContent: function (src) {
            return src.replace(/(^\s+|\s+$)/gm, '');
          },
          //remove path and .tmpl.html from filename to be used as key
          processName: function (filename) {
            return filename.replace(templatePath, '').replace('.tmpl.html', '');
          }
        },
        files: {
          "public/js/compiled_templates.js": ["public/templates/**/*.tmpl.html"]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-jsvalidate');

  grunt.registerTask('default', ['jsvalidate', 'jst']);
};
