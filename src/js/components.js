var components = [
{
	name: 'editor',
	template: [{"t":7,"e":"div","a":{"class":"editor"},"f":[{"t":7,"e":"editor-control"}]}],
	init: function(component, Ractive) {
		
	},
},
{
	name: 'editor-control',
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
        //console.log('editor data', this.data)
        //this.data.code = 123
        //this.set('code','123')
    }
}

function editor(node, language, code, config){  
    var e = ace.edit(node)

    var mode = modes.getModeForPath('.' + language).mode
    e.getSession().setMode(mode)
    
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
        if(!themelist.themesByName[theme]){
            //console.warn('no theme', theme)
            theme = oldTheme
        }
        theme = theme || 'merbivore_soft'
        var full = themelist.themesByName[theme]
        e.setTheme(full.theme)        
    }
    ractive.observe('config.theme', setTheme)
        
    e.resize()
    return { teardown: function () {} }
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
	template: [{"t":7,"e":"div","a":{"class":"pane"},"f":[{"t":4,"r":".","i":"title","f":["\n",{"t":7,"e":"div","a":{"class":"pane"},"f":[{"t":7,"e":"section","a":{"title":[{"t":2,"r":"title"}],"sections":[{"t":2,"r":".sections"}]}}]}]}]},{"t":7,"e":"div","a":{"class":"pane"},"f":"<div class=frame><iframe seamless=seamless></iframe></div>"}],
	init: function(component, Ractive) {
		
	},
},
{
	name: 'section',
	template: [{"t":7,"e":"div","a":{"class":"section"},"f":[{"t":7,"e":"div","a":{"class":"title"},"f":[{"t":2,"r":"title"}]},{"t":7,"e":"tabs","a":{"tabs":[{"t":2,"r":"sections"}],"selected":[{"t":2,"r":"selected"}],"error":[{"t":2,"r":"error.location"}]}},{"t":7,"e":"div","a":{"class":"editors"},"f":[{"t":4,"r":"sections","i":"language","f":["\n",{"t":7,"e":"div","a":{"class":["editor ",{"t":2,"x":{"r":["selected","language"],"s":"${0}!==${1}?'hide':'show'"}}]},"f":[{"t":7,"e":"editor-control","a":{"language":[{"t":2,"r":"language"}],"code":[{"t":2,"r":"."}]}}]}]}]},{"t":4,"r":"error","f":["\n",{"t":7,"e":"pre","a":{"class":"error"},"f":[{"t":2,"r":"message"},"\n"]}]}]}],
	init: function(component, Ractive) {
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

	},
},
{
	name: 'tabs',
	template: [{"t":7,"e":"div","a":{"class":"tabs"},"f":[{"t":4,"r":"_tabs","f":["\n",{"t":7,"e":"label","a":{"selected":[{"t":2,"x":{"r":[".","selected"],"s":"${0}===${1}"}}],"error":[{"t":2,"x":{"r":[".","error"],"s":"${0}===${1}"}}],"force":[{"t":2,"x":{"r":["error"],"s":"!!${0}"}}]},"f":[{"t":2,"r":"."},{"t":7,"e":"input","a":{"type":"radio","name":[{"t":2,"r":"selected"}],"value":[{"t":2,"r":"."}]}}]}]}]}],
	init: function(component, Ractive) {
		component.exports =  {
    beforeInit: function(o){
        var tabs = o.data.tabs
        o.data._tabs = Array.isArray(tabs) 
            ? tabs
            : Object.keys(tabs)
    }
}
	},
},
]