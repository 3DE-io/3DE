var use_stylus = (typeof stylus==='undefined') ? require('stylus') : stylus

module.exports = function(options){
	return function(style, cb){
    	if(!style) { cb(); return }
        use_stylus(style).render(cb)
    }
}