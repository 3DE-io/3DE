/**
 * MicroEvent - to make any js object an event emitter (server or browser)
*/

var MicroEvent	= module.exports = function(){}
MicroEvent.prototype	= {
	on	: function(event, fct){
		this._events = createEventsProperty(this)
		this._events[event] = this._events[event]	|| [];
		this._events[event].push(fct);
	},
	off	: function(event, fct){
		this._events = createEventsProperty(this)
		if( event in this._events === false  )	return;
		this._events[event].splice(this._events[event].indexOf(fct), 1);
	},
	fire	: function(event /* , args... */){
		this._events = createEventsProperty(this)
		if( event in this._events === false  )	return;
		for(var i = 0; i < this._events[event].length; i++){
			this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1))
		}
	}
};

var propName = '_events'
function createEventsProperty(obj){
	if(obj[propName]) { return }

	Object.defineProperty(obj, propName, {
		value : {}, enumerable:false
	})
}
/**
 * mixin will delegate all MicroEvent.js function in the destination object
 *
 * - require('MicroEvent').mixin(Foobar) will make Foobar able to use MicroEvent
 *
 * @param {Object} the object which will support MicroEvent
*/

MicroEvent.mixin	= function(destObject){
	var props	= ['on', 'off', 'fire'];
	for(var i = 0; i < props.length; i ++){
		destObject.prototype[props[i]]	= MicroEvent.prototype[props[i]];
	}
}