

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
