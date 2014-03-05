var assert = require('chai').assert

var Transformer = require('../../assets/js/component/transform/transformer.js')
var transformer = new Transformer({
	pretty: true, debug: true
}) 

function test(name, good, bad){
	describe(name, function(){
		var process = transformer[name]
	    it('good', function(done){
	    	process(good.in, function(e, r){
	    		try {
	    			assert.isNull(e)
	    			assert.equal(r, good.out)
	    			done()
	    		} catch(err){
	    			done(err)
	    		}
	    	})
	    })
	    
	    it('bad', function(done){
	    	process(bad, function(e,r){
	    		assert(e)
	    		assert(!r)
	    		done()
	    	})
	    })
	    it('null', function(done){
	    	process(null, function(e,r){
	    		assert(!e)
	    		assert(!r)
	    		done()
	    	})
	    })
	})
}


describe('Transformer', function(){
	describe('processes', function(){
		test('jade',
			{ in: 'p hello', out: '<p>hello</p>' },
			'p !{'
		)
		test('ractive', 
			{ in: '<p>hello {{world}}</p>', out: '[\n  {\n    "t": 7,\n    "e": "p",\n    "f": [\n      "hello ",\n      {\n        "t": 2,\n        "r": "world"\n      }\n    ]\n  }\n]' },
			'<p>{{'
		)
		test('stylus', 
			{ in: 'p\n\tcolor white', out: 'p {\n  color: #fff;\n}\n' },
			'<p>{{'
		)
		test('eval', 
			{ in: '{ world: \'earth\' }', out: '{\n  "world": "earth"\n}' },
			'{ wor {'
		)
	})
})