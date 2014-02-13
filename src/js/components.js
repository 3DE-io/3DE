var components = [
{
	name: 'component',
	template: [{"t":7,"e":"pane","f":[{"t":7,"e":"pane","f":[{"t":7,"e":"template","a":{"component":[{"t":2,"r":"component"}]}}]},{"t":7,"e":"pane","f":[{"t":7,"e":"styling","a":{"component":[{"t":2,"r":"component"}]}}]},{"t":7,"e":"pane","f":[{"t":7,"e":"datum","a":{"component":[{"t":2,"r":"component"}]}}]},{"t":7,"e":"pane","f":[{"t":7,"e":"scripting","a":{"component":[{"t":2,"r":"component"}]}}]},{"t":7,"e":"sizer"}]},{"t":7,"e":"pane","f":[{"t":7,"e":"preview","a":{"component":[{"t":2,"r":"component"}]}}]},{"t":7,"e":"sizer","a":{"orientation":"horizontal"}}],
	init: function(component, Ractive) {
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
	},
},
{
	name: 'data',
	template: [{"t":7,"e":"part","a":{"component":[{"t":2,"r":"current"}],"type":"data"}}],
	init: function(component, Ractive) {
		
	},
},
{
	name: 'datum',
	template: [{"t":7,"e":"part","a":{"component":[{"t":2,"r":"component"}],"type":"data"}}],
	init: function(component, Ractive) {
		
	},
},
{
	name: 'editor',
	template: [{"t":7,"e":"div","a":{"class":"editor-control"},"f":[{"t":2,"r":"code"}]}],
	init: function(component, Ractive) {
		

//themelist.toCss = function(theme){
//  return 'ace-' + theme.replace(/_/g, '-')
//}


component.exports = {
    init: function(){
        var node = this.find('.editor-control'),
            data = this.data

        this.editor = this.createEditor(node, data)
    },    
    reset: function(){
        if(!this.editor) { return }
        this.editor.reset()
    },
    teardown: function(){
        if(!this.editor) { return }
        this.editor.teardown()  
    },
    createEditor: function(node, data){ 
        var e = ace.edit(node)

        var modes = ace.require('ace/ext/modelist')
        var mode = modes.getModeForPath('.' + data.language).mode
        var s = e.getSession()
        s.setMode(mode)
        
        var setting, getting
            ractive = this
        
        ractive.observe('code', function(v){
            if(getting) return;
            setting = true
            e.setValue(v)
            e.clearSelection()
            setting = false
        }, {init: false })
            
        e.on('change', function(){
            if(setting) return;
            getting = true
            data.code = e.getValue()
            //ractive.set('code', e.getValue())
            getting = false
        })
        
        var themelist = ace.require("ace/ext/themelist")  
        function setTheme(theme, oldTheme){
            //this check should be in config.theme
            if(theme && !themelist.themesByName[theme]){
                console.warn('no theme', theme)
                theme = oldTheme
            }
            theme = theme || 'merbivore_soft'
            var full = themelist.themesByName[theme]
            e.setTheme(full.theme)        
        }
        ractive.observe('config.theme', setTheme)
        ractive.observe('config.tab', function(i){
            s.setTabSize(i)
        })
        ractive.observe('config.gutter', function(b){
            e.renderer.setShowGutter(b)
        })
        ractive.observe('config.softTab', function(b){
            s.setUseSoftTabs(b)
        })
        ractive.observe('config.highlightLine', function(b){ 
            e.setHighlightActiveLine(b);
        })
        ractive.observe('config.invisibles', function(b){ 
            e.setShowInvisibles(b);
        })
        ractive.observe('config.indentGuides', function(b){ 
            e.setDisplayIndentGuides(b);
        })
        ractive.observe('config.fadeFold', function(b){ 
            e.setDisplayIndentGuides(b);
        })
        ractive.observe('config.scrollPastEnd', function(b){ 
            e.setOption("scrollPastEnd", b);
        })

        resize()
        
        function resize(){
            e.resize()
        }
        function teardown(){
            e.destroy()
        }
        function reset(){
            //ace bug: https://github.com/ajaxorg/ace/issues/1243
            //s.getUndoManager().reset()
            setting = true
            s.setValue(e.getValue(), -1)
            e.clearSelection()
            setting = false
        }
        
        return {
            teardown: teardown,
            resize: resize,
            reset: reset,
            language: data.language
        }
    }
}

	},
},
{
	name: 'editors',
	template: [{"t":7,"e":"div","a":{"class":"editors"},"f":[{"t":4,"r":"section","f":["\n",{"t":7,"e":"settings","a":{"tabs":[{"t":2,"r":"code"}],"selected":[{"t":2,"r":"config.selected"}],"error":[{"t":2,"r":"error.location"}]}},{"t":7,"e":"div","a":{"class":"editor-container"},"f":[{"t":4,"r":"code","i":"language","f":["\n",{"t":7,"e":"div","a":{"style":[{"t":4,"x":{"r":["config.selected","language"],"s":"${0}!==${1}"},"f":" visibility: none; z-index: -1; "}],"class":"editor"},"f":[{"t":7,"e":"editor","a":{"language":[{"t":2,"r":"language"}],"code":[{"t":2,"r":"."}],"config":[{"t":2,"x":{"r":["language","title","config"],"s":"${2}[${1}][${0}]"}}]}}]}]},"\n"]},{"t":7,"e":"error"}]},"\n"]}],
	init: function(component, Ractive) {
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

	},
},
{
	name: 'error',
	template: [{"t":4,"r":"error","f":["\n",{"t":7,"e":"pre","a":{"class":"error"},"f":[{"t":2,"r":"location"}," error: ",{"t":2,"r":"message"},"\n"]}]},"\n"],
	init: function(component, Ractive) {
		
	},
},
{
	name: 'flow',
	template: [{"t":7,"e":"pane","f":[{"t":7,"e":"project","a":{"project":[{"t":2,"r":"project"}]}}]},{"t":7,"e":"pane","f":[{"t":7,"e":"component","a":{"component":[{"t":2,"r":"project.current"}]}}]},{"t":7,"e":"sizer","a":{"orientation":"horizontal"}}],
	init: function(component, Ractive) {
		
	},
},
{
	name: 'pane',
	template: [{"t":4,"r":"pane","f":["\n",{"t":7,"e":"pane-node","a":{"style":[" right: ",{"t":2,"x":{"r":[".position.x"],"s":"100-${0}"}},"%; bottom: ",{"t":2,"x":{"r":[".position.y"],"s":"100-${0}"}},"%; left: ",{"t":2,"r":".position.x"},"%; top: ",{"t":2,"r":".position.y"},"%;"]},"f":[{"t":7,"e":"div","a":{"class":"pane-inner"},"f":[{"t":8,"r":"content"},"\n"]}]}]},"\n"],
	init: function(component, Ractive) {
		var defaultPosition = { position: { x:50, y:50 } }

component.exports = {
    debug: true,
    setContext: function(pane){
        if(!this.data.pane){
            console.log('no pane')
            return
        }
        return this.data.pane

    },
    getIndex: function(pane){
        var node = this.find('pane-node')
        if(!node){
            console.log('no node :(')
            return
        }
        var all = node.parentNode.children,
            myIndex = Array.prototype.indexOf.call(all, node);
            
        console.log('index is', myIndex)
        return myIndex

    },
    beforeInit: function(o){
       
    }
}
	},
},
{
	name: 'pane-invoke',
	template: [{"t":7,"e":"pane","f":[{"t":7,"e":"pane","f":"<div class=color></div>"},{"t":7,"e":"pane","f":"<div class=color></div>"},{"t":7,"e":"pane","f":"<div class=color></div>"},{"t":7,"e":"pane","f":"<div class=color></div>"},{"t":7,"e":"sizer"}]},{"t":7,"e":"pane","f":"<p>hello world</p>"},{"t":7,"e":"sizer","a":{"orientation":"horizontal"}}],
	init: function(component, Ractive) {
		
	},
},
{
	name: 'part',
	template: [{"t":7,"e":"editors","a":{"title":[{"t":2,"r":"type"}],"section":[{"t":2,"x":{"r":["type","component.assets"],"s":"${1}[${0}]"}}]}}],
	init: function(component, Ractive) {
		component.exports = {
    beforeInit: function(o){
        var d = o.data,
            component = d.component, 
            err
        
        if(!d.type) {
            err = 'type must be specifed'
        } else if(!component.assets) {
            err = 'component data must exist'
        } else if(!component.assets[d.type]) {
            err = 'component.' + d.type + ' not found'
        }
         
        if(err) {
            throw 'part component: ' + err
        }
    }
}
	},
},
{
	name: 'preview',
	template: ["<div class=preview><iframe name=newpreview seamless=seamless src=layout.html></iframe></div>"],
	init: function(component, Ractive) {
		component.exports =  {
    complete: function(){
        var assets = this.data.component.assets
       

        var ractive = this
    
        //var preview = this.find('.preview')
        //ifrm = document.createElement("IFRAME"); 
       	//ifrm.setAttribute("name", "preview");
	   	//ifrm.setAttribute("class", "preview"); 
	   	//preview.appendChild(ifrm); 
        var ifrm = this.find('iframe')
        ifrm.onload = function(){
            
            var iwin = ifrm.contentWindow,
                doc = iwin.document,
                component
            
            if(assets) {
                component = {
                    template: assets.template.code.ractive,
                    css: assets.style.code.css,
                    data: assets.data.code.json,
                    init: assets.script.code.init 
                }
            }

            iwin.postMessage(component, '*')

            ractive.observe('component.assets.style.code.css', function(css){
                iwin.postMessage({ css: css }, '*')
            })
            ractive.observe('component.assets.data.code.json', function(data){
                iwin.postMessage({ data: data }, '*')
            })
            ractive.observe('component.assets.template.code.ractive', function(template){
                iwin.postMessage({ template: template }, '*')
            })
            ractive.observe('component.assets.script.code.init', function(init){
                iwin.postMessage({ init: init }, '*')
            })

            

        }
        


    	

    },
    beforeInit: function(o){
        // console.log('preview data', o.data)
    }
}

	},
},
{
	name: 'preview-adapt',
	template: [{"t":4,"r":"component","f":["\n",{"t":7,"e":"p","f":[{"t":2,"r":"template.ractive"}]},{"t":7,"e":"preview","a":{"ractive":[{"t":2,"r":"template.ractive"}],"css":[{"t":2,"r":"style.css"}],"json":[{"t":2,"r":"data.json"}],"js":[{"t":2,"r":"style.js"}]}}]},"\n"],
	init: function(component, Ractive) {
		
	},
},
{
	name: 'project',
	template: [{"t":7,"e":"div","a":{"class":"project"},"f":[{"t":7,"e":"div","a":{"class":"dflux"},"f":"d<span>flux</span>"},{"t":7,"e":"ul","a":{"class":"components"},"f":[{"t":4,"r":"project","f":["\n",{"t":4,"r":"components","i":"i","f":[{"t":7,"e":"li","a":{"class":[{"t":4,"x":{"r":[".name","project.current.name"],"s":"${0}===${1}"},"f":"selected"}]},"f":[{"t":2,"r":"name"}],"v":{"click":"select"}}]},"\n",{"t":7,"e":"li","f":[{"t":7,"e":"input","a":{"value":[{"t":2,"r":"new"}]},"v":{"enter_kp":{"n":"add","d":[{"t":2,"r":"new"}]}}}]}]},"\n"]}]}],
	init: function(component, Ractive) {
		component.exports = {
    magic: true,
    init: function(){
        var r = this,
            project = r.data.project
        this.on('select', function(e){
            project.current = e.context
        })
        this.on('add', function(e, item){
            if(!item || !item.trim() ) { return }
            item = item.replace(/ /g, '-')
            var component = {
                name: item
            }
            r.data.new = ''
            document.activeElement.blur()
            e.context.current = component
            e.context.components.push(component)
        })
    },
    events: {
        enter_kp: function(node, fire){
            node.addEventListener('keypress', function(e){
                if(e.which===13){ fire({
                    node: node
                })}
            })
        }
    }
}
	},
},
{
	name: 'scripting',
	template: [{"t":7,"e":"part","a":{"component":[{"t":2,"r":"component"}],"type":"script"}}],
	init: function(component, Ractive) {
		
	},
},
{
	name: 'settings',
	template: [{"t":7,"e":"div","a":{"force":[{"t":2,"x":{"r":["error"],"s":"!!${0}"}}],"class":"settings"},"f":[{"t":7,"e":"div","a":{"class":"set-box"},"f":[{"t":7,"e":"div","a":{"class":"gear"},"f":"&#x2699;"},{"t":7,"e":"div","a":{"class":"title"},"f":[{"t":2,"r":"title"}]},{"t":7,"e":"div","a":{"class":"tabs"},"f":[{"t":4,"r":"tabs","i":"code","f":["\n",{"t":7,"e":"label","a":{"selected":[{"t":2,"x":{"r":["code","selected"],"s":"${0}===${1}"}}],"error":[{"t":2,"x":{"r":["code","error"],"s":"${0}===${1}"}}]},"f":[{"t":2,"r":"code"},{"t":7,"e":"input","a":{"type":"radio","name":[{"t":2,"r":"selected"}],"value":[{"t":2,"r":"code"}]}}]}]},"\n"]}]}]}],
	init: function(component, Ractive) {
		
	},
},
{
	name: 'sizer',
	template: [{"t":4,"r":"pane","f":["\n",{"t":7,"e":"div","a":{"style":["top: ",{"t":2,"x":{"r":[".position.y"],"s":"${0}||50"}},"%; left: ",{"t":2,"x":{"r":[".position.x"],"s":"${0}||50"}},"%;"],"class":["sizer orientation-",{"t":2,"r":"orientation"}]}}]},"\n"],
	init: function(component, Ractive) {
		component.exports = {
    data: {
        "orientation": 'both'
    },
    init: function(o){
        var node = this.find('.sizer'),
            data = this.data,
            position = data.pane.position,
            orientation = data.orientation
        this.moveable(node, position, orientation)
    },
    moveable: function(node, position, orientation, noRAF){

        var ractive = this,
            direction = {
                x: orientation!=='vertical',
                y: orientation!=='horizontal'
            },
            MoveEvents = require('move'),
            events = new MoveEvents(node, {
                start: start,
                move: move,
                end: end
            }),
            original, total, buffer
        
        function start(){
            
            node.classList.add('moving')
            document.body.style.pointerEvents = 'none'
            
            var parent = node.parentNode
            total = { 
                x: parent.clientWidth, 
                y: parent.clientHeight
            }
            
            buffer = {
                x: node.offsetWidth*.5/total.x,
                y: node.offsetHeight*.5/total.y
            }
            
            original = { x: position.x, y: position.y }
        }

        function move(delta){
            _ticking = false
            
            var asPercent = {
                x: delta.x/total.x*100,
                y: delta.y/total.y*100,
            } 
            var moveTo = {
                x: original.x + asPercent.x,
                y: original.y + asPercent.y
            }
            
            moveTo.x = Math.max(moveTo.x, buffer.x)
            moveTo.x = Math.min(moveTo.x, 100-buffer.x)
            moveTo.y = Math.max(moveTo.y, buffer.y)
            moveTo.y = Math.min(moveTo.y, 100-buffer.y)

            //console.log(moveTo.x, moveTo.y)
            if(direction.x){
                ractive.set('pane.position.x', moveTo.x )
                //position.x = moveTo.x
            }
            if(direction.y){
                ractive.set('pane.position.y', moveTo.y )
                //position.y = moveTo.y
            }
        }
        
        function end(){
            node.classList.remove('moving')
            document.body.style.pointerEvents = null
        }
        
        function teardown(){
            events.stop()
        }  
        
        this.teardown = teardown
    }
}

	},
},
{
	name: 'styling',
	template: [{"t":7,"e":"part","a":{"component":[{"t":2,"r":"component"}],"type":"style"}}],
	init: function(component, Ractive) {
		
	},
},
{
	name: 'template',
	template: [{"t":7,"e":"part","a":{"component":[{"t":2,"r":"component"}],"type":"template"}}],
	init: function(component, Ractive) {
		
	},
},
]