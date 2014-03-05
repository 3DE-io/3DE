component.exports = {
    init: function(){
        var items = this.data.items
        this.on('remove', function(item){
            var index = items.indexOf(item.person)
            console.log('before', items.length)
            if(index > -1){
                items.splice(index, 1)
            }
            console.log('after', items.length)
        })
    }
}