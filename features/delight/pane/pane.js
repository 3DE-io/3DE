component.exports = {
    data: {
        calcStyle: function(ignore, p1, v1, p2, v2){
            var style = p1 + ': ' + v1 + '%; '
            if(p2) {
                style += p2 + ': ' + v2 + '%;'
            }
            return style
        }
    }
}