var editor;

class Color3 {
	constructor(){
		var rgb;
		if(arguments.length == 1){
			var str = arguments[0];
			// console.log(str);
			if(str[0] == 'r' && str[1] == 'g' && str[2] == 'b'){
				str = str.slice(4, str.length-1);			
				rgb = str.split(", ");
			}
			else if(str[0] == '#' && str.length == 4){
				rgb = [];
				rgb.push(parseInt(str[1]+str[1], 16));
				rgb.push(parseInt(str[2]+str[2], 16));
				rgb.push(parseInt(str[3]+str[3], 16));
			}
		}else if(arguments.length == 3){
			rgb = [arguments[0], arguments[1], arguments[2]];
		}

		this.red = parseInt(rgb[0]);
		this.green = parseInt(rgb[1]);
		this.blue = parseInt(rgb[2]);

		this.testLimits();
	}

	testLimits(){
		if(this.red > 255) this.red = 255;
		if(this.green > 255) this.green = 255;
		if(this.blue > 255) this.blue = 255;

		if(this.red < 0) this.red = 0;
		if(this.green < 0) this.green = 0;
		if(this.blue < 0) this.blue = 0;
	}

	add(color){
		return new Color3(this.red + color.red, this.green + color.green, this.blue + color.blue);
	}

	subtract(color){
		return new Color3(this.red - color.red, this.green - color.green, this.blue - color.blue);
	}

	multiply(value){
		return new Color3(this.red * value, this.green * value, this.blue * value);
	}

	toString(){
		return 'rgb('+this.red+', '+this.green+', '+this.blue+')';
	}

	// Color3.prototype.toString = function(){
	// 	return 'rgb('+this.red+', '+this.green+', '+this.blue+')';
	// }
}

class Tool {
	constructor(element, name, actionFunction){
		this.element_html = element;
		this.name = name;
		this.action = actionFunction;

		this.element_html.title = name;
	}
}

class Toolbar {
	constructor(elementId){
		this.element_html = document.getElementById(elementId);

		this.toolList = [];
		this.lastTool;
		this.currentTool;
	}

	addTool(element, name, actionFunction){
		this.toolList.push(new Tool(element, name, actionFunction));
	}

	indexToolbar(){
		for(var i=0; i<this.toolList.length; i++){
			this.toolList[i].element_html.index = i;
		}
		this.lastTool = this.toolList[0];
		this.currentTool = this.toolList[0];
	}

	setCurrentTool(index){
		if(this.toolList.length <= index){
			console.log("Aquest boto no consta a toolList");
			return;
		}
		this.lastTool = this.currentTool;
		this.currentTool = this.toolList[index];
	}
}

class Wall {
	constructor(cela, side){
		this.cela = cela;
		this.side = side;

		this.cela.wall[side] = this;
		// this.code_html;
	}
}

class Cela {
	constructor(index){
		this.index = index;
		this.x;
		this.y;
		this.element_html;
		this.wall = [null, null, null, null];
	}

	setxy(columnes){
		this.x = this.index%columnes;
		this.y = (this.index - this.x)/columnes;
	}
}

class Quadricula {
	constructor(columnes, files){
		this.columnes = parseInt(columnes);
		this.files = parseInt(files);
		this.numCeles = columnes * files;
		this.cela = [];
		this.wall = [];

		this.drawArea;
		this.loadCells();
	}

	loadCells(){
		for(var i=0; i<this.numCeles; i++){
			this.cela.push( new Cela(i) );
			var cela = this.cela[i];
			cela.setxy(this.columnes);
		}
	}

	getIndex(x, y){
		return y * this.columnes + x;
	}

	getCela(x, y){
		return this.cela[y * this.columnes + x];
	}
}

