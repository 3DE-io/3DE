function nameSort(a, b) {
    if (a.name > b.name)
      return 1;
    if (a.name < b.name)
      return -1;
    // a must be equal to b
    return 0;
}

var Definition = require('definition')

component.exports = {
    magic: true,
    isolate: true,
    beforeInit: function(options){
        var d = options.data
        if(!d.project){
            d.project = {}
        }
        if(!d.project.features){
            d.project.features = []
        }
    },
    init: function(){
        var self = this,
            project = self.data.project

        function fireSelected(component){
            self.fire('componentSelect', component)
        }
        this.on('select', function(e){
            fireSelected(e.context)
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
            try {
                collection.sort(nameSort)
            } catch(e){}
        }

        this.on('addComponent', function(e, item){
            var components =  e.context.components,
                component = add(item, components)
            if(!component) { return }
            
            var definition = new Definition(component)
            insert( components, definition )
            e.context['']['new'] = ''
            document.activeElement.blur()
            
            fireSelected(definition)
        })
        
        this.on('addFeature', function(e, item){
            var features = e.context.features,
            feature = add(item, features)
            if(!feature) { return }
            
            feature.components = []
            insert(features, feature)
            e.context['']['new'] = ''
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