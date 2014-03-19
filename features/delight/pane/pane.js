var defaultPosition = { position: { x:50, y:50 } }

component.exports = {
    setContext: function(pane){
        if(!this.data.pane){
            console.log('no pane')
            return
        }
        return this.data.pane

    },
    getIndex: function(pane){
        var node = this.find('pane-node')
        if(!node){
            console.log('no node :(')
            return
        }
        var all = node.parentNode.children,
            myIndex = Array.prototype.indexOf.call(all, node);
            
        console.log('index is', myIndex)
        return myIndex

    },
    beforeInit: function(o){
       
    }
}