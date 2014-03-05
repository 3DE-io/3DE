module.exports = function(fn){

	return function(value, cb){
		setTimeout(function(){
			try {
				if(!value) { cb(); return }
				cb(null, fn(value))
			}
			catch(e){
				cb(e)
			}
		})
	}
	
}