class View{
	constructor(){
		this.DOM_workArea = document.getElementById("workArea");
		this.DOM_drawArea;
		this.DOM_quadricula;
		this.DOM_walls;
		this.properties = {
			'side_length': 50,
			'margin': 10,
			'wall_stroke': 3,
			'original_side_length': 50,
			'original_margin': 10,
			'original_wall_stroke': 3,
			'wallFillColor': "#333",

			'defaultColor': '#fff', 		//'rgb (255, 255, 255)',
			'mouseoverColor': '#ddd',
			'pathColor': '#888'
			// 'clickColor': '#fbb',
			// 'mousedownColor': '#bfb',
			// 'mouseupColor': '#bbf',

		};

		this.walls_html = [];

		this.ready_modals();
	}

	ready_modals(){
		this.bindModal("modal_newLab", "option_newLab");
		this.bindModal("modal_loadLab", "option_loadLab");
		this.bindModal("modal_zoom", "option_zoom");
	}

	displayOff(id){
		document.getElementById(id).style.display = "none";
	}

	bindModal(modalId, menuOptionId){
		var modal = document.getElementById(modalId);
		modal.onclick = function(event) {
			if (event.target == this)
				this.style.display = "none";
		};

		var menuOption = document.getElementById(menuOptionId);
		menuOption.onclick = function(){
			this.style.display = "block";
		};
		menuOption.onclick = menuOption.onclick.bind(modal);

		var span = modal.firstElementChild.firstElementChild;
		span.onclick = function() {
			this.style.display = "none";
		};
		span.onclick = span.onclick.bind(modal);
	}

	ready_drawArea(quadricula){
		this.DOM_workArea.innerHTML = "<svg id=\"drawArea\" width=\"100\" height=\"100\"></svg>";		//Valors per defecte
		this.DOM_drawArea = this.DOM_workArea.firstElementChild;

		var pp = this.properties;

		this.DOM_drawArea.innerHTML = "<svg id=\"Quadricula\" width=\"100\" height=\"100\"></svg>";		//Valors per defecte
		this.DOM_drawArea.innerHTML += "<svg id=\"Walls\" width=\"100\" height=\"100\"></svg>";			//Valors per defecte

		this.DOM_quadricula = this.DOM_drawArea.children[0];
		this.DOM_walls = this.DOM_drawArea.children[1];

		pp.width = quadricula.columnes * pp.side_length + 2 * pp.margin;
		pp.height = quadricula.files * pp.side_length + 2 * pp.margin;

		this.DOM_drawArea.width.baseVal.value = pp.width;
		this.DOM_drawArea.height.baseVal.value = pp.height;

		this.DOM_quadricula.width.baseVal.value = pp.width;
		this.DOM_quadricula.height.baseVal.value = pp.height;

		this.DOM_walls.width.baseVal.value = pp.width;
		this.DOM_walls.height.baseVal.value = pp.height;

		var code_html = "";
		for(var i=0; i<quadricula.numCeles; i++){
			code_html += "<rect width=\"10\" height=\"10\"></rect>";
		}
		this.DOM_quadricula.innerHTML = code_html;

		for(var i=0; i<quadricula.numCeles; i++){
			var cela = quadricula.cela[i];
			cela.element_html = this.DOM_quadricula.children[i];
			this.setDefaultCellStyle(cela, pp);
		}

		this.resetWalls();

	}

	setDefaultCellStyle(cela, pp){
		var rect = cela.element_html;
		rect.index = cela.index;
		rect.x.baseVal.value = cela.x * pp.side_length + pp.margin;
		rect.y.baseVal.value = cela.y * pp.side_length + pp.margin;
		rect.width.baseVal.value = pp.side_length;
		rect.height.baseVal.value = pp.side_length;
		rect.style.fill = pp.defaultColor;
		rect.style.stroke = "black";
		rect.style.strokeOpacity = "0.2";
	}

	setPathColor(model, index){
		model.quadricula.cela[index].element_html.style.fill = this.properties.pathColor;
	}

