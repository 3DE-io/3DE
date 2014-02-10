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
        subscriber.remove(document, events.move, onmove)
        subscriber.remove(document, events.end, onend)
        subscriber.remove(window.top, events.end, onend)
    }

    function stop(){
        endListen()
        endMove()
    }
}

},{"./event-subscriber":2}],"cKuaoP":[function(require,module,exports){
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



},{"./animation-frame":1,"./move-events":3}],"move":[function(require,module,exports){
module.exports=require('cKuaoP');
},{}]},{},[])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWFydHkvZGVsaWdodGZ1bFVYL2Fzc2V0cy9qcy9hbmltYXRpb24tZnJhbWUuanMiLCIvVXNlcnMvbWFydHkvZGVsaWdodGZ1bFVYL2Fzc2V0cy9qcy9ldmVudC1zdWJzY3JpYmVyLmpzIiwiL1VzZXJzL21hcnR5L2RlbGlnaHRmdWxVWC9hc3NldHMvanMvbW92ZS1ldmVudHMuanMiLCIvVXNlcnMvbWFydHkvZGVsaWdodGZ1bFVYL2Fzc2V0cy9qcy90cmFjay1tb3ZlLWV2ZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJcbnZhciByZXF1ZXN0ID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgIGZ1bmN0aW9uIChjYikgeyB3aW5kb3cuc2V0VGltZW91dChjYiwgMTAwMCAvIDYwKSB9XG5cbnZhciBjYW5jZWwgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgICAgICAgIHx8XG4gICAgICAgIHdpbmRvdy53ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZSAgICAgICAgfHxcbiAgICAgICAgZnVuY3Rpb24gKGluZGV4KSB7IGNsZWFyVGltZW91dChpbmRleCk7IH1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVxdWVzdDogZnVuY3Rpb24oZm4pe1xuICAgICAgICByZXR1cm4gcmVxdWVzdChmbilcbiAgICB9LFxuICAgIGNhbmNlbDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgICByZXR1cm4gY2FuY2VsKGluZGV4KSAgIFxuICAgIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0YWRkOiBmdW5jdGlvbih0YXJnZXQsIGV2ZW50LCBmbil7XG5cdCAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZm4pXG5cdH0sXG5cdHJlbW92ZTogZnVuY3Rpb24odGFyZ2V0LCBldmVudCwgZm4pe1xuXHQgICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGZuKVxuXHR9XG59IiwidmFyIHN1YnNjcmliZXIgPSByZXF1aXJlKCcuL2V2ZW50LXN1YnNjcmliZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIE1vdmVFdmVudHMobm9kZSwgbm90aWZ5KXtcbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIG1vdXNlID0ge1xuICAgICAgICAgICAgc3RhcnQ6ICdtb3VzZWRvd24nLFxuICAgICAgICAgICAgbW92ZTogJ21vdXNlbW92ZScsXG4gICAgICAgICAgICBlbmQ6ICdtb3VzZXVwJyBcbiAgICAgICAgfSxcbiAgICAgICAgdG91Y2ggPSB7XG4gICAgICAgICAgICBzdGFydDogJ3RvdWNoc3RhcnQnLFxuICAgICAgICAgICAgbW92ZTogJ3RvdWNobW92ZScsXG4gICAgICAgICAgICBlbmQ6ICd0b3VjaGVuZCdcbiAgICAgICAgfSxcbiAgICAgICAgZXZlbnRzID0gdm9pZCAwXG5cbiAgICB0aGlzLnN0YXJ0ID0gbGlzdGVuXG4gICAgdGhpcy5zdG9wID0gc3RvcFxuICAgIHRoaXMuc3RhcnQoKVxuXG4gICAgZnVuY3Rpb24gbGlzdGVuKCl7XG4gICAgICAgIHN1YnNjcmliZXIuYWRkKG5vZGUsIG1vdXNlLnN0YXJ0LCBvbnN0YXJ0KVxuICAgICAgICBzdWJzY3JpYmVyLmFkZChub2RlLCB0b3VjaC5zdGFydCwgb25zdGFydClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbmRMaXN0ZW4oKXtcbiAgICAgICAgc3Vic2NyaWJlci5yZW1vdmUobm9kZSwgbW91c2Uuc3RhcnQsIG9uc3RhcnQpXG4gICAgICAgIHN1YnNjcmliZXIucmVtb3ZlKG5vZGUsIHRvdWNoLnN0YXJ0LCBvbnN0YXJ0KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uc3RhcnQoZSkge1xuICAgICAgICBlbmRMaXN0ZW4oKVxuICAgICAgICBldmVudHMgPSBlLnR5cGU9PT1tb3VzZS5zdGFydCA/IG1vdXNlIDogdG91Y2hcblxuICAgICAgICBpZihub3RpZnkuc3RhcnQpeyBub3RpZnkuc3RhcnQoZSkgfVxuXG4gICAgICAgIHN1YnNjcmliZXIuYWRkKGRvY3VtZW50LCBldmVudHMubW92ZSwgb25tb3ZlKVxuICAgICAgICBzdWJzY3JpYmVyLmFkZChkb2N1bWVudCwgZXZlbnRzLmVuZCwgb25lbmQpXG4gICAgICAgIHN1YnNjcmliZXIuYWRkKHdpbmRvdy50b3AsIGV2ZW50cy5lbmQsIG9uZW5kKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9ubW92ZShlKSB7XG4gICAgICAgIGlmKG5vdGlmeS5tb3ZlKXsgbm90aWZ5Lm1vdmUoZSkgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uZW5kKGUpIHtcbiAgICAgICAgZW5kTW92ZSgpXG4gICAgICAgIGlmKG5vdGlmeS5lbmQpeyBub3RpZnkuZW5kKGUpIH1cbiAgICAgICAgc2VsZi5zdGFydCgpXG4gICAgfSAgXG5cbiAgICBmdW5jdGlvbiBlbmRNb3ZlKCl7XG4gICAgICAgIHN1YnNjcmliZXIucmVtb3ZlKGRvY3VtZW50LCBldmVudHMubW92ZSwgb25tb3ZlKVxuICAgICAgICBzdWJzY3JpYmVyLnJlbW92ZShkb2N1bWVudCwgZXZlbnRzLmVuZCwgb25lbmQpXG4gICAgICAgIHN1YnNjcmliZXIucmVtb3ZlKHdpbmRvdy50b3AsIGV2ZW50cy5lbmQsIG9uZW5kKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0b3AoKXtcbiAgICAgICAgZW5kTGlzdGVuKClcbiAgICAgICAgZW5kTW92ZSgpXG4gICAgfVxufVxuIiwidmFyIGFmID0gcmVxdWlyZSgnLi9hbmltYXRpb24tZnJhbWUnKSxcbiAgICBNb3ZlRXZlbnRzID0gcmVxdWlyZSgnLi9tb3ZlLWV2ZW50cycpXG5cbmZ1bmN0aW9uIFRyYWNrTW92ZUV2ZW50cyhub2RlLCBub3RpZnksIG5vUkFGKXtcblxuICAgIE1vdmVFdmVudHMuY2FsbCh0aGlzLCBub2RlLCB7XG4gICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgICAgbW92ZTogbW92ZSxcbiAgICAgICAgZW5kOiBlbmRcbiAgICB9KVxuXG4gICAgZnVuY3Rpb24gY3VycmVudChlKXtcbiAgICAgICAgcmV0dXJuIHsgeDogZS54LCB5OiBlLnkgfSBcbiAgICB9XG5cbiAgICB2YXIgYmVnaW5cbiAgICBmdW5jdGlvbiBzdGFydChlKXtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGJlZ2luID0gY3VycmVudChlKVxuICAgICAgICBpZihub3RpZnkuc3RhcnQpeyBub3RpZnkuc3RhcnQoYmVnaW4pIH1cbiAgICB9XG4gICAgdmFyIGRvTW92ZSA9IG5vUkFGID8gX21vdmUgOiBfckFGTW92ZSxcbiAgICAgICAgX2N1cnJlbnQsIFxuICAgICAgICBfaW5kZXgsIFxuICAgICAgICBfdGlja2luZyA9IGZhbHNlXG5cbiAgICBmdW5jdGlvbiBtb3ZlKGUpe1xuICAgICAgICBfY3VycmVudCA9IGN1cnJlbnQoZSlcbiAgICAgICAgZG9Nb3ZlKClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfckFGTW92ZShlKXtcbiAgICAgICAgaWYoIV90aWNraW5nKSB7XG4gICAgICAgICAgICBfaW5kZXggPSBhZi5yZXF1ZXN0KF9tb3ZlKVxuICAgICAgICB9XG4gICAgICAgIF90aWNraW5nID0gdHJ1ZSAgICAgICAgXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX21vdmUoZSkge1xuICAgICAgICBfdGlja2luZyA9IGZhbHNlO1xuICAgICAgICB2YXIgZGVsdGEgPSB7XG4gICAgICAgICAgICB4OiBfY3VycmVudC54IC0gYmVnaW4ueCxcbiAgICAgICAgICAgIHk6IF9jdXJyZW50LnkgLSBiZWdpbi55XG4gICAgICAgIH1cbiAgICAgICAgaWYobm90aWZ5Lm1vdmUpeyBub3RpZnkubW92ZShkZWx0YSkgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVuZCgpe1xuICAgICAgICBjYW5jZWxSQUYoKVxuICAgICAgICBpZihub3RpZnkuZW5kKXsgbm90aWZ5LmVuZCgpIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYW5jZWxSQUYoKXtcbiAgICAgICAgaWYobm9SQUYpIHsgcmV0dXJuIH1cbiAgICAgICAgYWYuY2FuY2VsKF9pbmRleClcbiAgICAgICAgX3RpY2tpbmcgPSBmYWxzZVxuICAgIH1cblxuICAgIHZhciBiYXNlX3N0b3AgPSB0aGlzLnN0b3BcbiAgICB0aGlzLnN0b3AgPSBmdW5jdGlvbigpe1xuICAgICAgICBjYW5jZWxSQUYoKVxuICAgICAgICBiYXNlX3N0b3AoKVxuICAgIH1cbn1cblRyYWNrTW92ZUV2ZW50cy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKE1vdmVFdmVudHMucHJvdG90eXBlKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNrTW92ZUV2ZW50c1xuXG5cbiJdfQ==
