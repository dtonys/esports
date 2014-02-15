module.exports = function(grunt){
  
  // grunt.initConfig({ list, of, tasks })
  grunt.initConfig({
    compass: {
      dist: {
        sassDir: 'public/sass',
        cssDir: 'public/css',
        watch: true
      }
    },
    watch: {
      sass: {
        files: ['public/sass/**/*.sass'],
        tasks: ['compass'],
      },
      css: {
        files: ['public/css/**/*.css']
      },
      livereload: {
        files: ['public/css/**/*.css'],
        options: { livereload: true }
      }
    }
  });
 
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  
  grunt.registerTask('default', ['compass']);
}