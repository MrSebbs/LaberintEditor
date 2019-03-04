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
			rgb = [arguments[0], arguments[1], arguments[2]]
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
		this.code_html;
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
			'wallFillColor': "#333",

			'defaultColor': '#fff', 		//'rgb (255, 255, 255)',
			'mouseoverColor': '#ddd',
			'pathColor': '#888'
			// 'clickColor': '#fbb',
			// 'mousedownColor': '#bfb',
			// 'mouseupColor': '#bbf',

		};

		this.ready_modals();
	}

	ready_modals(){
		this.bindModal("modal_newLab", "option_newLab");
		this.bindModal("modal_loadLab", "option_loadLab");
	}

	displayOff(id){
		document.getElementById(id).style.display = "none";
	}

	bindModal(modalId, menuOptionId){
		var modal = document.getElementById(modalId);
		modal.onclick = function(event) {
			if (event.target == this)
				this.style.display = "none";
		}

		var menuOption = document.getElementById(menuOptionId);
		menuOption.onclick = function(){
			this.style.display = "block";
		}
		menuOption.onclick = menuOption.onclick.bind(modal);

		var span = modal.firstElementChild.firstElementChild;
		span.onclick = function() {
			this.style.display = "none";
		}
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

		pp.width = quadricula.columnes * pp.side_length + 2 * pp.margin;;
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
		model.quadricula.cela[index].element_html.style.fill = model.view.properties.pathColor;
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
		var targetColor = new Color3(model.view.properties.defaultColor);
		var colorVector = targetColor.subtract(startColor);

		var interval;
		var fadeOutEnd = function(){
			clearInterval(interval);
		}

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
		}

		interval = setInterval(fadeOutStep, 1000/fps);
		setTimeout(fadeOutEnd, tmax);
	}

	setWallCodeHtml(model, wall){
		var pp = model.view.properties;
		var cela = wall.cela;

		var x = cela.x * pp.side_length + pp.margin - pp.wall_stroke;
		var y = cela.y * pp.side_length + pp.margin - pp.wall_stroke;
		var width = pp.side_length + 2 * pp.wall_stroke;
		var height = 2 * pp.wall_stroke;

		// var fillColor = "#333";
		// Aixo ho hem de posar a quadricula.properties

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

		wall.code_html = "<rect width=\""+width
			+"\" height=\""+height
			+"\" fill=\""+this.properties.wallFillColor
			+"\" x=\""+x+"\" y=\""+y+"\"></rect>";
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
		var code_html = "";		//Omplir les dades que passarem a innerHTML
		var cela = model.quadricula.cela;

		for(var i=0; i<cela.length; i++){
			for(var side=0; side<4; side++){
				var wall = cela[i].wall[side];
				if(wall) code_html += wall.code_html;
			}
		}
		this.DOM_walls.innerHTML = code_html;
	}

}

class Model{
	constructor(){
		this.view = new View();
		this.quadricula;
	}

	/* WALL UTIL */
	addWall(cela, side){
		var wall = new Wall (cela, side)
		this.view.setWallCodeHtml(this, wall);
	}

	removeWall(cela, side){
		cela.wall[side] = null
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
			this.addWall(cela, side);
		}

		// right: side 1, index: (columnes-1, i)
		for (var i=0; i<files; i++){
			cela = quadricula.getCela(columnes-1, i);
			side = 1;	//right
			this.addWall(cela, side);
		}

		// bottom: side 2, index: (i, files-1)
		for (var i=0; i<columnes; i++){
			cela = quadricula.getCela(i, files-1);
			side = 2;	//bottom
			this.addWall(cela, side);
		}

		// left: side 3, index: (0, i)
		for (var i=0; i<files; i++){
			cela = quadricula.getCela(0, i);
			side = 3;	//left
			this.addWall(cela, side);
		}
	}

	/* MENU EVENTS */
	newLab(columnes, files){
		this.quadricula = new Quadricula(columnes, files);
		this.loadBorders();
		this.view.ready_drawArea(this.quadricula);
		// this.view.ready_walls(this.quadricula);
		// this.quadricula.updateWalls();
		this.view.draw(this);
	}

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
				if(wall[i][side] == 1) this.addWall(cela[i], side);
				// cela[i].wall[side] = new Wall(i, side);
			}
		}

		this.view.ready_drawArea(this.quadricula);
		
		this.view.draw(this);
		
		// this.view.ready_walls(this.quadricula);
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
					this.addWall(cela, 1)
					this.addWall(cela, 3)
				}else if(directionPath[i] % 2 == 1){
					this.addWall(cela, 0)
					this.addWall(cela, 2)
				}
			}else if(directionChange[i] % 2 != 0){
				var p = directionPath[i-1];
				var c = directionChange[i];
				corner = [p, p-c];

				if(corner[1] < 0) corner[1] += 4;
				else if (corner[1] > 3) corner[1] -= 4;

				this.addWall(cela, corner[0])
				this.addWall(cela, corner[1])
			}
		}
		// ultim element
		index = path[path.length - 1];
		cela = this.quadricula.cela[index];
		for(var i=0; i<4; i++){
			var dif = directionPath[directionPath.length - 1] - i;
			if(dif % 2 != 0){
				this.addWall(cela, i)
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
				var cela2 = cela[index + c]
				console.log(cela2);
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
		this.view = this.model.view;

		this.ready_menu.call(this);

		this.actionFunctions = {
			createPathWalls : null,
			erasePathWalls : null,
			createBridge : null
		};
		this.define_actionFunctions();

		this.toolbar_left = new Toolbar("tools_left");
		this.ready_toolbar_left();

		this.actionStack = [];
		this.mouseIsDown = false;
	}

	ready_menu(){
		document.getElementById("newLab").addEventListener('submit', this.newLab.bind(this), false);
		document.getElementById("loadLab").addEventListener('change', this.loadLab.bind(this), false);
		//TODO
		//loadLab No nomes onchange
	}

	define_actionFunctions(){
		this.actionFunctions.createPathWalls = function(path){
			this.model.createPathWalls(path);
			this.view.draw(this.model);
		}

		this.actionFunctions.erasePathWalls = function(path){
			this.model.erasePathWalls(path);
			this.view.draw(this.model);
		}

		this.actionFunctions.createBridge = function(){
			console.log("createBridge is not implemented yet");
		}
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
		this.actionStack.push(path)
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
		this.view.displayOff("modal_newLab");			//Hi ha una altra manera d'amagar el modal?
		var width = event.target[0].value;
		var height = event.target[1].value;
		this.model.newLab(parseInt(width), parseInt(height));
		this.ready_cell_events.call(this);
	}

	loadLab(event){
		this.view.displayOff("modal_loadLab");			//Hi ha una altra manera d'amagar el modal?
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
			this.ready_cell_events.call(this);

		};
		reader.onload = reader.onload.bind(this);
	}

}

window.onload = function(){
	editor = new Controller();
}
