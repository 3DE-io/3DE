var use_Ractive = (typeof Ractive==='undefined') ? require('ractive') : Ractive,
	async = require('../../util/function/sync-as-async')

module.exports = function(options){
	return async(function(template){
		var parsed = use_Ractive.parse(template, options)
	    return options.pretty 
	    	? JSON.stringify(parsed, true, 2) 
	    	: JSON.stringify(parsed)
	})
}