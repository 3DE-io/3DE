var empty = JSON.stringify({
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
			"js": "",
			"init": ""
		},
		"error": null
	}
})
component.exports = (function(){

	function validate(comp){
		if(!comp){
        	throw 'Data "component" must be provided'
        }
        if(!comp.name) { 
            throw 'Component must be named with property "name"'
        }
        if(!comp.assets){
            comp.assets = JSON.parse(empty)
        }        
	}

	return {
		beforeInit: function(options){
			validate(options.data.component)
		},
		init: function(){
			this.observe('component', validate)
		}
	}
})()