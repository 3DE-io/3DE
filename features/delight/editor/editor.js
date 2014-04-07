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
