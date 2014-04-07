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
