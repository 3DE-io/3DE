component.exports = {
    magic: false,
    decorators: {
        moveable: moveable
    },
    data: {
        ignore: function(ignored){
            //Ractive bug if position property
            //is not 'encountered'
        },
        "orientation": 'both'
    }
}


var MoveEvents = require('move')

function moveable(node, position, orientation, noRAF){
    var ractive = this,
        direction = {
            x: orientation!=='vertical',
            y: orientation!=='horizontal'
        }
        
    var events = new MoveEvents(node, {
        start: start,
        move: move,
        end: end
    })

    
    var original, total, buffer
    
    function start(){
        
        node.classList.add('moving')
        document.body.style.pointerEvents = 'none'
        
        var parent = node.parentNode
        total = { 
            x: parent.clientWidth, 
            y: parent.clientHeight
        }
        
        buffer = {
            x: node.offsetWidth*.5/total.x,
            y: node.offsetHeight*.5/total.y
        }
        
        original = { x: position.x, y: position.y }
    }

    function move(delta){
        _ticking = false
        
        var asPercent = {
            x: delta.x/total.x*100,
            y: delta.y/total.y*100,
        } 
        var moveTo = {
            x: original.x + asPercent.x,
            y: original.y + asPercent.y
        }
        
        moveTo.x = Math.max(moveTo.x, buffer.x)
        moveTo.x = Math.min(moveTo.x, 100-buffer.x)
        moveTo.y = Math.max(moveTo.y, buffer.y)
        moveTo.y = Math.min(moveTo.y, 100-buffer.y)

        //console.log(moveTo.x, moveTo.y)
        if(direction.x){
            ractive.set('pane.position.x', moveTo.x )
            //position.x = moveTo.x
        }
        if(direction.y){
            ractive.set('pane.position.y', moveTo.y )
            //position.y = moveTo.y
        }
    }
    
    function end(){
        node.classList.remove('moving')
        document.body.style.pointerEvents = null
    }
    
    function teardown(){
        events.stop()
    }  
    
    return { teardown: teardown }
}

