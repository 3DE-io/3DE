component.exports = {
    magic: false,
    decorators: {
        moveable: moveable
    },
    data: {
      "orientation": 'both'
    }
}

var rAF = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (cb) { window.setTimeout(cb, 1000 / 60) }
var cAF = window.cancelAnimationFrame        ||
        window.webkitCancelAnimationFrame        ||
        function (index) { clearTimeout(index); };

function moveable(node, position, orientation, noRAF){

    //seeing flickering at about 95% with RAF
    //need to investigate
    noRAF = true
    
    var ractive = this,
        doMove = noRAF ? _move : _rAFMove
        direction = {
            x: orientation!=='vertical',
            y: orientation!=='horizontal'
        }
    
    function events(target, event, fn){
        return {
            start: function() {  
                target.addEventListener(event, fn)
            },
            stop: function() { 
                target.removeEventListener(event, fn)
            }
        }
    }
    var dragstart = events(node, 'mousedown', start),
        drag = events(document, 'mousemove', move),
        /* need to listen on both document and top-most window */
        doc = events(document, 'mouseup', end),
        win = events(window.top, 'mouseup', end),
        dragend = {
            start: function(){ doc.start(); win.start() },
            stop: function(){ doc.stop(); win.stop() }
        } 
        
    dragstart.start()

    function current(e){
        return { x: e.x, y: e.y } 
    }
    
    var original, begin, total, buffer
        parent = node.parentNode
    
    function start(e){
        e.preventDefault()
        
        node.classList.add('moving')
        
        total = { 
            x: parent.clientWidth, 
            y: parent.clientHeight
        }
        buffer = {
            x: node.offsetWidth*.5/total.x,
            y: node.offsetHeight*.5/total.y
        }
        
        original = { x: position.x, y: position.y }
        begin = current(e)
        
        dragstart.stop()
        drag.start()
        dragend.start() 
    }

    var _current, _index, _ticking = false
    
    function move(e){
        _current = current(e)
        doMove()
    }
    
    function _rAFMove(e){
        if(!_ticking) {
            _index = rAF(_move)
        }
        _ticking = true        
    }
    
    function _move(e){
        _ticking = false
        
        var delta = {
            x: _current.x - begin.x,
            y: _current.y - begin.y
        }
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
        
        if(direction.x){
            ractive.set('position.x', moveTo.x )
        }
        if(direction.y){
            ractive.set('position.y', moveTo.y )
        }
        //position.x = original.x + (_current.x - begin.x)
        //position.y = original.y + (_current.y - begin.y)
    }
    
    function end(){
        node.classList.remove('moving')
        teardown()
        dragstart.start()
    }
    
    function teardown(){
        cAF(_index)
        _ticking = false
        if(dragend) dragend.stop()
        if(drag) drag.stop()
        if(dragstart) dragstart.stop()
    }  
    
    return { teardown: teardown }
}