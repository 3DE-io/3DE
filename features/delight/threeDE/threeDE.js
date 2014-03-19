var Definition = require('definition')

component.exports = {
    init: function(){
    	var self = this,
    		project = this.findComponent('project')
        
	        project.on('componentSelect', function(component){
	        	self.set('component', component)
	        })
    }
 }