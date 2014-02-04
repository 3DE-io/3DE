var ractive = require('ractive'),
	path = require('path')

module.exports = function(grunt){

	grunt.registerTask('components', 'create components based on directories', components)	
	

	var base = './features/delight/'

	var file = ['var components = [']
	function components(){
		grunt.log.writeln('Compiling components...')

		grunt.file.expand(base + '*').forEach(component)
		file.push(']')
		var out = './src/js/components.js'
		grunt.file.write(out, file.join('\n'))

		grunt.log.writeln('Components completed to ' + out)
	}

	function component(dir){
		var name = path.basename(dir)
		if(name==='layout') { return; }

		file.push('{')
		add('name', '\'' + name + '\'')

		var html = grunt.file.read(dir + '/' + name + '.html')
		var parsed = ractive.parse(html, { preserveWhitespace: true } )
		add('template', JSON.stringify(parsed) )

		var js = grunt.file.read(dir + '/' + name + '.js')
		add('init', 'function(component, Ractive) {\n\t\t' + js + '\n\t}')

		file.push('},')

		grunt.log.ok(name)
	}

	function add(prop, value){
		file.push('\t' + prop + ': ' + value + ',')
	}
}



