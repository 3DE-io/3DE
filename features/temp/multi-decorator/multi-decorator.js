function decorator(fn){
   return function(node){
        var args = Array.prototype.slice.call(arguments, 1, arguments.length)
        fn.apply(node, args)
        return {
            teardown: function(){},
            update: fn
        }
    } 
}
//new keyword optional
var colorize = new decorator(function(r,g,b){
    var color = 'rgb(' + [r,g,b].join(',') + ')'
    console.log('color', color)
    this.style.color = color // this === node
})
var biggerize = decorator(function(pt){
    console.log('big', pt)
    this.style.fontSize = pt + 'pt'
})

function multi(decorators){
    return decorator(function(toCall){
        var node = this
        Object.keys(toCall).forEach(function(d){
            var args = [node].concat(toCall[d])
            decorators[d].apply(null, args)
        })
    })
}

component.exports = {
    decorators: {
        colorize: colorize,
        biggerize: biggerize,
        multi: multi({
            colorize: colorize,
            biggerize: biggerize,})
    }
}