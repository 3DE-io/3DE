component.exports = {
    	init: function(){
			var items = this.data.items
			this.on('add', function(e, item){
				if(!item){ return }
				items.push(item)
				this.data.new = ''
			})
		},
		decorators: {
			sizeme: function(node, length){
				return { teardown: function(){} }
			}
		}
	}