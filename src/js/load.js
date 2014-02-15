
loader.loadAll(components)

var hello = {
	name: 'hello',
	assets: {
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
				init: '',
				"js": ""
			},
			"error": null
		}
	}
}
var items = {
	name: 'items',
	assets: {
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
				"init": "component.exports = {\n\
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
}
var empty = {
	name: 'empty',
	assets: {
		"template": {
			"code": {
				"jade": "",
				"mustache": "",
				"ractive": ""
			},
			"error": null
		},
		"style": {
			"code": {
				"stylus": "",
				"css": ""
			},
			"error": null
		},
		"data": {
			"code": {
				"eval": "",
				"json": ""
			},
			"error": null
		},
		"script": {
			"code": {
				"init": "",
				"js": ""
			},
			"error": null
		}
	}
}



var config = new ConfigService()

function ConfigService() {

	var defaultPane = {
		version: '0.0.1',
		position: { x: 10, y: 50 },
		pane: {
			position: { x: 70, y: 50 },
			pane: {
				position: { x: 50, y: 50 }
			}
		}
	}

	return {
		get pane(){
			var ls = localStorage.paneConfig
			// if(!ls) {
				ls = defaultPane
			// } else {
			// 	ls = JSON.parse(ls)	
			// 	if(!ls.version) { 
			// 		ls = defaultPane 
			// 	}
			// }
			return ls
		},
		set pane(pc){
			//localStorage.paneConfig = JSON.stringify(pc)
			localStorage.project = JSON.stringify(data)
		}
	}
}


var projectData = localStorage.project
if(projectData){
	setTimeout(function(){
		console.log('loading project from localStorage')
		var data = JSON.parse(projectData),
			current = data.project.current,
			currentComp
		data.project.features.some(function(feature){
			return feature.components.some(function(component){
				if(component.name === current) { 
					currentComp = component 
					return true;
				}
			})
		})
		data.project.current = currentComp
		load(data)
	})
} else {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'data/project.json', true);
	xhr.onreadystatechange = function (aEvt) {
		if (xhr.readyState == 4) {
			if(xhr.status == 200) {
				console.log('loading default project from server')
				load(JSON.parse(xhr.responseText))
			}
			else {
				alert('failed to load project data')
			}
		}

	}
	xhr.send(null);	
}


function load(data){
	window.data = data

	var ractive,
		Component = Ractive.components.flow
	try {
		ractive = new Component({
			debug: true,
			el: document.body,
			// template: template,
			magic: true,
			data: data
		})


	} catch(error){
		document.body.innerHTML = error
	}

	window.onbeforeunload = function(){
		console.log('writing project to localStorage')
		if(ractive) { ractive.teardown() }
		var current = data.project.current.name
		delete data.project.current
		data.project.current = current
		localStorage.project = JSON.stringify(data)
	}
}


