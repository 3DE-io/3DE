require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var request = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (cb) { window.setTimeout(cb, 1000 / 60) }

var cancel = window.cancelAnimationFrame        ||
        window.webkitCancelAnimationFrame        ||
        function (index) { clearTimeout(index); }


module.exports = {
	request: function(fn){
        return request(fn)
    },
    cancel: function(index){
        return cancel(index)   
    }
}
},{}],2:[function(require,module,exports){
module.exports = {
	add: function(target, event, fn){
	    target.addEventListener(event, fn)
	},
	remove: function(target, event, fn){
	    target.removeEventListener(event, fn)
	}
}
},{}],3:[function(require,module,exports){
var subscriber = require('./event-subscriber')

module.exports = function MoveEvents(node, notify){
    var self = this,
        mouse = {
            start: 'mousedown',
            move: 'mousemove',
            end: 'mouseup' 
        },
        touch = {
            start: 'touchstart',
            move: 'touchmove',
            end: 'touchend'
        },
        events = void 0

    this.start = listen
    this.stop = stop
    this.start()

    function listen(){
        subscriber.add(node, mouse.start, onstart)
        subscriber.add(node, touch.start, onstart)
    }

    function endListen(){
        subscriber.remove(node, mouse.start, onstart)
        subscriber.remove(node, touch.start, onstart)
    }

    function onstart(e) {
        endListen()
        events = e.type===mouse.start ? mouse : touch

        if(notify.start){ notify.start(e) }

        subscriber.add(document, events.move, onmove)
        subscriber.add(document, events.end, onend)
        subscriber.add(window.top, events.end, onend)
    }

    function onmove(e) {
        if(notify.move){ notify.move(e) }
    }

    function onend(e) {
        endMove()
        if(notify.end){ notify.end(e) }
        self.start()
    }  

    function endMove(){
        if(!events) { return; }
        subscriber.remove(document, events.move, onmove)
        subscriber.remove(document, events.end, onend)
        subscriber.remove(window.top, events.end, onend)
    }

    function stop(){
        endListen()
        endMove()
    }
}

},{"./event-subscriber":2}],"9Zb6PD":[function(require,module,exports){
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



},{"./animation-frame":1,"./move-events":3}],"track-move-events":[function(require,module,exports){
module.exports=require('9Zb6PD');
},{}]},{},[])