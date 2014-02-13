component.exports =  {
    complete: function(){
        var assets = this.data.component.assets
       

        var ractive = this
    
        //var preview = this.find('.preview')
        //ifrm = document.createElement("IFRAME"); 
       	//ifrm.setAttribute("name", "preview");
	   	//ifrm.setAttribute("class", "preview"); 
	   	//preview.appendChild(ifrm); 
        var ifrm = this.find('iframe')
        ifrm.onload = function(){
            
            var iwin = ifrm.contentWindow,
                doc = iwin.document,
                component
            
            if(assets) {
                component = {
                    template: assets.template.code.ractive,
                    css: assets.style.code.css,
                    data: assets.data.code.json,
                    init: assets.script.code.init 
                }
            }

            iwin.postMessage(component, '*')

            ractive.observe('component.assets.style.code.css', function(css){
                iwin.postMessage({ css: css }, '*')
            })
            ractive.observe('component.assets.data.code.json', function(data){
                iwin.postMessage({ data: data }, '*')
            })
            ractive.observe('component.assets.template.code.ractive', function(template){
                iwin.postMessage({ template: template }, '*')
            })
            ractive.observe('component.assets.script.code.init', function(init){
                iwin.postMessage({ init: init }, '*')
            })

            

        }
        


    	

    },
    beforeInit: function(o){
        // console.log('preview data', o.data)
    }
}
