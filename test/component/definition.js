var assert = require('chai').assert,
	Definition = require('../../assets/js/component/definition')
	Section = require('../../assets/js/component/section')

describe('component definition', function(){

	describe('creates definition', function(){
		var data = {
		    name: 'mycomponent',
		    template: [
		      {
		        name: 'jade',
		        code: 'p'
		      },
		      {
		        name: 'mustache',
		        process: 'ractive'
		      },
		      {
		        mode: 'json',
		        name: 'ractive'
		      }
		    ],
		    style: [
		      {
		        name: 'stylus',
		        code: 'p\n\tcolor blue'
		      },
		      {
		        mode: 'jade',
		        name: 'css'
		      }
		    ],
		    data: [
		      {
		        name: 'js',
		        code: '{ world: \'earth\' }',
		        process: 'eval'
		      },
		      {
		        name: 'json'
		      }
		    ],
		    script: [
		      {
		        mode: 'js',
		        name: 'init'
		      }
		    ]
		}

		var define = new Definition(data)

		beforeEach(function(done){
			setTimeout(done, 1)
		})

	    it('has name', function(){
    		assert.equal(define.name, data.name)
	    })
	    it('has 4 sections', function(){
    		assert.ok(define.template instanceof Section, 'template')
    		assert.ok(define.style instanceof Section, 'style')
    		assert.ok(define.data instanceof Section, 'data')
    		assert.ok(define.script instanceof Section, 'script')
    		
    		assert.equal(define.template.name, 'template')
    		assert.equal(define.style.name, 'style')
    		assert.equal(define.data.name, 'data')
    		assert.equal(define.script.name, 'script')
	    })

		describe('has component', function(){
			var component = define.component
		    it('a property', function(){
    			assert.ok(component)
		    })
		    it('with final data from each step', function(){
	    		assert.equal(component.template, '[\n  "<p></p>"\n]')
	    		assert.equal(component.style, 'p {\n  color: #00f;\n}\n')
	    		assert.equal(component.data, '{\n  "world": "earth"\n}')
	    		assert.isUndefined(component.script)
		    })

		    it('with configurable properties', function(){
		    	assert.isTrue(Object.getOwnPropertyDescriptor(component, 'template').configurable)
		    })

		    it('raises events when underlying definition is updated', function(done){
		    	component.on('change', function(section){
		    		assert.equal(section, 'template')		    		
		    		assert.equal(component.template, '[\n  "<div></div>"\n]')
		    		done()
		    	})
		    	define.template.jade.code = 'div'
		    })
		})
	})

	describe('throws if section is missing', function(){
		var data = {
		    name: 'notemplate',
		    style: [],
		    data: [],
		    script: []
		}
		
		it('on construction', function(){
			assert.throws(function(){
    			new Definition(data)	
			}, /no section template found/)
	    })
	})

})
