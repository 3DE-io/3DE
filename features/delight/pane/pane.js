

var map = [null,{},{},{},{},{},{},{}]
function assign(quad, list){
    list.forEach(function(i){
        map[i][quad] = true
    })
}
assign('left', [2,4,6])
assign('right', [3,5,7])
assign('top', [4,5])
assign('bottom', [6,7])


component.exports = {
    magic: false,
    data: {
        ignore: function(ignored){
            //Ractive bug if position property
            //is not 'encountered'
        }
    },
    decorators: {
        sizable: function(node, position){
            
            var p = node.parentNode.children,
                name = node.nodeName
             ,  count = 0, order
             
            for(var i=0; i<p.length; i++){
                var current = p[i]
                if(current.nodeName!==name){ break;}
                if(current===node){
                    order=i
                }
                count++
            }

            //console.log('dec', order, 'of', count, 'key', map[order+count], node)
            return { teardown: function(){} }
            
        }
    }
}