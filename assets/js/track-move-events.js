var af = require('./animation-frame'),
    MoveEvents = require('./move-events')

function TrackMoveEvents(node, notify, noRAF){

    MoveEvents.call(this, node, {
        start: start,
        move: move,
        end: end
    })

    function current(e){
        return { x: e.x, y: e.y } 
    }

    var begin
    function start(e){
        e.preventDefault()
        begin = current(e)
        if(notify.start){ notify.start(begin) }
    }
    var doMove = noRAF ? _move : _rAFMove,
        _current, 
        _index, 
        _ticking = false

    function move(e){
        _current = current(e)
        doMove()
    }

    function _rAFMove(e){
        if(!_ticking) {
            _index = af.request(_move)
        }
        _ticking = true        
    }

    function _move(e) {
        _ticking = false;
        var delta = {
            x: _current.x - begin.x,
            y: _current.y - begin.y
        }
        if(notify.move){ notify.move(delta) }
    }

    function end(){
        cancelRAF()
        if(notify.end){ notify.end() }
    }

    function cancelRAF(){
        if(noRAF) { return }
        af.cancel(_index)
        _ticking = false
    }

    var base_stop = this.stop
    this.stop = function(){
        cancelRAF()
        base_stop()
    }
}
TrackMoveEvents.prototype = Object.create(MoveEvents.prototype)

module.exports = TrackMoveEvents


