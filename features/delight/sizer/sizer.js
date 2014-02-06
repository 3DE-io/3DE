component.exports = {
    decorators: {
        moveable: moveable
    }
}

var rAF = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (cb) { window.setTimeout(cb, 1000 / 60) }
var cAF = window.cancelAnimationFrame        ||
        window.webkitCancelAnimationFrame        ||
        function (index) { clearTimeout(index); };

function moveable(node, position, noRAF){
    var ractive = this
    
    
    var doMove = noRAF ? _move : _rAFMove
    
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
        /* need to watch both document and top-most window */
        documentend = events(document, 'mouseup', end),
        windowend = events(window.top, 'mouseup', end),
        dragend = {
            start: function(){ documentend.start(); windowend.start() },
            stop: function(){ documentend.stop(); windowend.stop() }
        } 
        
    dragstart.start()

    function current(e){
        return { x: e.x, y: e.y } 
    }
    
    var original, begin
    
    function start(e){
        e.preventDefault()
        
    //    node.parentNode.offsetHeight)
    
        
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

        ractive.set('position.x', original.x + (_current.x - begin.x) )
        ractive.set('position.y', original.y + (_current.y - begin.y) )
        
        //position.x = original.x + (_current.x - begin.x)
        //position.y = original.y + (_current.y - begin.y)
    }
    
    function end(){
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