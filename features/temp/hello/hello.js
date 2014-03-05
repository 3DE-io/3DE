component.exports = {
    teardown: function(){
        'hello component teardown'
    },
    init: function(){
        var self = this
        this.on('click', function(e){
            console.log(e.context)
            self.fire('remove', e.context)
        })
    }
}