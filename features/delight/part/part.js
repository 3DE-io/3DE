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