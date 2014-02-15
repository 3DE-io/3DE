console.log('Ractive components', components.length)

loader.loadAll(components)

//var data=JSON.parse(localStorage.project)
			;
 //= '{"project":{"name":"project","current":{"name":"hello","assets":{"template":{"code":{"jade":"p hello {{world}}\ninput(value=\'{{world}}\')","mustache":"<p>hello {{world}}</p>\n<input value=\"{{world}}\"/>","ractive":"[\n {\n \"t\": 7,\n \"e\": \"p\",\n \"f\": [\n \"hello \",\n {\n \"t\": 2,\n \"r\": \"world\"\n }\n ]\n },\n \"\\n\",\n {\n \"t\": 7,\n \"e\": \"input\",\n \"a\": {\n \"value\": [\n {\n \"t\": 2,\n \"r\": \"world\"\n }\n ]\n }\n }\n]"},"error":null},"style":{"code":{"stylus":"p\n\tcolor: green","css":"p {\n color: #008000;\n}\n"},"error":null},"data":{"code":{"eval":"{ world: \'earth\' }","json":"{\n \"world\": \"earth\"\n}"},"error":null},"script":{"code":{"init":"","js":""},"error":null}}},"features":[{"name":"examples","components":[{"name":"hello","assets":{"template":{"code":{"jade":"p hello {{world}}\ninput(value=\'{{world}}\')","mustache":"<p>hello {{world}}</p>\n<input value=\"{{world}}\"/>","ractive":"[\n {\n \"t\": 7,\n \"e\": \"p\",\n \"f\": [\n \"hello \",\n {\n \"t\": 2,\n \"r\": \"world\"\n }\n ]\n },\n \"\\n\",\n {\n \"t\": 7,\n \"e\": \"input\",\n \"a\": {\n \"value\": [\n {\n \"t\": 2,\n \"r\": \"world\"\n }\n ]\n }\n }\n]"},"error":null},"style":{"code":{"stylus":"p\n\tcolor: green","css":"p {\n color: #008000;\n}\n"},"error":null},"data":{"code":{"eval":"{ world: \'earth\' }","json":"{\n \"world\": \"earth\"\n}"},"error":null},"script":{"code":{"init":"","js":""},"error":null}}},{"name":"items","assets":{"template":{"code":{"jade":"ul\n\t{{#items}}\n\tli {{.}}\n\t{{/items}}\ninput(value=\'{{new}}\')\nbutton(on-click=\'add:{{new}}\') add","mustache":"<ul>{{#items}}\n <li>{{.}}</li>{{/items}}\n</ul>\n<input value=\"{{new}}\"/>\n<button on-click=\"add:{{new}}\">add</button>","ractive":"[\n {\n \"t\": 7,\n \"e\": \"ul\",\n \"f\": [\n {\n \"t\": 4,\n \"r\": \"items\",\n \"f\": [\n \"\\n \",\n {\n \"t\": 7,\n \"e\": \"li\",\n \"f\": [\n {\n \"t\": 2,\n \"r\": \".\"\n }\n ]\n }\n ]\n },\n \"\\n\"\n ]\n },\n \"\\n\",\n {\n \"t\": 7,\n \"e\": \"input\",\n \"a\": {\n \"value\": [\n {\n \"t\": 2,\n \"r\": \"new\"\n }\n ]\n }\n },\n \"\\n\",\n {\n \"t\": 7,\n \"e\": \"button\",\n \"f\": \"add\",\n \"v\": {\n \"click\": {\n \"n\": \"add\",\n \"d\": [\n {\n \"t\": 2,\n \"r\": \"new\"\n }\n ]\n }\n }\n }\n]"},"error":null},"style":{"code":{"stylus":"li\n\tcolor saddlebrown\n\tfont-family fantasy","css":"li {\n color: #8b4513;\n font-family: fantasy;\n}\n"},"error":null},"data":{"code":{"eval":"{ items: [\'earth\', \'mars\',\'venus\'] }","json":"{\n \"items\": [\n \"earth\",\n \"mars\",\n \"venus\"\n ]\n}"},"error":null},"script":{"code":{"init":"component.exports = {\n\t\tinit: function(){\n\t\t\tvar items = this.data.items\n\t\t\tthis.on(\'add\', function(e, item){\n\t\t\t\tif(!item){ return }\n\t\t\t\titems.push(item)\n\t\t\t\tthis.data.new = \'\'\n\t\t\t})\n\t\t}\n\t}","js":"component.exports = {\n\t\tinit: function(){\n\t\t\tvar items = this.data.items\n\t\t\tthis.on(\'add\', function(e, item){\n\t\t\t\tif(!item){ return }\n\t\t\t\titems.push(item)\n\t\t\t\tthis.data.new = \'\'\n\t\t\t})\n\t\t}\n\t}"},"error":null}}},{"name":"empty","assets":{"template":{"code":{"jade":"","mustache":"","ractive":"[\n \"\"\n]"},"error":null},"style":{"code":{"stylus":"","css":""},"error":null},"data":{"code":{"eval":""},"error":null},"script":{"code":{"init":"","js":""},"error":null}}}]}]},"pane":{"version":"0.0.1","position":{"x":10,"y":50},"pane":{"position":{"x":70,"y":50},"pane":{"position":{"x":50,"y":50}}}}}'

var data = {}
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

data.project = {
	name: 'project',
	current: hello,
	features: [{
		name: 'examples',
		components: [hello,items, empty]
	}]
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

data.pane = config.pane


var projectData = localStorage.project
if(projectData){
	setTimeout(function(){
		console.log('loading project from localStorage')
		load(JSON.parse(projectData))
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


var project
function load(data){
	project = data

	var Component = Ractive.components.flow
	try {
		var ractive = new Component({
			debug: true,
			el: document.body,
			// template: template,
			magic: true,
			data: project
		})


	} catch(error){
		document.body.innerHTML = error
	}
}

window.onbeforeunload = function(){
	config.pane = data.pane
	localStorage.project = JSON.stringify(project)
}