	fadeOutColor(model, path){
		var startTime = Date.now();
		var tmax = 1500;
		var fps = 60;
		
		var cela = model.quadricula.cela;
		var cellPath = [];
		for(var i=0; i<path.length; i++){
			cellPath.push(cela[path[i]]);
		}

		var startColor = new Color3(cellPath[0].element_html.style.fill);	//Aixo hauria de venir de view.properties
		var targetColor = new Color3(this.properties.defaultColor);
		var colorVector = targetColor.subtract(startColor);

		var interval;
		var fadeOutEnd = function(){
			clearInterval(interval);
		};

		var fadeOutStep = function(){
			var elapsedTime = Date.now() - startTime;
			// console.log(elapsedTime);
			var timeVariation = elapsedTime/tmax;
			var colorVariation = colorVector.multiply(timeVariation);
			var color = startColor.add(colorVariation);

			if(targetColor == color){
				console.log("FadeOut is done");
				return;
			}else{
				for(var i=0; i<cellPath.length; i++){
					cellPath[i].element_html.style.fill = color;
				}
			}
		};

		interval = setInterval(fadeOutStep, 1000/fps);
		setTimeout(fadeOutEnd, tmax);
	}

	getWallCodeHtml(model, wall){
		var pp = this.properties;
		var cela = wall.cela;

		var x = cela.x * pp.side_length + pp.margin - pp.wall_stroke;
		var y = cela.y * pp.side_length + pp.margin - pp.wall_stroke;
		var width = pp.side_length + 2 * pp.wall_stroke;
		var height = 2 * pp.wall_stroke;

		if(wall.side%2 != 0){
			var aux = width;
			width = height;
			height = aux;
		}

		switch(wall.side){
			case 0: break;
			case 1: x += pp.side_length; break;
			case 2: y += pp.side_length; break;
			case 3: break;
		}

		return "<rect width=\""+ width +
			"\" height=\""+ height +
			"\" fill=\""+ this.properties.wallFillColor +
			"\" x=\""+ x +"\" y=\""+ y +"\"></rect>";
	}

	ready_toolbar(toolbar){
		var toolList = toolbar.toolList;
		for(var i=0; i<toolList.length; i++){
			toolList[i].element_html.classList.add("tool_button");
		}
		toolbar.currentTool.element_html.classList.replace("tool_button", "tool_button_current");
	}

	updateCurrentTool(toolbar){
		var last = toolbar.lastTool.element_html;
		var current = toolbar.currentTool.element_html;
		if(last == current){
			return;
		}
		if(last.classList.contains("tool_button_current"))
			last.classList.replace("tool_button_current", "tool_button");
		if(current.classList.contains("tool_button"))
			current.classList.replace("tool_button", "tool_button_current");
	}

	draw(model){
		var wall, code_html = "";		//Omplir les dades que passarem a innerHTML
		var cela = model.quadricula.cela;

		var count = 0;

		if (this.walls_html.length == 0)
			for(var i=0; i<cela.length; i++)
				for(var s=0; s<4; s++)
					this.walls_html.push("");

		for(var i=0; i<cela.length; i++){
			for(var s=0; s<4; s++){

				wall = cela[i].wall[s];
				if(wall == null){
					this.walls_html[4*i + s] = "";
					continue;
				}

				if(this.walls_html[4*i + s] == ""){
					this.walls_html[4*i + s] = this.getWallCodeHtml(model, wall);
					count++;
				}

				code_html += this.walls_html[4*i + s];
			}
		}
		this.DOM_walls.innerHTML = code_html;
		console.log(count);
	}

	resetWalls(){
		this.walls_html = []
	}

}

class Model{
	constructor(){
		this.quadricula;
	}

	getWalls(){
		var wall, walls = [];
		for(var i=0; i<this.quadricula.cela.length; i++){
			for(var s=0; s<4; s++){
				wall = this.quadricula.cela[i].wall[s];
				if(wall) walls.push(wall);
			}
		}
		return walls;
	}

	removeWall(cela, side){
		cela.wall[side] = null;
	}

