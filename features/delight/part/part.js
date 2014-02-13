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