var Definition = require('definition')

component.exports = {
	beforeInit: function(options){
		var d = options.data = options.data || {}
		if(typeof d.component !== Definition) {
	        d.definition = new Definition(d.component)
		} else {
    	    d.definition = d.component   
		}
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