	loadBorders(){
		var quadricula = this.quadricula;
		var files = quadricula.files;
		var columnes = quadricula.columnes;
		var cela, side;

		// top: side 0, index: (i, 0)
		for (var i=0; i<columnes; i++){
			cela = quadricula.getCela(i, 0);
			side = 0;	//top
			new Wall(cela, side);
		}

		// right: side 1, index: (columnes-1, i)
		for (var i=0; i<files; i++){
			cela = quadricula.getCela(columnes-1, i);
			side = 1;	//right
			new Wall(cela, side);
		}

		// bottom: side 2, index: (i, files-1)
		for (var i=0; i<columnes; i++){
			cela = quadricula.getCela(i, files-1);
			side = 2;	//bottom
			new Wall(cela, side);
		}

		// left: side 3, index: (0, i)
		for (var i=0; i<files; i++){
			cela = quadricula.getCela(0, i);
			side = 3;	//left
			new Wall(cela, side);
		}
	}

	/* MENU EVENTS */
	loadLab(data){
		if(!data.header){
			console.log("No es pot llegir el fitxer");
			return;
		}else if(data.header.celes != data.wall.length){
			console.log("Fitxer incoherent");
			return;
		}

		this.quadricula = new Quadricula(data.header.columnes, data.header.files);

		//loadWalls
		var cela = this.quadricula.cela;
		var wall = data.wall;
		for(var i=0; i<wall.length; i++){
			for(var side=0; side<4; side++){
				if(wall[i][side] == 1) new Wall(cela[i], side);
			}
		}
	}


	/* CELL EVENTS */
	computeDirectionPath(path){
		var columnes = this.quadricula.columnes;
		var direction, dif;
		var directionPath = [];

		for(var i=1; i<path.length; i++){
			dif = path[i] - path[i-1];
			if(dif == 1){
				direction = 1;
			}else if(dif == -1){
				direction = 3;
			}else if(dif == columnes){
				direction = 2;
			}else if(dif == - columnes){
				direction = 0;
			}
			directionPath.push(direction);
		}	
		return directionPath;
	}

	createPathWalls(path){
		var directionPath = this.computeDirectionPath(path);
		var directionChange = [0];
		for(var i=1; i<directionPath.length; i++){
			directionChange.push(directionPath[i] - directionPath[i-1]);
		}

		var index;
		var cela;
		var corner;
		for(var i=0; i<path.length - 1; i++){
			index = path[i];
			cela = this.quadricula.cela[index];
			cela.wall = [null, null, null, null];

			if(directionChange[i] == 0){
				//Parets Paraleles
				if(directionPath[i] % 2 == 0){
					new Wall(cela, 1);
					new Wall(cela, 3);
				}else if(directionPath[i] % 2 == 1){
					new Wall(cela, 0);
					new Wall(cela, 2);
				}
			}else if(directionChange[i] % 2 != 0){
				var p = directionPath[i-1];
				var c = directionChange[i];
				corner = [p, p-c];

				if(corner[1] < 0) corner[1] += 4;
				else if (corner[1] > 3) corner[1] -= 4;

				new Wall(cela, corner[0]);
				new Wall(cela, corner[1]);
			}
		}
		// ultim element
		index = path[path.length - 1];
		cela = this.quadricula.cela[index];
		for(var i=0; i<4; i++){
			var dif = directionPath[directionPath.length - 1] - i;
			if(dif % 2 != 0){
				new Wall(cela, i);
			}
		}
	}

	destroyWall(index, side){
		var cela = this.quadricula.cela;
		var c = this.quadricula.columnes;
		cela[index].wall[side] = null;
		switch(side){
			case 0: cela[index - c].wall[2] = null; break;
			case 1: cela[index + 1].wall[3] = null; break;
			case 2:
				var cela2 = cela[index + c];
				// console.log(cela2);
				cela[index + c].wall[0] = null;
				break;
			case 3: cela[index - 1].wall[1] = null; break;
		}
	}

