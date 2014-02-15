component.exports = {
    	init: function(){
			var items = this.data.items
			this.on('add', function(e, item){
				if(!item){ return }
				items.push(item)
				this.data.new = ''
			})    		
            this.on('remove', function(e, item){
                if ((index = items.indexOf(item)) > -1) {
                    console.log(item, index)
                    items.splice(index, 1);
                }
			})
		},
		decorators: {
			sizeme: function(node, length){
                node.style.height = 100/length + '%'
				return { teardown: function(){} }
			}
		}
	}