
loader.loadAll(components)

var config = new ConfigService()

function ConfigService() {

	var defaultPane = {
		version: '0.0.1',
		position: { x: 10, y: 50 },
		pane: {
			position: { x: 70, y: 50 },
			pane: {
				position: { x: 50, y: 50 }
			}
		}
	}

	return {
		get pane(){
			var ls = localStorage.paneConfig
			// if(!ls) {
				ls = defaultPane
			// } else {
			// 	ls = JSON.parse(ls)	
			// 	if(!ls.version) { 
			// 		ls = defaultPane 
			// 	}
			// }
			return ls
		},
		set pane(pc){
			//localStorage.paneConfig = JSON.stringify(pc)
			localStorage.project = JSON.stringify(data)
		}
	}
}


var projectData = localStorage.project
if(projectData){
	setTimeout(function(){
		console.log('loading project from localStorage')
		var data = JSON.parse(projectData),
			current = data.project.current,
			currentComp
		data.project.features.some(function(feature){
			return feature.components.some(function(component){
				if(component.name === current) { 
					currentComp = component 
					return true;
				}
			})
		})
		data.project.current = currentComp
		load(data)
	})
} else {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'data/project.json', true);
	xhr.onreadystatechange = function (aEvt) {
		if (xhr.readyState == 4) {
			if(xhr.status == 200) {
				console.log('loading default project from server')
				load(JSON.parse(xhr.responseText))
			}
			else {
				alert('failed to load project data')
			}
		}

	}
	xhr.send(null);	
}


function load(data){
	window.data = data = {
		pane: {
			position: { x: 20 },
			pane: {
				position: { x: 70, y: 50 },
				pane: {
					position: { x: 50, y: 50 }
				}
			}
		}
		,
		project: {
			layout: null,
			add: {} //Ractive bug workaround
		},
		config : {}
	}

	var ractive,
		Component = Ractive.components.threeDE
	try {
		ractive = new Component({
			debug: true,
			el: document.body,
			//template: '<threeDE/>',
			data: data
		})


	} catch(error){
		document.body.innerHTML = error
	}

	// window.onbeforeunload = function(){
	// 	console.log('writing project to localStorage')
	// 	if(ractive) { ractive.teardown() }
	// 	var current = data.project.current.name
	// 	delete data.project.current
	// 	data.project.current = current
	// 	localStorage.project = JSON.stringify(data)
	// }
}
