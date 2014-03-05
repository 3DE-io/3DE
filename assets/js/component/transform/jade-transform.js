var jade = require('./../../ref/jade.js'),
	async = require('../../util/function/sync-as-async')

module.exports = function(options){
	return async(function(jadeLang){
		return jade.render(jadeLang, options).trim()
	})
}