	erasePathWalls(path){
		var directionPath = this.computeDirectionPath(path);
		var index;
		var side;

		for(var i=0; i<path.length - 1; i++){
			index = path[i];
			side = directionPath[i];
			this.destroyWall(index, side);
		}
	}

}

class Controller{
	constructor(){
		this.model = new Model();
		this.view = new View();

		this.ready_menu.call(this);

		/* AIXO NO VA AQUI */
		this.actionFunctions = {
			createPathWalls : null,
			erasePathWalls : null,
			createBridge : null
		};
		this.define_actionFunctions();
		/**/

		this.toolbar_left = new Toolbar("tools_left");
		this.ready_toolbar_left();

		this.actionStack = [];
		this.mouseIsDown = false;
	}

	ready_menu(){
		document.getElementById("newLab").addEventListener('submit', this.newLab.bind(this), false);
		document.getElementById("loadLab").addEventListener('change', this.loadLab.bind(this), false);
		document.getElementById("option_saveLab").addEventListener('click', this.saveLab.bind(this), false);

		this.ready_zoomEvents.call(this);
		//TODO
		//loadLab No nomes onchange
	}

	ready_zoomEvents(){
		var zoomRange = document.getElementById("zoom_range");
		var zoomNumber = document.getElementById("zoom_number");

		zoomRange.addEventListener('input', function(event){
			zoomNumber.value = this.value;
		}, false);

		zoomNumber.addEventListener('change', function(event){
			zoomRange.value = this.value;
		}, false);

		var zoomEnquadraValues = function(){
			zoomRange.value = 100;
			zoomNumber.value = 100;
			this.zoom.call(this);
		};

		document.getElementById("zoom_enquadra").addEventListener('click', zoomEnquadraValues.bind(this), false);
		document.getElementById("zoom").addEventListener('submit', this.zoom.bind(this), false);

	}

	define_actionFunctions(){
		this.actionFunctions.createPathWalls = function(path){
			this.model.createPathWalls(path);
			this.view.draw(this.model);
		};

		this.actionFunctions.erasePathWalls = function(path){
			this.model.erasePathWalls(path);
			this.view.draw(this.model);
		};

		this.actionFunctions.createBridge = function(){
			console.log("createBridge is not implemented yet");
		};
	}

	ready_toolbar_left(){
		var toolElement = this.toolbar_left.element_html.firstElementChild.children;
		this.toolbar_left.addTool(toolElement[0], "llapis", this.actionFunctions.createPathWalls.bind(this));
		this.toolbar_left.addTool(toolElement[1], "goma", this.actionFunctions.erasePathWalls.bind(this));
		this.toolbar_left.addTool(toolElement[2], "pont", this.actionFunctions.createBridge.bind(this));

		for(var i=0; i<toolElement.length; i++){
			toolElement[i].addEventListener('click', this.toolClickEvent.bind(this));
		}

		this.toolbar_left.indexToolbar();
		this.view.ready_toolbar(this.toolbar_left);
		this.view.updateCurrentTool(this.toolbar_left);
	}

	toolClickEvent(event){
		var path = event.path;
		var target;
		for(var i=0; i<path.length; i++){
			if(path[i].nodeName == "LI"){
				target = path[i];
				break;
			}
		}
		this.toolbar_left.setCurrentTool(target.index);
		this.view.updateCurrentTool(this.toolbar_left);
	}

	cellMousedownEvent(event){
		this.mouseIsDown = true;
		this.view.setPathColor(this.model, event.target.index);

		// actionStack s'ha de transformar competament
		var path = [];
		path.push(event.target.index);
		this.actionStack.push(path);
	}

	cellMouseenterEvent(event){
		if(this.mouseIsDown){
			this.view.setPathColor(this.model, event.target.index);
			// actionStack s'ha de transformar competament
			this.actionStack[this.actionStack.length-1].push(event.target.index);
		}
	}

