

module.exports = function Transformer(options){

	return {
	    jade: require('./jade-transform')({ 
	    	pretty: options.pretty, 
	    	compileDebug: options.debug
	    }),
	    ractive: require('./ractive-transform')({ 
	    	pretty: options.pretty, 
	    	preserveWhitespace: true 
	    }),
	    eval: require('./eval-transform')({ 
	    	pretty: options.pretty
	    }),
	    stylus: require('./stylus-transform')()
	}
}