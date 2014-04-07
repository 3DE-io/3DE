var components = [
{
	name: 'component',
	template: [{"t":7,"e":"pane","f":[{"t":7,"e":"pane","f":[{"t":7,"e":"template"}]},{"t":7,"e":"pane","f":[{"t":7,"e":"styling"}]},{"t":7,"e":"pane","f":[{"t":7,"e":"datum"}]},{"t":7,"e":"pane","f":[{"t":7,"e":"scripting"}]},{"t":7,"e":"sizer"}]},{"t":7,"e":"pane","f":[{"t":7,"e":"preview","a":{"component":[{"t":2,"r":"definition.component"}],"project":[{"t":2,"r":"project"}]}}]},{"t":7,"e":"sizer","a":{"orientation":"horizontal"}}],
	init: function(component, Ractive) {
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

	},
},
{
	name: 'datum',
	template: [{"t":7,"e":"part","a":{"type":"data","allconfig":[{"t":2,"r":"config"}],"defaultConfig":[{"t":2,"r":"defaultConfig"}]}}],
	init: function(component, Ractive) {
		var config = {
    "theme": "ace/theme/merbivore_soft",
    "gutter": false,
    "tab": 2,
    "softTab": false,
    "highlightLine": false,
    "invisibles": false,
    "indentGuides": true,
    "fadeFold": true,
    "scrollPastEnd": true
}

component.exports = {
    data: {
        defaultConfig: config 
    }
}

	},
},
{
	name: 'editor',
	template: [{"t":4,"r":"resource","f":["\n",{"t":7,"e":"div","a":{"class":"editor-control"},"f":[{"t":2,"r":".code"}],"v":{"keydown":"keypress"}}]},"\n"],
	init: function(component, Ractive) {
		//save for later...

//themelist.toCss = function(theme){
//  return 'ace-' + theme.replace(/_/g, '-')
//}

var modes = ace.require('ace/ext/modelist')
component.exports = {
    magic: true,
    init: function(){
        var r = this,
            node = r.find('.editor-control')
        this.editor = this.createEditor(node, this.data.resource)
        this.on('keypress', function(event){
            var e = event.original
            if(e.ctrlKey && e.which === 13) {
                e.preventDefault()
		        r.fire('refreshRequest')
		    }
            
        })
    
    },    
    reset: function(){
        if(!this.editor) { return }
        this.editor.reset()
    },
    teardown: function(){
        if(this.editor) { 
            this.editor.teardown() 
        }
        this._super()
    },
    createEditor: function(node, step){ 
        var e = ace.edit(node),
            mode = modes.getModeForPath('.' + step.mode).mode,
            s = e.getSession(),
            setting, getting,
            ractive = this
        
        s.setMode(mode)

        ractive.observe('resource.code', function(v){
            if(getting) return;
            setting = true
            e.setValue(v)
            e.clearSelection()
            setting = false
        }, { init: false })
            
        e.on('change', function(){
            if(setting) return;
            getting = true
            step.code = e.getValue()
            ractive.fire('codeChange')
            getting = false
        })
        

        ractive.observe('config.theme', function(t){
            e.setTheme(t)   
        })
        ractive.observe('config.tab', function(i){
            s.setTabSize(i)
        })

        // ace-bug:  https://github.com/ajaxorg/ace/issues/1825
        // .setShowGutter must be first set to true to be changable
        var first = true
        ractive.observe('config.gutter', function(b){
            if(first){   
                e.renderer.setShowGutter(true)
                first = false
                if(!b){
                    setTimeout(function(){
                        e.renderer.setShowGutter(false)
                    })
                }
            } else {
                e.renderer.setShowGutter(b)
            }
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
            //s.getUndoManager().reset() doesn't work
            setting = true
            s.setValue(e.getValue(), -1)
            e.clearSelection()
            setting = false
        }
        
        return {
            teardown: teardown,
            resize: resize,
            reset: reset
        }
    }
}

	},
},
{
	name: 'editor-config',
	template: [{"t":7,"e":"div","a":{"class":"editor-config"},"f":[{"t":7,"e":"div","a":{"class":"gear"},"f":"&#x2699;"},{"t":7,"e":"div","a":{"class":"config-box"},"f":[{"t":4,"r":"config","f":["\n",{"t":7,"e":"fieldset","f":[{"t":7,"e":"legend","f":"theme"},{"t":7,"e":"select","a":{"value":[{"t":2,"r":"config.theme"}]},"f":[{"t":4,"r":"themes","i":"theme","f":["\n",{"t":7,"e":"option","a":{"value":[{"t":2,"r":".theme"}],"selected":[{"t":2,"x":{"r":[".theme","config.theme"],"s":"${0}===${1}"}}]},"f":[{"t":2,"r":"desc"}]}]},"\n"]}]},{"t":7,"e":"fieldset","f":[{"t":7,"e":"legend","f":"live refresh"},{"t":7,"e":"div","a":{"class":"config-item"},"f":[{"t":7,"e":"label","f":["ctrl+enter only",{"t":7,"e":"input","a":{"type":"checkbox","checked":[{"t":2,"r":"noLiveRefresh"}]}}]}]}]},{"t":7,"e":"fieldset","f":[{"t":7,"e":"legend","f":"tabs"},{"t":7,"e":"div","a":{"class":"config-item"},"f":[{"t":7,"e":"label","f":["indent",{"t":7,"e":"input","a":{"type":"number","min":"0","max":"8","value":[{"t":2,"r":".tab"}]}}]}]},{"t":7,"e":"div","a":{"class":"config-item"},"f":[{"t":7,"e":"label","f":["soft",{"t":7,"e":"input","a":{"type":"checkbox","checked":[{"t":2,"r":".softTab"}]}}]}]}]},{"t":7,"e":"fieldset","f":[{"t":7,"e":"legend","f":"format"},{"t":7,"e":"div","a":{"class":"config-item"},"f":[{"t":7,"e":"label","f":["indent guides",{"t":7,"e":"input","a":{"type":"checkbox","checked":[{"t":2,"r":".indentGuides"}]}}]}]},{"t":7,"e":"div","a":{"class":"config-item"},"f":[{"t":7,"e":"label","f":["invisibles",{"t":7,"e":"input","a":{"type":"checkbox","checked":[{"t":2,"r":".invisibles"}]}}]}]}]},{"t":7,"e":"div","a":{"class":"config-item"},"f":[{"t":7,"e":"label","f":["gutter (line #'s)",{"t":7,"e":"input","a":{"type":"checkbox","checked":[{"t":2,"r":"gutter"}]}}]}]},{"t":7,"e":"div","a":{"class":"config-item"},"f":[{"t":7,"e":"label","f":["highlight line",{"t":7,"e":"input","a":{"type":"checkbox","checked":[{"t":2,"r":".highlightLine"}]}}]}]},{"t":7,"e":"div","a":{"class":"config-item"},"f":[{"t":7,"e":"label","f":["scroll past",{"t":7,"e":"input","a":{"type":"checkbox","checked":[{"t":2,"r":".scrollPastEnd"}]}}]}]}]},"\n"]}]}],
	init: function(component, Ractive) {
		var themelist = ace.require("ace/ext/themelist")  

component.exports = {
    beforeInit: function(o){
        o.data.themes = themelist.themesByName
    }
}
	},
},
{
	name: 'editors',
	template: [{"t":7,"e":"div","a":{"class":"editors"},"f":[{"t":7,"e":"div","a":{"class":"editor-container"},"f":[{"t":7,"e":"editor-config","a":{"config":[{"t":2,"r":"config"}]}},{"t":4,"r":"section","f":["\n",{"t":7,"e":"steps","a":{"steps":[{"t":2,"r":"section.steps"}],"selected":[{"t":2,"r":"selected"}]}},{"t":4,"r":"steps","i":"i","f":["\n",{"t":7,"e":"div","a":{"style":[{"t":4,"x":{"r":["i","selected"],"s":"${0}!==${1}"},"f":"visibility: hidden; z-index: -1; "}],"class":"editor"},"f":[{"t":7,"e":"editor","a":{"resource":[{"t":2,"r":"."}],"config":[{"t":2,"r":"config"}]},"v":{"codeChange":"codeChanged","refreshRequest":"refreshRequested"}}]},{"t":4,"r":"error","f":["\n",{"t":7,"e":"error","a":{"error":[{"t":2,"r":"."}]}}]},"\n"]}]},"\n"]}]}],
	init: function(component, Ractive) {
		var Section = require('section')
var steps = 'steps'
component.exports =  {
    beforeInit: function(o){
        var d = o.data
        if(!d.section) {
            o.data.section = new Section(d.name, d.steps)
        }
        o.data.selected = 0
    },
    init: function(){
        var r = this

        this.on('refreshRequested', function(){
            r.fire('refreshRequest', r.data.section.name)
        })
        
        var ractive = this,
            d = this.data
       
        this.observe('section', function(n,o){
            if(n===o){ return }
            console.log('reset')
            ractive.findAllComponents('editor').forEach(function(editor){
                editor.reset()
            })

        }, { init: false })

       

    }
}

	},
},
{
	name: 'error',
	template: [{"t":7,"e":"pre","a":{"class":"error"},"f":[{"t":2,"r":"error.message"}],"t1":{"n":"fade","a":[{"delay":2000}]}}],
	init: function(component, Ractive) {
		component.exports = {
    magic: true
}
	},
},
{
	name: 'pane',
	template: [{"t":4,"r":"pane","f":["\n",{"t":7,"e":"pane-node","a":{"style":[" right: ",{"t":2,"x":{"r":[".position.x"],"s":"100-${0}"}},"%; bottom: ",{"t":2,"x":{"r":[".position.y"],"s":"100-${0}"}},"%; left: ",{"t":2,"r":".position.x"},"%; top: ",{"t":2,"r":".position.y"},"%;"]},"f":[{"t":7,"e":"div","a":{"class":"pane-inner"},"f":[{"t":8,"r":"content"},"\n"]}]}]},"\n"],
	init: function(component, Ractive) {
		var defaultPosition = { position: { x:50, y:50 } }

component.exports = {
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
	template: [{"t":7,"e":"pane","f":[{"t":7,"e":"pane","f":"<div class=color></div>"},{"t":7,"e":"pane","f":"<div class=color></div>"},{"t":7,"e":"pane","f":"<div class=color></div>"},{"t":7,"e":"pane","f":"<div class=color></div>"},{"t":7,"e":"sizer"}]},{"t":7,"e":"pane","f":"<p>hello world</p>"},{"t":7,"e":"sizer","a":{"pane":[{"t":2,"r":"pane"}],"orientation":"horizontal"}}],
	init: function(component, Ractive) {
		
	},
},
{
	name: 'part',
	template: [{"t":7,"e":"editors","a":{"section":[{"t":2,"kx":{"r":"definition","m":[{"t":30,"n":"type"}]}}],"config":[{"t":2,"r":"config"}]}}],
	init: function(component, Ractive) {
		component.exports = {
    beforeInit: function(o){
    
        var d = o.data
        d.allconfig = d.allconfig || {}
        if(!d.allconfig[d.type]) { d.allconfig[d.type] = {} }
        
        d.config = d.allconfig[d.type]
        
        for(var key in d.defaultConfig){
            if(!d.config.hasOwnProperty(key)) {
                d.config[key] = d.defaultConfig[key]
            }
        }
        
        if(!d.config.hasOwnProperty('noLiveRefresh')){
            d.config.noLiveRefresh = false
        }
       
    }
}
	},
},
{
	name: 'preview',
	template: [{"t":7,"e":"div","a":{"class":"preview"},"f":[{"t":7,"e":"iframe","a":{"name":"newpreview","seamless":"seamless","src":[{"t":2,"r":"project.layout.src"}]}}]}],
	init: function(component, Ractive) {
		
function PreviewWindow(iframe){
    var win = iframe.contentWindow

    this.send = function(m){
        win.postMessage(m, '*')
    }
}

component.exports = {
    magic: true,
    init: function(){
        var self = this,
            d = this.data,
            iframe = this.find('iframe')
            // _layout, _component

        // function loadable(){
        //     return _layout && _component
        // }

        this.reload = function(){
            // if(!loadable()) { return }
            if(iframe.contentWindow){
                iframe.contentWindow.location.reload()
            }           
        }

        // this.observe('project.layout', function(layout, old){
        //     if(layout===old) { return; }
        //     _layout = layout
        //     self.reload()
        // })  

        this.observe('component', function(component,old){
            if(component===old){ return }
            _component = component
            self.reload()
        })

        iframe.onload = function(){
            var pw = self.previewWindow = new PreviewWindow(iframe)

            //pw.postMessage( { components: all }, '*')
            
            pw.send(d.component.data)

        }

        self.update = function(name){
            if(!self.previewWindow) { return }
            var msg = {}
            msg[name] = d.component.data[name]
            self.previewWindow.send(msg)  
        }

            


    }
}

	},
},
{
	name: 'project',
	template: [{"t":7,"e":"div","a":{"class":"project"},"f":[{"t":7,"e":"div","a":{"class":"dflux"},"f":"3DE"},{"t":4,"r":"project","f":["\n",{"t":7,"e":"ul","a":{"class":"features"},"f":[{"t":4,"r":"features","f":["\n",{"t":7,"e":"li","f":[{"t":2,"r":"name"},{"t":7,"e":"ul","a":{"class":"components"},"f":[{"t":4,"r":"components","i":"i","f":["\n",{"t":7,"e":"li","a":{"class":[{"t":2,"x":{"r":["name"],"s":"${0}===\"bob\"?\"selected\":\"\""}}]},"f":[{"t":2,"r":"name"}],"v":{"click":"select"}}]},"\n",{"t":7,"e":"li","f":[{"t":7,"e":"input","a":{"type":"text","value":[{"t":2,"r":"..new"}],"placeholder":"new component..."},"v":{"enter_kp":{"n":"addComponent","d":[{"t":2,"r":"..new"}]}}}]}]}]}]},"\n",{"t":7,"e":"li","f":[{"t":2,"r":"layout"},{"t":7,"e":"input","a":{"type":"text","value":[{"t":2,"r":"..new"}],"placeholder":"new feature..."},"v":{"enter_kp":{"n":"addFeature","d":[{"t":2,"r":"..new"}]}}}]}]}]},"\n"]}],
	init: function(component, Ractive) {
		function nameSort(a, b) {
    if (a.name > b.name)
      return 1;
    if (a.name < b.name)
      return -1;
    // a must be equal to b
    return 0;
}

var Definition = require('definition')

component.exports = {
    magic: true,
    isolate: true,
    beforeInit: function(options){
        var d = options.data
        if(!d.project){
            d.project = {}
        }
        if(!d.project.features){
            d.project.features = []
        }
    },
    init: function(){
        var self = this,
            project = self.data.project

        function fireSelected(component){
            self.fire('componentSelect', component)
        }
        this.on('select', function(e){
            fireSelected(e.context)
        })
        
        function add(item, collection){
            if(!item || !item.trim() ) { return }
            item = item.replace(/ /g, '-')
            
            var exists = collection.some(function(c){
                return c.name===item
            })
            if(exists){
                alert('"' + item + '" already exists')
                return;
            }
            return { name: item }
        }
        function insert(collection, item){
            collection.push(item)
            try {
                collection.sort(nameSort)
            } catch(e){}
        }

        this.on('addComponent', function(e, item){
            var components =  e.context.components,
                component = add(item, components)
            if(!component) { return }
            
            var definition = new Definition(component)
            insert( components, definition )
            e.context['']['new'] = ''
            document.activeElement.blur()
            
            fireSelected(definition)
        })
        
        this.on('addFeature', function(e, item){
            var features = e.context.features,
            feature = add(item, features)
            if(!feature) { return }
            
            feature.components = []
            insert(features, feature)
            e.context['']['new'] = ''
            document.activeElement.blur()
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
	template: [{"t":7,"e":"part","a":{"type":"script","allconfig":[{"t":2,"r":"config"}],"defaultConfig":[{"t":2,"r":"defaultConfig"}]}}],
	init: function(component, Ractive) {
		var config = {
    "theme": "ace/theme/merbivore_soft",
    "gutter": true,
    "tab": 4,
    "softTab": false,
    "highlightLine": false,
    "invisibles": false,
    "indentGuides": true,
    "fadeFold": true,
    "scrollPastEnd": true,
    noLiveRefresh: true
}

component.exports = {
    data: {
        defaultConfig: config 
    }
}

	},
},
{
	name: 'sizeme',
	template: [{"t":7,"e":"ul","f":[{"t":4,"r":"items","f":["\n",{"t":7,"e":"li","f":[{"t":2,"r":"."},{"t":7,"e":"span","a":{"class":"delete"},"f":"&#x24E7;","v":{"click":{"n":"remove","d":[{"t":2,"r":"."}]}}}],"o":{"n":"sizeme","d":[{"t":2,"r":"../length"}]}}]},"\n"]},{"t":7,"e":"input","a":{"value":[{"t":2,"r":"new"}]}},{"t":7,"e":"button","f":"add","v":{"click":{"n":"add","d":[{"t":2,"r":"new"}]}}}],
	init: function(component, Ractive) {
		component.exports = {
    	init: function(){
			var items = this.data.items
			this.on('add', function(e, item){
				if(!item){ return }
				items.push(item)
				this.data.new = ''
			})    		
            this.on('remove', function(e, item){
                if ((index = items.indexOf(item)) > -1) {
                    console.log(item, index)
                    items.splice(index, 1);
                }
			})
		},
		decorators: {
			sizeme: function(node, length){
                node.style.height = 100/length + '%'
				return { teardown: function(){} }
			}
		}
	}
	},
},
{
	name: 'sizer',
	template: [{"t":4,"r":"pane","f":["\n",{"t":7,"e":"div","a":{"style":["top: ",{"t":2,"x":{"r":[".position.y"],"s":"${0}||50"}},"%; left: ",{"t":2,"x":{"r":[".position.x"],"s":"${0}||50"}},"%;"],"class":["sizer orientation-",{"t":2,"r":"orientation"}]}}]},"\n"],
	init: function(component, Ractive) {
		component.exports = {
    beforeInit: function(o){
      if(!o.data.orientation){
        o.data.orientation = 'both'
      }  
    },
    init: function(){
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

            //console.log(ractive.data.pane.position.x, moveTo.x)
            if(direction.x){
                ractive.set('pane.position.x', moveTo.x )
                //ractive.data.pane.position.x = moveTo.x
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
	name: 'steps',
	template: [{"t":7,"e":"div","a":{"class":"steps"},"f":[{"t":7,"e":"div","a":{"class":"extend"},"f":[{"t":7,"e":"label","a":{"class":"title"},"f":[{"t":2,"r":"name"}]},{"t":7,"e":"span","a":{"class":"circle"},"f":"&#8858; "},{"t":4,"r":"steps","i":"i","f":["\n",{"t":7,"e":"label","a":{"selected":[{"t":2,"x":{"r":["i","selected"],"s":"${0}===${1}"}}],"error":[{"t":2,"x":{"r":["error"],"s":"!!${0}"}}],"class":"step"},"f":[{"t":2,"r":"name"},{"t":7,"e":"input","a":{"type":"radio","name":[{"t":2,"r":"selected"}],"value":[{"t":2,"r":"i"}]}}]}]},"\n"]}]}],
	init: function(component, Ractive) {
		
	},
},
{
	name: 'styling',
	template: [{"t":7,"e":"part","a":{"type":"style","allconfig":[{"t":2,"r":"config"}],"defaultConfig":[{"t":2,"r":"defaultConfig"}]}}],
	init: function(component, Ractive) {
		var config = {
    "theme": "ace/theme/merbivore_soft",
    "gutter": false,
    "tab": 2,
    "softTab": false,
    "highlightLine": false,
    "invisibles": false,
    "indentGuides": true,
    "fadeFold": true,
    "scrollPastEnd": true
}

component.exports = {
    data: {
        defaultConfig: config 
    }
}

	},
},
{
	name: 'template',
	template: [{"t":7,"e":"part","a":{"type":"template","allconfig":[{"t":2,"r":"config"}],"defaultConfig":[{"t":2,"r":"defaultConfig"}]}}],
	init: function(component, Ractive) {
		var config = {
    "theme": "ace/theme/merbivore_soft",
    "gutter": true,
    "tab": 2,
    "softTab": true,
    "highlightLine": false,
    "invisibles": false,
    "indentGuides": true,
    "fadeFold": true,
    "scrollPastEnd": true
}

component.exports = {
    data: {
        defaultConfig: config 
    }
}
	},
},
{
	name: 'threeDE',
	template: [{"t":7,"e":"pane","f":[{"t":7,"e":"project"}]},{"t":7,"e":"pane","f":[{"t":4,"r":"component","f":["\n",{"t":7,"e":"component","a":{"component":[{"t":2,"r":"."}]}}]},"\n",{"t":4,"r":"component","n":true,"f":"<div class=create>Create a feature and component</div>"},"\n"]},{"t":7,"e":"sizer","a":{"orientation":"horizontal"}}],
	init: function(component, Ractive) {
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
	},
},
]