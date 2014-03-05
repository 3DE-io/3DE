var Section = require('section')
var steps = 'steps'
component.exports =  {
    magic: true,
    beforeInit: function(o){
        var d = o.data
        if(!d.section) {
            o.data.section = new Section(d.name, d.steps)
        }
        o.data.selected = 0
        //o.data.errorIndex = null
    },
    init: function(){
        var r = this

        this.on('refreshRequested', function(){
            r.fire('refreshRequest', r.data.section.name)
        })
        
        var ractive = this,
            d = this.data
       
        this.observe(steps, function(n,o){
            if(n===o){ return }
            console.log('reset')
            ractive.findAllComponents('editor').forEach(function(editor){
                editor.reset()
            })

        }, { init: false })

       

    }
}
