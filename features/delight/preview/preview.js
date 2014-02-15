component.exports =  {
    complete: function(){
        var r = this,
            ifrm = this.find('iframe')

        this.observe('component', function(n,o){
            if(n===o){ return }
            ifrm.contentWindow.location.reload()
            loadPreview()
        }, { init: false })

        loadPreview()

        function package(component){
            var a = component.assets
            return {
                name: component.name,
                template: a.template.code.ractive,
                css: a.style.code.css,
                data: a.data.code.json,
                init: a.script.code.init 
            }
        }

        function loadPreview(){
            var all = []
            r.data.features.forEach(function(feature){
                feature.components.filter(function(component){
                    //MUSTDO: need to add feature name and compare on that too...
                    return component.name!==r.data.component.name
                })
                .forEach(function(component){
                    all.push( package(component) )
                })
            })

            ifrm.onload = function(){
                
                var iwin = ifrm.contentWindow,
                    doc = iwin.document,
                    component = package(r.data.component)
                    
                iwin.postMessage( { components: all }, '*')

                function componentMessage(data){
                    iwin.postMessage( data, '*')
                }

                componentMessage(component)

                r.observe('component.assets.style.code.css', function(css){
                    componentMessage({ css: css })
                })
                r.observe('component.assets.data.code.json', function(data){
                    componentMessage({ data: data })
                })
                r.observe('component.assets.template.code.ractive', function(template){
                    componentMessage({ template: template })
                })
                r.observe('component.assets.script.code.init', function(init){
                    componentMessage({ init: init })
                })

                

            }
        
        }

    	

    }
}
