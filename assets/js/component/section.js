var Transformer = require('./transform/transformer')

module.exports = function(name, steps, options){
	var self = this,
	  options = options || {},
	  xformOptions = options.xform || { pretty: true, debug: true },
	  transformer = new Transformer(xformOptions)

  this.name = name
	this.steps = []
	steps.forEach(function(step, index){

		var stepObj = self[step.name] = {
			get name(){
				return step.name
			},
			set name(v){ v=v },
			get mode(){
				return step.mode || step.name
			},
			set mode(v){ v=v },
			get code(){ 
				return step.code
			},
			set code(code){ 
				step.code = code
				stepObj.update()
			},
			update: function(){
				var code = step.code,
				transform = transformer[step.process||step.name],
				next = self.steps[index+1]

				if(!transform||!next) { return }

				transform(code, function(err, result){
					if(err){
						stepObj.error = err
					} else {
						stepObj.error = void 0
						next.code = result
					}
				})
			},
			get error(){
				return step.error
			},
			set error(error){
				if(error){
					step.error = error
				} else {
					stepObj.clearError()
				}
			},
			clearError: function(){
				delete step.error
			}
		}
		self.steps.push(stepObj)
	})

	this.steps[0].update()
}