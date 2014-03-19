
function PreviewWindow(iframe){
    var win = iframe.contentWindow

    this.send = function(m){
        win.postMessage(m, '*')
    }
}

component.exports = {
    magic: true,
    init: function(){
        var self = this,
            d = this.data,
            iframe = this.find('iframe')
            // _layout, _component

        // function loadable(){
        //     return _layout && _component
        // }

        this.reload = function(){
            // if(!loadable()) { return }
            if(iframe.contentWindow){
                iframe.contentWindow.location.reload()
            }           
        }

        // this.observe('project.layout', function(layout, old){
        //     if(layout===old) { return; }
        //     _layout = layout
        //     self.reload()
        // })  

        this.observe('component', function(component,old){
            if(component===old){ return }
            _component = component
            self.reload()
        })

        iframe.onload = function(){
            var pw = self.previewWindow = new PreviewWindow(iframe)

            //pw.postMessage( { components: all }, '*')
            
            pw.send(d.component.data)

        }

        self.update = function(name){
            if(!self.previewWindow) { return }
            var msg = {}
            msg[name] = d.component.data[name]
            self.previewWindow.send(msg)  
        }

            


    }
}
