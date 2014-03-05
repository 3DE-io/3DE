var assert = require('chai').assert,
	Section = require('../../assets/js/component/section')

describe('component section', function(){
	var steps =[
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
	]

	var section = new Section('template', steps)
	beforeEach(function(done){
		setTimeout(done, 1)
	})

	var jade = section.jade,
		mustache = section.mustache,
		ractive = section.ractive

	describe('creates section', function(){
	    it('has name', function(){
    		assert.equal(section.name, 'template')
	    })
	    it('has 3 steps', function(){
    		assert.equal(section.steps.length, 3)
	    })
	    it('has step shortcuts', function(){
	    	assert.ok(jade)
	     	assert.strictEqual(jade, section.steps[0])
	    	assert.ok(mustache)
	     	assert.strictEqual(mustache, section.steps[1])
	    	assert.ok(ractive)
	     	assert.strictEqual(ractive, section.steps[2])
	    })
	})

	describe('steps have names and mode', function(){
	    it('jade with name as mode', function(){
	    	assert.equal(jade.name, 'jade')
	    	assert.equal(jade.mode, 'jade')
	    })
	    it('mustache with name as mode', function(){
	    	assert.equal(mustache.name, 'mustache')
	    	assert.equal(mustache.mode, 'mustache')
	    })
	    it('ractive with name and json as mode', function(){
	    	assert.equal(ractive.name ,'ractive')
	    	assert.equal(ractive.mode, 'json')
	    })
	})

	
	describe('new component section', function(){
	    it('has correct jade', function(){
    		assert.equal(jade.code, 'p')
	    })
	    it('has correct mustache', function(){
	     	assert.equal(mustache.code, '<p></p>')
	    })
	    it('has correct ractive', function(){
	     	assert.equal(ractive.code, '[\n  "<p></p>"\n]')
	    })
	})
	
    describe('responds to change on jade', function(){
	    it('has correct jade', function(){
    		jade.code = 'ul'
	    	assert.equal(jade.code, 'ul')
	    })
	    it('has correct mustache', function(){
			assert.equal(mustache.code, '<ul></ul>')
	    })
	    it('has correct ractive', function(){
	     	assert.equal(ractive.code, '[\n  "<ul></ul>"\n]')
	    })
	})

	describe('responds to change on mustache', function(){
	    it('sets mustache', function(){
    		mustache.code = '<div></div>'
	    	assert.equal(mustache.code, '<div></div>')
	    })
	    it('has existing jade', function(){
    		assert.equal(jade.code, 'ul')
	    })
	    it('has correct mustache', function(){
			assert.equal(mustache.code, '<div></div>')
	    })
	    it('has correct ractive', function(){
	     	assert.equal(ractive.code, '[\n  "<div></div>"\n]')
	    })
	})

	describe('responds to jade with error', function(){
	    it('sets error jade', function(){
    		jade.code = 'p !{'
	    	assert.equal(jade.code, 'p !{')
	    })
	   	it('has error', function(){
	    	assert.ok(jade.error)
	    	assert.notEqual(jade.error.message.indexOf('p !{'), -1)
	    	assert.ok(steps[0].error)
	    })
	    it('has correct mustache', function(){
			assert.equal(mustache.code, '<div></div>')
	    })
	    it('has correct ractive', function(){
	     	assert.equal(ractive.code, '[\n  "<div></div>"\n]')
	    })
	})

	describe('then updates on correction', function(){
	    it('sets jade', function(){
    		jade.code = 'div 1'
	    	assert.equal(jade.code, 'div 1')
	    })
	   	it('clears error', function(){
	    	assert.notOk(jade.error)
	    	assert.notOk(steps[0].error)
	    })
	    it('has correct mustache', function(){
			assert.equal(mustache.code, '<div>1</div>')
	    })
	    it('has correct ractive', function(){
	     	assert.equal(ractive.code, '[\n  "<div>1</div>"\n]')
	    })
	})

	describe('error on mustache', function(){
	    it('set mustache', function(){
    		mustache.code = '<p>{{</p>'
	    })
	   	it('sets mustache error', function(){
	    	assert.ok(mustache.error)
	    	//assert.strictEqual(section.error.index, 1)
	    })
	})

	describe('error on jade supercedes', function(){
	    it('set bad jade', function(){
    		jade.code = 'p !{'
	    })
	   	it('sets error', function(){
	    	assert.ok(jade.error)
	    	//assert.strictEqual(section.error.index, 0)
	    })
	   	it('still has mustache error', function(){
	    	assert.ok(mustache.error)
	    	//assert.strictEqual(section.error.index, 1)
	    })
	})

	describe('doesn\'t clear error not if wrong index', function(){
	    it('set mustache', function(){
    		mustache.code = '<div>2</div>'
	    })
	   	it('still has jade error', function(){
	    	assert.ok(jade.error)
	    	//assert.strictEqual(section.error.index, 0)
	    })	   
	    it('updates ractive', function(){
	     	assert.equal(ractive.code, '[\n  "<div>2</div>"\n]')
	    })
	})
	
})
