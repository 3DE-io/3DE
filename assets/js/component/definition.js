var Section = require('./section')

module.exports = function(componentData, options){
    var self = this,
        options = options || {},
        sectionNames = ['template', 'style', 'data', 'script']
        sections = []
        lastSteps = []

    sectionNames.forEach(function(sectionName){
        var sectionData = componentData[sectionName]
        if(!sectionData) { 
            throw new Error('no section ' + sectionName + ' found in data')
        }

        var section = new Section(sectionName, sectionData, options)
        sections.push(section)
        sections[sectionName] = section

        lastSteps.push({ 
            name: sectionName,
            lastStep: section.steps[section.steps.length-1]
        })
    })

    var component = new Component(lastSteps)

    return {
        get name(){
            return componentData.name
        },
        get template(){
            return sections.template
        },
        get style(){
            return sections.style
        },
        get data(){
            return sections.data
        },
        get script(){
            return sections.script
        },
        get component(){
            return component
        }
    }

}


var microevent = require('../util/event/microevent')
function Component(lastSteps){
    var self = this

    lastSteps.forEach(function(step){
        var lastStep = step.lastStep,
            name = step.name,
            codeProp = Object.getOwnPropertyDescriptor( lastStep, 'code' );

        Object.defineProperty(lastStep, 'code', {
            get: function(){
                return codeProp.get()
            },
            set: function(code){
                codeProp.set(code)
                self.fire('change', name)
            },
            configurable: true,
            enumerable: true
        })

        Object.defineProperty(self, name, {
            get: function(){
                return codeProp.get()
            },
            set: function(v){},
            configurable: true,
            enumerable: true
        })        
    })
      
}
microevent.mixin(Component)





