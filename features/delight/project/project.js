function nameSort(a, b) {
    if (a.name > b.name)
      return 1;
    if (a.name < b.name)
      return -1;
    // a must be equal to b
    return 0;
}

component.exports = {
    magic: true,
    init: function(){
        var r = this,
            project = r.data.project
            
        this.on('select', function(e){
            //r.set('project.current', e.context)
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
            return { name: item }
        }
        function insert(collection, item){
            collection.push(item)
            collection.sort(nameSort)
        }

        this.on('addComponent', function(e, item){
            var components =  e.context.components,
                component = add(item, components)
            if(!component) { return }
            
            insert(components, component)
            e.context.new = ''
            document.activeElement.blur()
            
            r.data.project.current = component
        })
        
        this.on('addFeature', function(e, item){
            var features = e.context.features,
                feature = add(item, features)
            if(!feature) { return }
            
            feature.components = []
            
            insert(features, feature)
            e.context.new = ''
            document.activeElement.blur()
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