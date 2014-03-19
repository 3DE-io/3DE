var Section = require('./section')

module.exports = function(componentData, options){
    var self = this,
        options = options || {},
        sectionNames = ['template', 'style', 'data', 'script']
        sections = []
        lastSteps = []

    componentData = fillDefaults(componentData)

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

function fillDefaults(data){
    data = data || {}
    var defaultSections
    function fill(part){
        if(!data[part]){
            if(!defaultSections){ defaultSections = empty()}
            data[part] = defaultSections[part]
        }        
    }
    ['template', 'style', 'data', 'script'].forEach(fill)  

    return data 
}

function empty(){
    return {
        "template": [
          {
            "name": "jade"
          },
          {
            "name": "mustache",
            "process": "ractive"
          },
          {
            "name": "ractive",
            "mode": "json"
          }
        ],
        "style": [
          {
            "name": "stylus"
          },
          {
            "name": "css"
          }
        ],
        "data": [
          {
            "name": "js",
            "process": "eval"
          },
          {
            "name": "json"
          }
        ],
        "script": [
          {
            "name": "init",
            "mode": "js"
          }
        ]
    }
}

function Component(lastSteps){
    var self = this
    self.data = {}

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

        Object.defineProperty(self.data, name, {
            get: function(){
                return codeProp.get()
            },
            configurable: true,
            enumerable: true
        })        
    })
      
}
var microevent = require('../util/event/microevent')
microevent.mixin(Component)





