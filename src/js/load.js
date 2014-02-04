console.log('Ractive components', components.length)

components.forEach(function(component){

	var Component = Ractive.extend({
	  template: component.template,
	  magic: true
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
})

var data = {
	"template": {
		"sections": {
			"jade": "p hello {{world}}",
			"mustache": "",
			"ractive": ""
		},
		"error": null
	},
	"style": {
		"sections": {
			"stylus": "p\n\tcolor: green",
			"css": ""
		},
		"error": null
	},
	"data": {
		"sections": {
			"eval": "{ world: 'earth' }",
			"json": ""
		},
		"error": null
	},
	"script": {
		"sections": {
			"js": ""
		},
		"error": null
	}
}

var main = 'flow'
var template = '<' + main + ' '
Object.keys(data).forEach(function(key){
	template += key + '="{{' + key + '}}" ' 
})
template += '/>'

try {
	var ractive = new Ractive({
	  el: document.body,
	  template: template,
	  magic: true,
	  data: data
	})
} catch(error){
	document.body.innerHTML = error
}
