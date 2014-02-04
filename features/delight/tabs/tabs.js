component.exports =  {
    beforeInit: function(o){
        var tabs = o.data.tabs
        o.data._tabs = Array.isArray(tabs) 
            ? tabs
            : Object.keys(tabs)
    }
}