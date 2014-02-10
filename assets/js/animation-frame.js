
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