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
