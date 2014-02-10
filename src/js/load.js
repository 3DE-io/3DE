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

var data = {}
var component = {
	"template": {
		"code": {
			"jade": "p hello {{world}}\ninput(value='{{world}}')",
			"mustache": "",
			"ractive": ""
		},
		"error": null
	},
	"style": {
		"code": {
			"stylus": "p\n\tcolor: green",
			"css": ""
		},
		"error": null
	},
	"data": {
		"code": {
			"eval": "{ world: 'earth' }",
			"json": ""
		},
		"error": null
	},
	"script": {
		"code": {
			"js": ""
		},
		"error": null
	}
}
var other = {
	"template": {
		"code": {
			"jade": "ul\n\t{{#items}}\n\tli {{.}}\n\t{{/items}}\n" +
					"input(value='{{new}}')\nbutton(on-click='add:{{new}}') add",
			"mustache": "",
			"ractive": ""
		},
		"error": null
	},
	"style": {
		"code": {
			"stylus": "li\n\tcolor saddlebrown\n\tfont-family fantasy",
			"css": ""
		},
		"error": null
	},
	"data": {
		"code": {
			"eval": "{ items: ['earth', 'mars','venus'] }",
			"json": ""
		},
		"error": null
	},
	"script": {
		"code": {
			"eval": "component.exports = {\n\
	init: function(){\n\
		var items = this.data.items\n\
		this.on('add', function(e, item){\n\
			if(!item){ return }\n\
			items.push(item)\n\
			this.data.new = ''\n\
		})\n\
	}\n\
}",
			"js": ""
		},
		"error": null
	}
}

data.component = other

var config = new ConfigService()

function ConfigService() {

	var defaultPane = {
		position: { x: 70, y: 50 },
		pane: {
			position: { x: 50, y: 50 }
		}
	}

	return {
		get pane(){
			var ls = localStorage.paneConfig
			return ls ? JSON.parse(ls) : defaultPane
		},
		set pane(pc){
			localStorage.paneConfig = JSON.stringify(pc)
		}
	}
}

data.pane = config.pane

window.onbeforeunload = function(){
	config.pane = data.pane
}

setTimeout(function(){
	load(data)
})

function load(data){
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
}
