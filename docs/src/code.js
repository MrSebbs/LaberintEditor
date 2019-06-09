var editor;

class Color3 {
	constructor(){
		var rgb;
		if(arguments.length == 1){
			var str = arguments[0];
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
	constructor(element, name){
		this.element_html = element;
		this.name = name;
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

	addTool(element, name){
		this.toolList.push(new Tool(element, name));
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
			console.log("button does not belong to toolList");
			return;
		}
		this.lastTool = this.currentTool;
		this.currentTool = this.toolList[index];
	}
}

class Wall {
	constructor(cell, side){
		this.cell = cell;
		this.side = side;
		this.cell.wall[side] = this;
	}
}

class Cell {
	constructor(index){
		this.index = index;
		this.x;
		this.y;
		this.element_html;
		this.wall = [null, null, null, null];
	}

	setxy(columns){
		this.x = this.index%columns;
		this.y = (this.index - this.x)/columns;
	}
}

class Grid {
	constructor(columns, rows){
		this.columns = parseInt(columns);
		this.rows = parseInt(rows);
		this.numCells = columns * rows;
		this.cell = [];
		this.wall = [];

		this.drawArea;
		this.loadCells();
	}

	loadCells(){
		for(var i=0; i<this.numCells; i++){
			this.cell.push( new Cell(i) );
			var cell = this.cell[i];
			cell.setxy(this.columns);
		}
	}

	getIndex(x, y){
		return y * this.columns + x;
	}

	getCell(x, y){
		return this.cell[y * this.columns + x];
	}
}

class View{
	constructor(){
		this.DOM_workArea = document.getElementById("workArea");
		this.DOM_drawArea;
		this.DOM_grid;
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
			'selectColor': '#ddd',
			'pathColor': '#888'
			// 'clickColor': '#fbb',
			// 'mousedownColor': '#bfb',
			// 'mouseupColor': '#bbf',

		};

		this.walls_html = [];
		this.ready_modals();
	}

	/* MODALS */
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

	/* TOOLBAR */
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

	/* CELLS */
	ready_drawArea(grid){
		this.DOM_workArea.innerHTML = "<svg id=\"drawArea\" width=\"100\" height=\"100\"></svg>";		//Valors per defecte
		this.DOM_drawArea = this.DOM_workArea.firstElementChild;

		var pp = this.properties;

		this.DOM_drawArea.innerHTML = "<svg id=\"Grid\" width=\"100\" height=\"100\"></svg>";		//Valors per defecte
		this.DOM_drawArea.innerHTML += "<svg id=\"Walls\" width=\"100\" height=\"100\"></svg>";			//Valors per defecte

		this.DOM_grid = this.DOM_drawArea.children[0];
		this.DOM_walls = this.DOM_drawArea.children[1];

		pp.width = grid.columns * pp.side_length + 2 * pp.margin;
		pp.height = grid.rows * pp.side_length + 2 * pp.margin;

		this.DOM_drawArea.width.baseVal.value = pp.width;
		this.DOM_drawArea.height.baseVal.value = pp.height;

		this.DOM_grid.width.baseVal.value = pp.width;
		this.DOM_grid.height.baseVal.value = pp.height;

		this.DOM_walls.width.baseVal.value = pp.width;
		this.DOM_walls.height.baseVal.value = pp.height;

		var i, code_html = "";
		for(i=0; i<grid.numCells; i++){
			code_html += "<rect width=\"10\" height=\"10\"></rect>";
		}
		this.DOM_grid.innerHTML = code_html;

		for(i=0; i<grid.numCells; i++){
			var cell = grid.cell[i];
			cell.element_html = this.DOM_grid.children[i];
			this.setDefaultCellStyle(cell, pp);
		}

		/* reset walls */
		this.walls_html = [];
	}

	setDefaultCellStyle(cell, pp){
		var rect = cell.element_html;
		rect.index = cell.index;
		rect.x.baseVal.value = cell.x * pp.side_length + pp.margin;
		rect.y.baseVal.value = cell.y * pp.side_length + pp.margin;
		rect.width.baseVal.value = pp.side_length;
		rect.height.baseVal.value = pp.side_length;
		rect.style.fill = pp.defaultColor;
		rect.style.stroke = "black";
		rect.style.strokeOpacity = "0.2";
	}

	/* PATH */
	setPathColor(model, index){
		model.grid.cell[index].element_html.style.fill = this.properties.pathColor;
	}

	fadeOutColor(controller, path){
		var startTime = Date.now();
		var tmax = 1500;
		var fps = 60;
		
		var cell = controller.model.grid.cell;
		var cellPath = [];
		for(var i=0; i<path.length; i++){
			cellPath.push(cell[path[i]]);
		}

		// var startColor = new Color3(cellPath[0].element_html.style.fill);
		var startColor = new Color3(this.properties.pathColor);
		var targetColor = new Color3(this.properties.defaultColor);
		var colorVector = targetColor.subtract(startColor);

		var interval;
		var fadeOutEnd = function(){
			clearInterval(interval);
			if(!this.mouseIsDown){
				for(var i=0; i<controller.model.grid.numCells; i++){
					cell[i].element_html.style.fill = targetColor;
				}
			}
		};

		var fadeOutStep = function(){
			var elapsedTime = Date.now() - startTime;
			var timeVariation = elapsedTime/tmax;
			var colorVariation = colorVector.multiply(timeVariation);
			var color = startColor.add(colorVariation);

			// if(targetColor == color){				// == not working with color3
			// 	console.log("FadeOut is done");
			// 	return;
			// }else{
			// 	for(var i=0; i<cellPath.length; i++){
			// 		cellPath[i].element_html.style.fill = color;
			// 	}
			// }

			for(var i=0; i<cellPath.length; i++){
				cellPath[i].element_html.style.fill = color;
			}
		};

		interval = setInterval(fadeOutStep, 1000/fps);
		setTimeout(fadeOutEnd.bind(controller), tmax+100);
	}

	/* WALLS */
	getWallCodeHtml(model, wall){
		var pp = this.properties;
		var cell = wall.cell;

		var x = cell.x * pp.side_length + pp.margin - pp.wall_stroke;
		var y = cell.y * pp.side_length + pp.margin - pp.wall_stroke;
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

	draw(model){
		var wall, code_html = "";		//Omplir les dades que passarem a innerHTML
		var cell = model.grid.cell;
		var i, s;

		if (this.walls_html.length == 0)
			for(i=0; i<cell.length; i++)
				for(s=0; s<4; s++)
					this.walls_html.push("");
		
		for(i=0; i<cell.length; i++){
			for(s=0; s<4; s++){
				wall = cell[i].wall[s];
				if(wall == null){
					this.walls_html[4*i + s] = "";
					continue;
				}
				if(this.walls_html[4*i + s] == ""){
					this.walls_html[4*i + s] = this.getWallCodeHtml(model, wall);
				}
				code_html += this.walls_html[4*i + s];
			}
		}
		this.DOM_walls.innerHTML = code_html;
	}
}

class Model{
	constructor(){
		this.grid;
	}

	/* WALLS */
	getWalls(){
		var wall, walls = [];
		for(var i=0; i<this.grid.cell.length; i++){
			for(var s=0; s<4; s++){
				wall = this.grid.cell[i].wall[s];
				if(wall) walls.push(wall);
			}
		}
		return walls;
	}

	removeWall(cell, side){
		cell.wall[side] = null;
	}

	loadBorders(){
		var grid = this.grid;
		var rows = grid.rows;
		var columns = grid.columns;
		var cell, side, i;

		// top: side 0, index: (i, 0)
		for (i=0; i<columns; i++){
			cell = grid.getCell(i, 0);
			side = 0;	//top
			new Wall(cell, side);
		}

		// right: side 1, index: (columns-1, i)
		for (i=0; i<rows; i++){
			cell = grid.getCell(columns-1, i);
			side = 1;	//right
			new Wall(cell, side);
		}

		// bottom: side 2, index: (i, rows-1)
		for (i=0; i<columns; i++){
			cell = grid.getCell(i, rows-1);
			side = 2;	//bottom
			new Wall(cell, side);
		}

		// left: side 3, index: (0, i)
		for (i=0; i<rows; i++){
			cell = grid.getCell(0, i);
			side = 3;	//left
			new Wall(cell, side);
		}
	}

	/* CELL EVENTS */
	computeDirectionPath(path){
		var columns = this.grid.columns;
		var direction, dif;
		var directionPath = [];

		for(var i=1; i<path.length; i++){
			dif = path[i] - path[i-1];
			if(dif == 1){
				direction = 1;
			}else if(dif == -1){
				direction = 3;
			}else if(dif == columns){
				direction = 2;
			}else if(dif == - columns){
				direction = 0;
			}
			directionPath.push(direction);
		}
		directionPath.push(direction);
		return directionPath;
	}

	destroyWall(index, side){
		var cell = this.grid.cell;
		var c = this.grid.columns;
		cell[index].wall[side] = null;
		
		if(index < c) return;
		else if(index >= this.grid.numCells - c) return;
		else if(index % c == 0) return;
		else if( (index+1) % c == 0) return;

		switch(side){
			case 0: cell[index - c].wall[2] = null; break;
			case 1: cell[index + 1].wall[3] = null; break;
			case 2: cell[index + c].wall[0] = null; break;
			case 3: cell[index - 1].wall[1] = null; break;
		}
	}

	createPathWalls(path){
		var directionPath = this.computeDirectionPath(path);
		var directionChange = [0];
    	var corner, cell;
    	var index, side, i, p, c, r;
    
		for(i=1; i<directionPath.length; i++){
			directionChange.push(directionPath[i] - directionPath[i-1]);
		}
		// console.log(directionPath)
		// console.log(directionChange)

		if(path.length == 1){
			index = path[0];
			cell = this.grid.cell[index];
			cell.wall = [null, null, null, null];
			for (side = 0; side<4; side++)
				new Wall(cell, side);
			return;
		}

		// primer element
		index = path[0];
		p = (directionPath[0] + 2)%4;
		this.destroyWall(index, p);

		for(i=0; i<path.length; i++){
			index = path[i];
			cell = this.grid.cell[index];
			cell.wall = [null, null, null, null];

			if(directionChange[i] == 0){
				// Recte
				if(directionPath[i] % 2 == 0){
					// Parets Paraleles
					new Wall(cell, 1);
					new Wall(cell, 3);
				}else if(directionPath[i] % 2 == 1){
					new Wall(cell, 0);
					new Wall(cell, 2);
				}
			}else if(directionChange[i] % 2 != 0){
				// Cantonada
				p = directionPath[i-1];
				c = directionChange[i];
				corner = [p, p-c];

				if(corner[1] < 0) corner[1] += 4;
				else if (corner[1] > 3) corner[1] -= 4;

				new Wall(cell, corner[0]);
				new Wall(cell, corner[1]);
			}else if(directionChange[i] % 2 == 0){
				// Retrocedir
				p = directionPath[i];
				for(r=0; r<4; r++){
					if(p != r) new Wall(cell, r);
				}
			}
		}
	}

	erasePathWalls(path){
		var directionPath = this.computeDirectionPath(path);
		var index, side;

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

		this.actionStack = [];
		this.mouseIsDown = false;
		this.changesAreSaved = true;

		this.ready_menu.call(this);

		this.toolbar_left = new Toolbar("tools_left");
		this.ready_toolbar_left();

		this.closeLab();
	}

	/* MENU EVENTS */
	ready_menu(){
		document.getElementById("newLab").addEventListener('submit', this.newLab.bind(this), false);
		document.getElementById("loadLab").addEventListener('change', this.loadLab.bind(this), false);
		document.getElementById("option_saveLab").addEventListener('click', this.saveLab.bind(this), false);
		document.getElementById("option_closeLab").addEventListener('click', this.closeLab.bind(this), false);

		this.ready_zoomEvents.call(this);
		
		document.addEventListener('keypress', this.keypressEvent.bind(this), false);
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

	confirmQuit(){
		if(this.model.grid == undefined || this.changesAreSaved){
			return true;
		}else{
			return confirm("Estàs segur que vols tancar aquest Laberint? Els canvis no es guardaran");
		}
	}

	ready_grid(){
		if(arguments.length == 1){
			// loadLab
			var data = arguments[0];
			if( !this.confirmQuit() ) return;
			this.model.grid = new Grid(data.header.columns, data.header.rows);

			var cell = this.model.grid.cell;
			var wall = data.wall;
			for(var i=0; i<wall.length; i++){
				for(var side=0; side<4; side++){
					if(wall[i][side] == 1) new Wall(cell[i], side);
				}
			}

		}else if(arguments.length == 2){
			// newLab
			if( !this.confirmQuit() ) return;
			this.model.grid = new Grid(arguments[0], arguments[1]);
			this.model.loadBorders();

		}else if(arguments.length > 2){
			console.log("Error: Too much arguments");
			return;
		}

		this.changesAreSaved = true;
		this.view.ready_drawArea(this.model.grid);
		this.view.draw(this.model);
		this.ready_cell_events.call(this);
	}

	newLab(event){
		this.view.displayOff("modal_newLab");
		var columns = parseInt(event.target[0].value);
		var rows = parseInt(event.target[1].value);
		this.ready_grid(columns, rows);
	}

	loadLab(event){
		this.view.displayOff("modal_loadLab");
		var files = event.target.files;
		if (!files[0]) {
			console.log("File not found");
			return;
		}else if(files.length > 1){
			console.log("Too many files");
		}
		var reader = new FileReader();
		reader.readAsText(files[0]);

		reader.onload = function(){
			var content = reader.result;
			
			//Read file
			var regexCells = /(?<=Cells\: )(\d*)/gm,
				regexColumns = /(?<=Columns\: )(\d*)/gm,
				regexRows = /(?<=Rows\: )(\d*)/gm,
				regexWalls = /(?<=#\d*: )\d*/gm;

			var resultCells = regexCells.exec(content);
			if(resultCells == null){
				console.log("Can't read file");
				return;
			}

			var data = {
				header: {},
				wall : []
			};
			data.header = {
				cells : resultCells[0],
				columns : regexColumns.exec(content)[0],
				rows : regexRows.exec(content)[0]
			};
			var search = regexWalls.exec(content);
			while(search){
				data.wall.push(search[0]);
				search = regexWalls.exec(content);
			}

			if(data.header.cells != data.wall.length){
				console.log("File corrupted");
				return;
			}
			this.ready_grid(data);
			event.target.value = "";
		};
		reader.onload = reader.onload.bind(this);
	}

	saveLab(){
		this.changesAreSaved = true;
		var text = "";
		var grid = this.model.grid;
		var cell = grid.cell;
		if(cell.length == 0){
			console.log("Nothing to save");
			return;
		}

		text += "#Cells: "+grid.numCells +"\n";
		text += "#Columns: "+grid.columns+"\n"; 
		text += "#Rows: "+grid.rows+"\n\n";
		for(var i=0; i<grid.numCells; i++){
			text += "#"+i+": ";
			for(var s=0; s<4; s++){
				if (cell[i].wall[s]) text +=  "1";
				else text +=  "0";
			}
			text += "\n";
		}
		// console.log(text);

		var filename = "Lab_"+ grid.columns +"x"+ grid.rows +".txt";
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain; charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

	closeLab(){
		this.ready_grid(0, 0);
	}

	zoom(event){
		this.view.displayOff("modal_zoom");
		var percent;	
		if(event.target.id == "zoom_enquadra"){
			console.log("Enquadra not implemented yet");
		}else if(event.target.id == "zoom"){
			percent = event.target[0].value/100;
			
			var pp = this.view.properties;
			pp.side_length = pp.original_side_length * percent;
			pp.margin = pp.original_margin * percent;
			pp.wall_stroke = pp.original_wall_stroke * percent;

			this.ready_grid();
		}
	}

	/* TOOLBAR EVENTS */
	ready_toolbar_left(){
		var toolElement = this.toolbar_left.element_html.firstElementChild.children;
		this.toolbar_left.addTool(toolElement[0], "llapis");
		this.toolbar_left.addTool(toolElement[1], "goma");
		this.toolbar_left.addTool(toolElement[2], "pont");

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

	keypressEvent(event){
		var key = event.code;
		if(key == "KeyL") this.toolbar_left.setCurrentTool(0);
		if(key == "KeyG") this.toolbar_left.setCurrentTool(1);
		if(key == "KeyP") this.toolbar_left.setCurrentTool(2);
		
		this.view.updateCurrentTool(this.toolbar_left);
	}

	/* CELL EVENTS */
	ready_cell_events(){
		var cell = this.model.grid.cell;
		var e;
		for(var i=0; i<cell.length; i++){
			e = cell[i].element_html;
			e.addEventListener("click", this.cellClickEvent.bind(this));
			e.addEventListener("mousedown", this.cellMousedownEvent.bind(this));
			e.addEventListener("mouseup", this.cellMouseupEvent.bind(this));
			e.addEventListener("mouseenter", this.cellMouseenterEvent.bind(this));
			// e.addEventListener("mouseover", this.cellMouseoverEvent);
		}
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
		this.changesAreSaved = false;
		this.view.setPathColor(this.model, event.target.index);
	
		// actionStack s'ha de transformar competament
		var path = this.actionStack[this.actionStack.length-1];
		var tool = this.toolbar_left.currentTool;

		// this.toolbar_left.currentTool.action(path);

		if(tool.name == "llapis"){
			this.model.createPathWalls(path);
			this.view.draw(this.model);
		}
		else if(tool.name == "goma"){
			this.model.erasePathWalls(path);
			this.view.draw(this.model);
		}
		else if(tool.name == "pont"){
			console.log("createBridge not implemented yet");
		}

		this.view.fadeOutColor(this, path);
	}

	cellClickEvent(event){}
}

window.onload = function(){
	editor = new Controller();
};
