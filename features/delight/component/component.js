var Definition = require('definition')

component.exports = {
	magic: true,
	beforeInit: function(options){
		var d = options.data = options.data || {}
		if(typeof d.component !== Definition) {
	        d.definition = new Definition(d.component)
		} else {
    	    d.definition = d.component   
		}
	},
	init: function(){
		var self = this,
			editors = this.findAllComponents('editors'),
			preview = this.findAllComponents('preview')[0],
			noLive = {}

		// this.observe('component', function(component){
			
		// })

		this.observe('', function(n,o){
			if(n===o) { return }

			console.log('component change from', o ? o.name : '', 'to', n ? n.name : '')

			self.data.definition = n
		}, {init: false})

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