	cellMouseupEvent(event){
		this.mouseIsDown = false;
		this.view.setPathColor(this.model, event.target.index);
	
		// actionStack s'ha de transformar competament
		var path = this.actionStack[this.actionStack.length-1];
		this.toolbar_left.currentTool.action(path);

		this.view.fadeOutColor(this.model, path);
	}

	cellClickEvent(event){}

	ready_cell_events(){
		var cela = this.model.quadricula.cela;
		var e;
		for(var i=0; i<cela.length; i++){
			e = cela[i].element_html;
			e.addEventListener("click", this.cellClickEvent.bind(this));
			e.addEventListener("mousedown", this.cellMousedownEvent.bind(this));
			e.addEventListener("mouseup", this.cellMouseupEvent.bind(this));
			e.addEventListener("mouseenter", this.cellMouseenterEvent.bind(this));
			// e.addEventListener("mouseover", this.cellMouseoverEvent);
		}
	}

	newLab(event){
		this.view.displayOff("modal_newLab");

		var width = parseInt(event.target[0].value);
		var height = parseInt(event.target[1].value);
		
		var model = this.model;
		model.quadricula = new Quadricula(width, height);
		model.loadBorders();

		this.view.ready_drawArea(model.quadricula);
		this.view.draw(model);

		this.ready_cell_events.call(this);
	}

	loadLab(event){
		this.view.displayOff("modal_loadLab");
		var files = event.target.files;
		if (!files[0]) {
			console.log("no hi ha cap fitxer");
			return;
		}else if(files.length > 1){
			console.log("hi ha mes d'un fitxer");
		}
		var reader = new FileReader();
		reader.readAsText(files[0]);

		reader.onload = function(){
			var content = reader.result;
			
			var regexCeles = /(?<=Celes\: )(\d*)/gm,
				regexColumnes = /(?<=Columnes\: )(\d*)/gm,
				regexFiles = /(?<=Files\: )(\d*)/gm,
				regexWalls = /(?<=#\d*: )\d*/gm;

			var data = {
				header: {},
				wall : []
			};
			data.header = {
				celes : regexCeles.exec(content)[0],
				columnes : regexColumnes.exec(content)[0],
				files : regexFiles.exec(content)[0]
			};
			var search = regexWalls.exec(content);
			while(search){
				data.wall.push(search[0]);
				search = regexWalls.exec(content);
			}

			this.model.loadLab(data);

			this.view.ready_drawArea(this.model.quadricula);
			this.view.draw(this.model);

			this.ready_cell_events.call(this);

		};
		reader.onload = reader.onload.bind(this);
	}

	saveLab(){
		var text = "";
		var q = this.model.quadricula;
		var cela = q.cela;

		text += "#Celes: "+q.numCeles +"\n";
		text += "#Columnes: "+q.columnes+"\n"; 
		text += "#Files: "+q.files+"\n\n";
		for(var i=0; i<q.numCeles; i++){
			text += "#"+i+": ";
			for(var s=0; s<4; s++){
				if (cela[i].wall[s]) text +=  "1";
				else text +=  "0";
			}
			text += "\n";
		}
		// console.log(text);

		var filename = "Lab_"+ q.columnes +"x"+ q.files +".txt";
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain; charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

	zoom(event){
		this.view.displayOff("modal_zoom");
		var percent, cell, wall;	
		if(event.target.id == "zoom_enquadra"){
			console.log("Enquadra");
		}else if(event.target.id == "zoom"){
			console.log("Zoom: " + event.target[0].value);
			percent = event.target[0].value/100;
			
			var pp = this.view.properties;
			pp.side_length = pp.original_side_length * percent;
			pp.margin = pp.original_margin * percent;
			pp.wall_stroke = pp.original_wall_stroke * percent;

			this.view.ready_drawArea(this.model.quadricula);
			this.view.draw(this.model);
			this.ready_cell_events.call(this);
		}
	}

}

window.onload = function(){
	editor = new Controller();
};