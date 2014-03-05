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
      },
      layout: {
        src: 'assets/layout.jade',
        dest: 'src/layout.html'
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
    copy: {
      ractive: {
        src: '../Ractive/build/Ractive.js',
        dest: 'src/js/Ractive.js'
      }
    },
    components: {
      delight: {
        src: 'features/delight/*',
        dest: 'src/js/components.js'
      }
    },
    watch: {
      options: {
          interrupt: true
      },
      jade_index: {
          files: ['<%= jade.index.src %>'],
          tasks: ['jade:index'],
      },
      jade_layout: {
          files: ['<%= jade.layout.src %>'],
          tasks: ['jade:layout'],
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

  grunt.loadTasks('./tasks/grunt')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-jade')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-copy')

  grunt.registerTask('default', ['jade', 'cssmin', 'components']);

};