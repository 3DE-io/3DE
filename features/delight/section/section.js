component.exports =  {
    complete: function(){
        var data = this.data,
            ractive = this
            
        function observe(from, to, fn){
            if(typeof data.sections[to] === 'undefined') return;
            
            ractive.observe('sections.' + from, transform())
            
            function transform(){
                return function(value){
                    try {
                        var start = new Date()
                        var transformed = fn(value)
                        ractive.set('sections.' + to, transformed)
                        if(data.error && data.error.location===from){
                            ractive.set('error', null)
                        }
                        console.log('transform', from, 'to', to, new Date()-start, 'ms')
                    }
                    catch(e)
                    {
                        console.warn(from, 'to', to, 'err', e)
                        ractive.set('error', {
                            location: from,
                            message: e
                        })
                    }
                }
            }
        }
        observe('jade', 'mustache', function(j){
            return jade.render(j, { pretty: true,
                    compileDebug: true}).trim()
        })
        observe('mustache', 'ractive', function(m){
            var parsed = Ractive.parse(m, 
        		{ preserveWhitespace: true })
    		return JSON.stringify(parsed, true, 2)
        })
        observe('eval', 'json', function(js){
            var code = js.trim(),
                result
	        if(code!==''){
                try{
	                var fn = new Function('return (' + code + ');')
                }
                catch(e){
                    eval(code)
                }
	            result = JSON.stringify(fn(), true, 2) 
	         }
             return result
        })       

        observe('stylus', 'css', function(s, t){
            var result
			stylus(s).render(function(e, r){
				if(e) { throw e }
			    result = r
			})
			return result
        })
    },
    beforeInit: function(o){
        if(!o.data.selected){
            var first = Object.keys(o.data.sections)[0]
            o.data.selected = first
        }
    }
}
