var ractive = require('../src/js/Ractive.js'),
	path = require('path')

module.exports = function(grunt){

	var desc = 'Create components based on feature directories'
	grunt.registerMultiTask('components', desc, components)	
	
	function components(){
		grunt.verbose.writeln('Compiling components...')

		this.files.forEach(function(file){
			var component = file.src.map(function(dir){
				return {
					dir: dir, 
					name: path.basename(dir)
				}
			}).filter(function(dir){
				return dir.name!=='layout'
			}).map(make).join('\n')

			grunt.file.write(file.dest, 'var components = [\n' + component + '\n]')
			grunt.log.writeln('File "' + file.dest + '" created.')
		})
	}

	function make(componentInfo){
		var name = componentInfo.name,
			dir = path.join(componentInfo.dir, name)
			component = []

		grunt.verbose.writeln('Packaging component ' + name)

		component.push('{')
		add(component, 'name', '\'' + name + '\'')

		var html = grunt.file.read(dir + '.html')
		var parsed = ractive.parse(html, { preserveWhitespace: true } )
		add(component, 'template', JSON.stringify(parsed) )

		var js = grunt.file.read(dir + '.js')
		add(component, 'init', 'function(component, Ractive) {\n\t\t' + js + '\n\t}')

		component.push('},')

		grunt.verbose.ok()

		return component.join('\n')
	}

	function add(component, prop, value){
		component.push('\t' + prop + ': ' + value + ',')
	}
}



