module.exports = function (grunt) {
  grunt.initConfig({
    uglify: {
      main: {
        options: {
          preserveComments: 'some'
        },
        files: {
          'dist/ng-awsmqtt.min.js': ['src/ng-awsmqtt.js']
        }
      }
    },
    standard: {
      options: {
        format: true
      },
      app: {
        src: ['ng-awsmqtt.js']
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.registerTask('default', ['uglify'])
}
