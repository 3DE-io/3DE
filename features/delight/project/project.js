component.exports = {
    magic: true,
    init: function(){
        var r = this,
            project = r.data.project
        this.on('select', function(e){
            project.current = e.context
        })
        this.on('add', function(e, item){
            if(!item || !item.trim() ) { return }
            item = item.replace(/ /g, '-')
            var component = {
                name: item
            }
            r.data.new = ''
            document.activeElement.blur()
            e.context.current = component
            e.context.components.push(component)
        })
    },
    events: {
        enter_kp: function(node, fire){
            node.addEventListener('keypress', function(e){
                if(e.which===13){ fire({
                    node: node
                })}
            })
        }
    }
}