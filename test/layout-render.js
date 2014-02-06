var jade = require('jade'),
	fs = require('fs'),
	layout = fs.readFileSync('../features/temp/layout/layout.jade')
	component = {
		ractive: "[{\"t\":7,\"e\":\"p\",\"f\":[\"hello \",{\"t\":2,\"r\":\"world\"}]}]",
		css: "p {\n  color: #008000;\n}\n",
		data: "{\n  \"world\": \"earth\"\n}",
		init: "//hello"
	}
	render = jade.render(layout, component)

console.log(render)