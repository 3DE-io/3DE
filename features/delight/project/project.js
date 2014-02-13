component.exports = {
    magic: true,
    init: function(){
        var r = this,
            project = r.data.project
        this.on('select', function(e){
            project.current = e.context
        })
        // r.observe('project.current', function(newV, old){
        // 	console.log('project.current changed from', 
        //         old ? old.name : '<none>', 'to', 
        //         newV ? newV.name : '<none>')	
        // })
    }
}