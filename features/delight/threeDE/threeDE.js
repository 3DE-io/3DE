var Definition = require('definition')

component.exports = {
    init: function(){
    	var self = this,
    		project = this.findComponent('project')
        
	        project.on('componentSelect', function(component){
	        	// if(typeof component !== Definition) {
	        	// 	component = new Definition({ name: component.name } )
	        	// }
	        	self.set('component', component)
	        })
    }
 }