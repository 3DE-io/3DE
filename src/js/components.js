var components = [
{
	name: 'data',
	template: [{"t":7,"e":"part","a":{"component":[{"t":2,"r":"component"}],"type":"data"}}],
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
	template: [{"t":7,"e":"div","a":{"class":"editor-control"},"f":[{"t":2,"r":"code"}],"o":{"n":"editor","d":[" ",{"t":2,"r":"language"},", ",{"t":2,"r":"code"},", ",{"t":2,"r":"config"}]}}],
	init: function(component, Ractive) {
		var themelist = require("ace/ext/themelist")  
themelist.toCss = function(theme){
    return 'ace-' + theme.replace(/_/g, '-')
}
var modes = ace.require('ace/ext/modelist')
//var Editor = ace.require('./editor')

component.exports = {
    decorators: { editor: editor },
    complete: function(){
    }
}

function editor(node, language, code, config){  
    var e = ace.edit(node)

    var mode = modes.getModeForPath('.' + language).mode
    var s = e.getSession()
    s.setMode(mode)
    
    var setting, getting, ractive = this;
    
    ractive.observe('code', function(v){
        if(getting) return;
        setting = true
        e.setValue(v)
        setting = false
    }, {init: false })
        
    e.on('change', function(){
        if(setting) return;
        getting = true
        ractive.set('code', e.getValue())
        getting = false
    })
    
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
    
        
    e.resize()
    return { teardown: function () {} }
}

	},
},
{
	name: 'editors',
	template: [{"t":7,"e":"div","a":{"class":"editors"},"f":[{"t":4,"r":"section","f":["\n",{"t":7,"e":"settings","a":{"tabs":[{"t":2,"r":"code"}],"selected":[{"t":2,"r":"selected"}],"error":[{"t":2,"r":"error.location"}]}},{"t":7,"e":"div","a":{"class":"editor-container"},"f":[{"t":4,"r":"code","i":"language","f":["\n",{"t":7,"e":"div","a":{"style":[{"t":2,"x":{"r":["selected","language"],"s":"${0}!==${1}?'visibility: none; z-index: -1;':''"}}],"class":"editor"},"f":[{"t":7,"e":"editor","a":{"language":[{"t":2,"r":"language"}],"code":[{"t":2,"r":"."}],"config":[{"t":2,"x":{"r":["language","title","config"],"s":"${2}[${1}][${0}]"}}]}}]}]}]},{"t":7,"e":"error"}]}]}],
	init: function(component, Ractive) {
		component.exports =  {
    complete: function(){
        var section = this.data.section,
            ractive = this
            
        function observe(from, to, fn){
            if(typeof section.code[to] === 'undefined') return;
            
            ractive.observe('section.code.' + from, transform())
            
            function transform(){
                return function(value){
                    fn(value, function(err, result){
                        if(err){
                            //console.warn(from, 'to', to, 'err', err)
                            ractive.set('section.error', {
                                location: from,
                                message: err
                            })  
                            return;                              
                        }

                        ractive.set('section.code.' + to, result)
                        
                        if(section.error && section.error.location===from){
                            ractive.set('section.error', null)
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
        	return JSON.stringify(parsed) //, true, 2)
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
    },
    beforeInit: function(o){
        var section = o.data.section
        if(!section.selected){
            var first = Object.keys(section.code)[0]
            section.selected = first
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
	template: [{"t":7,"e":"pane","f":[{"t":7,"e":"pane","f":[{"t":7,"e":"template"}]},{"t":7,"e":"pane","f":[{"t":7,"e":"styling"}]},{"t":7,"e":"pane","f":[{"t":7,"e":"datum"}]},{"t":7,"e":"pane","f":[{"t":7,"e":"scripting"}]},{"t":7,"e":"sizer"}]},{"t":7,"e":"pane","f":[{"t":7,"e":"preview","a":{"component":[{"t":2,"r":"component"}]}}]},{"t":7,"e":"sizer","a":{"orientation":"horizontal"}}],
	init: function(component, Ractive) {
		component.exports = {
    magic: false,
}
	},
},
{
	name: 'pane',
	template: [{"t":4,"r":"pane","f":["\n",{"t":7,"e":"pane-node","a":{"style":[{"t":2,"x":{"r":["ignore",".position"],"s":"${0}(${1})"}},"; right: ",{"t":2,"x":{"r":[".position.x"],"s":"100-${0}"}},"%; bottom: ",{"t":2,"x":{"r":[".position.y"],"s":"100-${0}"}},"%; left: ",{"t":2,"r":".position.x"},"%; top: ",{"t":2,"r":".position.y"},"%;"]},"f":[{"t":7,"e":"div","a":{"class":"pane-inner"},"f":[{"t":8,"r":"content"}]}]}]},"\n"],
	init: function(component, Ractive) {
		component.exports = {
    magic: false,
    data: {
        ignore: function(ignored){
            //Ractive bug if position property
            //is not 'encountered'
        }
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
	template: [{"t":7,"e":"editors","a":{"title":[{"t":2,"r":"type"}],"section":[{"t":2,"x":{"r":["type","component"],"s":"${1}[${0}]"}}]}}],
	init: function(component, Ractive) {
		component.exports = {
    beforeInit: function(o){
        var d = o.data, err
        if(!d.type) {
            err = 'type must be specifed'
        } else if(!d.component) {
            err = 'component data must exist'
        } else if(!d.component[d.type]) {
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
	template: [{"t":7,"e":"div","a":{"class":"preview"},"f":"<iframe name=newpreview seamless=seamless src=layout.html></iframe>","v":{"click":"writeIt"}}],
	init: function(component, Ractive) {
		component.exports =  {
    complete: function(){
        var c = this.data.component,
            component = {
                template: c.template.code.ractive,
                css: c.style.code.css,
                data: c.data.code.json,
                init: c.script.code.js 
            }
            
        var html
        try{
            html = jade.render(layout, component)
        } catch(e){
            html = e.message
        }
        
        var ractive = this
    
        //var preview = this.find('.preview')
        //ifrm = document.createElement("IFRAME"); 
       	//ifrm.setAttribute("name", "preview");
	   	//ifrm.setAttribute("class", "preview"); 
	   	//preview.appendChild(ifrm); 
        var ifrm = this.find('iframe')
        ifrm.onload = function(){
            
            var iwin = ifrm.contentWindow,
                doc = iwin.document
            
            
            // try {
            // doc.open()
            // doc.write(html)
            // doc.close()
            // }
            // catch(e){
            //     console.log('write err', e)
            // }

            iwin.postMessage(component, '*')

            ractive.observe('component.style.code.css', function(css){
                iwin.postMessage({ css: css }, '*')
            })
            ractive.observe('component.data.code.json', function(data){
                iwin.postMessage({ data: data }, '*')
            })
            ractive.observe('component.template.code.ractive', function(template){
                iwin.postMessage({ template: template }, '*')
            })
            ractive.observe('component.script.code.js', function(init){
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
	name: 'scripting',
	template: [{"t":7,"e":"part","a":{"component":[{"t":2,"r":"component"}],"type":"script"}}],
	init: function(component, Ractive) {
		
	},
},
{
	name: 'settings',
	template: [{"t":7,"e":"div","a":{"force":[{"t":2,"x":{"r":["error"],"s":"!!${0}"}}],"class":"settings"},"f":[{"t":7,"e":"div","a":{"class":"set-box"},"f":[{"t":7,"e":"div","a":{"class":"gear"},"f":"&#x2699;"},{"t":7,"e":"div","a":{"class":"title"},"f":[{"t":2,"r":"title"}]},{"t":7,"e":"div","a":{"class":"tabs"},"f":[{"t":4,"r":"tabs","i":"code","f":["\n",{"t":7,"e":"label","a":{"selected":[{"t":2,"x":{"r":["code","selected"],"s":"${0}===${1}"}}],"error":[{"t":2,"x":{"r":["code","error"],"s":"${0}===${1}"}}]},"f":[{"t":2,"r":"code"},{"t":7,"e":"input","a":{"type":"radio","name":[{"t":2,"r":"selected"}],"value":[{"t":2,"r":"code"}]}}]}]}]}]}]}],
	init: function(component, Ractive) {
		
	},
},
{
	name: 'sizer',
	template: [{"t":4,"r":"pane","f":["\n",{"t":7,"e":"div","a":{"style":["top: ",{"t":2,"x":{"r":[".position.y"],"s":"${0}||50"}},"%; left: ",{"t":2,"x":{"r":[".position.x"],"s":"${0}||50"}},"%;"],"class":["sizer orientation-",{"t":2,"r":"orientation"}]},"f":[{"t":2,"x":{"r":["ignore",".position"],"s":"${0}(${1})"}}],"o":{"n":"moveable","d":[" ",{"t":2,"r":".position"},", ",{"t":2,"r":"orientation"}]}}]},"\n"],
	init: function(component, Ractive) {
		component.exports = {
    magic: false,
    decorators: {
        moveable: moveable
    },
    data: {
        ignore: function(ignored){
            //Ractive bug if position property
            //is not 'encountered'
        },
        "orientation": 'both'
    }
}

var rAF = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (cb) { window.setTimeout(cb, 1000 / 60) }
var cAF = window.cancelAnimationFrame        ||
        window.webkitCancelAnimationFrame        ||
        function (index) { clearTimeout(index); };

function moveable(node, position, orientation, noRAF){

    
    var ractive = this,
        //using RAF as default...
        doMove = noRAF ? _move : _rAFMove
        direction = {
            x: orientation!=='vertical',
            y: orientation!=='horizontal'
        }
        
    function events(target, event, fn){
        return {
            start: function() {  
                target.addEventListener(event, fn)
            },
            stop: function() { 
                target.removeEventListener(event, fn)
            }
        }
    }
    var dragstart = events(node, 'mousedown', start),
        drag = events(document, 'mousemove', move),
        /* need to listen on both document and top-most window */
        doc = events(document, 'mouseup', end),
        win = events(window.top, 'mouseup', end),
        dragend = {
            start: function(){ doc.start(); win.start() },
            stop: function(){ doc.stop(); win.stop() }
        } 
        
    dragstart.start()

    function current(e){
        return { x: e.x, y: e.y } 
    }
    
    var original, begin, total, buffer
    
    function start(e){
        e.preventDefault()
        
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
        begin = current(e)
        
        dragstart.stop()
        drag.start()
        dragend.start() 
    }

    var _current, _index, _ticking = false
    
    function move(e){
        _current = current(e)
        doMove()
    }
    
    function _rAFMove(e){
        if(!_ticking) {
            _index = rAF(_move)
        }
        _ticking = true        
    }
    
    function _move(e){
        _ticking = false
        
        var delta = {
            x: _current.x - begin.x,
            y: _current.y - begin.y
        }
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
        teardown()
        dragstart.start()
    }
    
    function teardown(){
        cAF(_index)
        _ticking = false
        if(dragend) dragend.stop()
        if(drag) drag.stop()
        if(dragstart) dragstart.stop()
    }  
    
    return { teardown: teardown }
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