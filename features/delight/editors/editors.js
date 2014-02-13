component.exports =  {
    init: function(){
        var ractive = this,
            d = this.data,
            section = d.section
            
        this.observe('section', function(s){
            ractive.findAllComponents('editor').forEach(function(editor){
                editor.reset()
            })
        }, { init: false })
            
        function observe(from, to, fn){
            if(typeof section.code[to] === 'undefined') return;
            
            ractive.observe('section.code.' + from, transform())
            
            function transform(){
                return function(value){
                    fn(value, function(err, result){
                        if(err){
                            // ractive.set('section.error', {
                            //     location: from,
                            //     message: err
                            // })
                            section.error = {
                                location: from,
                                message: err
                            }
                            return;                              
                        }
                            
                        //ractive.set('section.code.' + to, result)
                        section.code[to] = result

                        if(section.error && section.error.location===from){
                            //ractive.set('section.error', null)
                            section.error = null
                        }

                    })

                    // try {
                    //     var start = new Date()
                    //     var transformed = fn(value)
                    //     ractive.set('section.code.' + to, transformed)
                    //     if(section.error && section.error.location===from){
                    //         ractive.set('section.error', null)
                    //     }
                    //     //console.log('transform', value, 'to', transformed, new Date()-start, 'ms')
                    // }
                    // catch(e)
                    // {
                    //     console.warn(from, 'to', to, 'err', e)
                    //     ractive.set('section.error', {
                    //         location: from,
                    //         message: e
                    //     })
                    // }
                    
                }
            }
        }
        function async(fn){
            return function(value, cb){
                setTimeout(function(){
                    try {
                        var result = fn(value)
                        cb(null, result)
                    }
                    catch(e){
                        cb(e)
                    }
                })
            }
        }

        observe('jade', 'mustache', async(function(j){
            return jade.render(j, { pretty: true, compileDebug: true}).trim()
        }))

        observe('mustache', 'ractive', async(function(m){
            var parsed = Ractive.parse(m, { preserveWhitespace: true })
        	return JSON.stringify(parsed, true, 2)
        }))
        observe('eval', 'json', async(function(js){
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
        }))   

        observe('stylus', 'css', function(s, cb){
            stylus(s).render(cb)
        })
        
        observe('js', 'init', async(function(js){
            eval(js)
            return js
        })) 
    },
    beforeInit: function(o){
        var config = o.data.config,
            section = o.data.section
            
        if(!o.data.config){ o.data.config = {} }
        if(!o.data.config.selected){
            var first = Object.keys(section.code)[0]
            o.data.config.selected = first
        }


    }
}
