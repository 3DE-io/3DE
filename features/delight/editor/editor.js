

//themelist.toCss = function(theme){
//  return 'ace-' + theme.replace(/_/g, '-')
//}


component.exports = {
    decorators: { editor: editor },
    complete: function(){
    }
}

function editor(node, language, code, config){ 
    var e = ace.edit(node)

    var modes = ace.require('ace/ext/modelist')
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
    
        
    e.resize()
    return { teardown: function () {} }
}
