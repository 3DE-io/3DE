module.exports = {
	add: function(target, event, fn){
	    target.addEventListener(event, fn)
	},
	remove: function(target, event, fn){
	    target.removeEventListener(event, fn)
	}
}