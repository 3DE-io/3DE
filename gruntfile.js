module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jade: {
      options: {
        pretty: true
      },
      index: {
        src: 'assets/index.jade',
        dest: 'src/index.html'
      }
    },
    cssmin: {
      components: {
        options: {
          banner: '/* component css */',
        },
        files: {
          'src/css/components.css': ['features/delight/**/*.css']
        }    
      }
    },
    watch: {
      jade: {
        files: ['<%= jade.index.src %>'],
        tasks: ['jade'],
        options: {
          interrupt: true
        }
      },
      components: {
        files: ['features/delight/**/*.{js,html}'],
        tasks: ['components'],
        options: {
          interrupt: true
        }
      },
      components_css: {
        files: ['features/delight/**/*.css'],
        tasks: ['cssmin:components'],
        options: {
          interrupt: true
        }
      }
    }
  })

  grunt.loadTasks('./tasks')

  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-jade')
  grunt.loadNpmTasks('grunt-contrib-watch')

  // Default task(s).
  //grunt.registerTask('default', ['jade']);

};