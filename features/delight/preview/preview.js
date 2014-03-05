
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

        self.reload = function(){
            if(iframe.contentWindow){
                iframe.contentWindow.location.reload()
            }           
        }

        iframe.onload = function(){
            var pw = self.previewWindow = new PreviewWindow(iframe)

            //pw.postMessage( { components: all }, '*')
            
            //hack
            var _events = d.component._events
            delete d.component._events

            pw.send(d.component)

            d.component._events = _events
        }

        self.update = function(name){
            //debugger;
            var msg = {}
            msg[name] = this.data.component[name]
            this.previewWindow.send(msg)  
        }

        this.observe('component', function(component,old){
            if(component===old){ return }
            if(iframe.contentWindow){
                iframe.contentWindow.location.reload()
            }
            self.reload()
        })
            


    }
}
