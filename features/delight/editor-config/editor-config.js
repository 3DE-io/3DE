var themelist = ace.require("ace/ext/themelist")  

component.exports = {
    beforeInit: function(o){
        o.data.themes = themelist.themesByName
    }
}