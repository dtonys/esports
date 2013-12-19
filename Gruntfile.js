module.exports = function(grunt){
  
  // grunt.initConfig({ list, of, tasks })
  grunt.initConfig({
    compass: {
      dist: {
        sassDir: 'public/sass',
        cssDir: 'public/css',
        watch: true
      }
    }
  });
  
  //grunt.loadNpmTasks('grunt-module');
  grunt.loadNpmTasks('grunt-contrib-compass');
  
  grunt.registerTask('default', ['compass']);
}