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
        // subscriber.add(window.top, events.end, onend)
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
        // subscriber.remove(window.top, events.end, onend)
    }

    function stop(){
        endListen()
        endMove()
    }
}
