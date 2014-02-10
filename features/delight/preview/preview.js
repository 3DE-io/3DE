component.exports =  {
    decorators: {
      render: function(node){
        var r=this
        //console.log('decorator', JSON.stringify(r.data))
        return { teardown:function(){} }
      }  
    },
    complete: function(){
        var c = this.data.component,
            component
        if(c) {
            component = {
                template: c.template.code.ractive,
                css: c.style.code.css,
                data: c.data.code.json,
                init: c.script.code.js 
            }
        }
        
        var html
        try{
            html = jade.render(layout, component)
        } catch(e){
            html = e.message
        }
        
        var ractive = this
    
        //var preview = this.find('.preview')
        //ifrm = document.createElement("IFRAME"); 
       	//ifrm.setAttribute("name", "preview");
	   	//ifrm.setAttribute("class", "preview"); 
	   	//preview.appendChild(ifrm); 
        var ifrm = this.find('iframe')
        ifrm.onload = function(){
            
            var iwin = ifrm.contentWindow,
                doc = iwin.document
            
            
            // try {
            // doc.open()
            // doc.write(html)
            // doc.close()
            // }
            // catch(e){
            //     console.log('write err', e)
            // }

            iwin.postMessage(component, '*')

            ractive.observe('component.style.code.css', function(css){
                iwin.postMessage({ css: css }, '*')
            })
            ractive.observe('component.data.code.json', function(data){
                iwin.postMessage({ data: data }, '*')
            })
            ractive.observe('component.template.code.ractive', function(template){
                iwin.postMessage({ template: template }, '*')
            })
            ractive.observe('component.script.code.js', function(init){
                iwin.postMessage({ init: init }, '*')
            })

            

        }
        


    	

    },
    beforeInit: function(o){
        // console.log('preview data', o.data)
    }
}
