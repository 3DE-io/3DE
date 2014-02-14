component.exports = {
    magic: true,
    init: function(){
        var r = this,
            project = r.data.project
        this.on('select', function(e){
            project.current = e.context
        })
        function add(item, collection){
            if(!item || !item.trim() ) { return }
            item = item.replace(/ /g, '-')
            
            var exists = collection.some(function(c){
                return c.name===item
            })
            if(exists){
                alert('"' + item + '" already exists')
                return;
            }
            return {
                name: item
            }
        }
        this.on('addComponent', function(e, item){
            var components =  e.context.components,
                component = add(item, components)
            if(!component) { return }

            e.context.new = ''
            document.activeElement.blur()
            r.data.project.current = component
            components.push(component)
        })
        this.on('addFeature', function(e, item){
            var features = e.context.features,
                feature = add(item, features)
            if(!feature) { return }
            feature.components = []
            features.push(feature)
            e.context.new = ''
            document.activeElement.blur()
            console.log(this.data.project.features)
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