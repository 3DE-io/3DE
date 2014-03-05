var empty = JSON.stringify({
	"template": [
	  {
		"name": "jade"
	  },
	  {
		"name": "mustache",
		"process": "ractive"
	  },
	  {
		"name": "ractive",
		"mode": "json"
	  }
	],
	"style": [
	  {
		"name": "stylus"
	  },
	  {
		"name": "css"
	  }
	],
	"data": [
	  {
		"name": "js",
		"process": "eval"
	  },
	  {
		"name": "json"
	  }
	],
	"script": [
	  {
		"name": "init",
		"mode": "js"
	  }
	]
})

var Definition = require('definition')

component.exports = (function(){

	function fillDefaults(comp){
		var defaultSections
		function fill(part){
			if(!comp[part]){
				if(!defaultSections){ defaultSections = JSON.parse(empty)}
				comp[part] = defaultSections[part]
			}        
		}
		['template', 'style', 'data', 'script'].forEach(fill)
		
	}

	return {
		beforeInit: function(options){
			var d = options.data = options.data || {}
				if(!d.componentData) {
				d.componentData = {}
			}
				
		  fillDefaults(d.componentData)
		  d.definition = new Definition(d.componentData)
		},
		init: function(){
			var editors = this.findAllComponents('editors'),
				preview = this.findAllComponents('preview')[0],
				noLive = {}

			this.observe('config.*.noLiveRefresh', function(value, o, keypath){
			    var section = keypath.split('.')[1]
			    noLive[section] = value
			})
 
            this.data.definition.component.on('change', function(section){
            	if(noLive[section]) { return }
                preview.update(section)
            })

            editors.forEach(function(editor){
            	editor.on('refreshRequested', function(){
            		preview.reload()
            	})
            })

		}
	}
})()