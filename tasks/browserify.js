var browserify = require('browserify'),
	fs = require('fs')

var component = browserify(),
	component_file = fs.createWriteStream('./src/js/component.js')

component.require('./assets/js/component/section', { expose: 'section' } )
component.require('./assets/js/component/definition', { expose: 'definition' } )
component.exclude('Ractive')
component.exclude('ractive')
component.exclude('stylus')
component.bundle().pipe(component_file)


var move = browserify(),
	move_file = fs.createWriteStream('./src/js/move.js')
move.require('./assets/js/track-move-events', { expose: 'move' } )
move.bundle().pipe(move_file)
