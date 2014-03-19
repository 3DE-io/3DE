component.exports = {
    beforeInit: function(o){
    
        var d = o.data
        d.allconfig = d.allconfig || {}
        if(!d.allconfig[d.type]) { d.allconfig[d.type] = {} }
        
        d.config = d.allconfig[d.type]
        
        for(var key in d.defaultConfig){
            if(!d.config.hasOwnProperty(key)) {
                d.config[key] = d.defaultConfig[key]
            }
        }
        
        if(!d.config.hasOwnProperty('noLiveRefresh')){
            d.config.noLiveRefresh = false
        }
       
    }
}