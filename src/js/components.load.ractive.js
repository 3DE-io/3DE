function RactiveComponents(Ractive){
	var self = this

	this.unpack = function(component){

		component.template = component.template
			? JSON.parse(component.template)
			: []

		component.init = new Function('component', 'Ractive', component.init)

		return component
	}
	this.loadAll = function(components){
		components.forEach(self.load)
	}

	this.load = function(component){
		var Component = Ractive.extend({
			template: component.template,
		 	magic: true,
			debug: true
		})

		var c = {}
		component.init(c, Ractive)
		exports = c.exports;

		if ( typeof exports === 'undefined' ) {
		  //just use default...
		} else if ( typeof exports === 'function' ) {
		  Component = exports( Component );
		} else if ( typeof exports === 'object' ) {
		  Component = Component.extend( exports );
		}

		Ractive.components[component.name] = Component
		return component
	}
	
}

var loader = new RactiveComponents(Ractive)