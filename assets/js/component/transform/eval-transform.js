var async = require('../../util/function/sync-as-async')

module.exports = function(options){
	return async(function(js){
		if(!js) { return }		
		js = js.trim()
		if(!js) { return }

		try{
			var fn = new Function('return (' + js + ');')
		}
		catch(e){
			eval(js)
			throw e; //should never get here...
		}

		return options.pretty 
	    	? JSON.stringify(fn(), true, 2) 
	    	: JSON.stringify(fn()) 
	})
}