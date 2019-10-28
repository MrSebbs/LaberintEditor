var editor;
class Vector3{
	constructor(){
		this.index;
		this.x;
		this.y;
		this.z;

		var arg = arguments;
		if(arg.length == 1){
			this.index = arg[0];
		}
		if(arg.length == 3){
			this.setXYZ(arg[0], arg[1], arg[2]);
		}
	}

	setXYZ(x, y, z){
		this.x = x;
		this.y = y;
		this.z = z;
	}

	toString(){
		return "v "+this.x +" "+this.y+" "+this.z;
	}
}

class ExporterOBJ{
	constructor(){
		this.name = "Laberint"
		this.cell = null;
		this.poligons = [];
		this.vertex = [];

		if(arguments.length == 1){	
			this.cell = arguments[0];
			this.vertex = [null, null, null, null,
				null, null, null, null];
		}
	}

	fill(model){
		// Fill Poligons
		var v = this.vertex;

		var cell = this.cell;
		var index, indexA, indexB, side;

		//Base
		for(index=0; index<4; index++){
			v[index] = new Vector3(index);
		}
		this.poligons.push([v[3],v[2],v[1],v[0]]);

		//Laterals
		for(side=0; side<4; side++){
			if(cell.wall[side] == null)
				if(model.getComplementaryWall(cell.index, side) == null)
					continue;
			indexA = side;
			indexB = (indexA+1)%4;
			if(v[indexA+4] == null) v[indexA+4] = new Vector3(indexA+4);
			if(v[indexB+4] == null) v[indexB+4] = new Vector3(indexB+4);

			this.poligons.push([v[indexA],v[indexB],v[indexB+4],v[indexA+4]]);
		}

		// Fill Vertex Coordinates
		var i;
		var x, y, z;
		for(i=0; i<v.length; i++){
			if(v[i] == null) continue;
			x = cell.x;
			y = Math.floor(i/4);
			z = cell.y;
			switch(i%4){
				case 0: break;
				case 1: x++; break;
				case 2: x++; z++; break;
				case 3: z++; break;
			}
			v[i].setXYZ(x,y,z);
		}
	}

	toString(){
		var v = this.vertex;
		var output = "# object "+this.name+"\n\n";
		var i;
		for(i=0; i<v.length; i++){
			if(v[i] == null) continue;
			output += v[i]+"\n";
		}
		output += "# "+v.length+" vertices\n\n";

		output += "o "+this.name+"\n";
		output += "g "+this.name+"\n";
		var f;
		for(i=0; i<this.poligons.length; i++){
			output += "f ";
			for(f=0; f<4; f++){
				output += this.poligons[i][f].index+1+" ";
			}
			output += "\n";
		}
		output += "# "+this.poligons.length+" polygons\n";
		return output;
	}
}

class Segment {
	constructor(){
		this.x1;
		this.y1;
		this.x2;
		this.y2;

		this.distX;
		this.distY;

		this.horitzontal = false;
		this.vertical = false;
		this.ortogonal;

		if(arguments.length == 1){
			var vector = arguments[0].match(/\w\d="(\d*)"/gim);
			var value;
			if(vector.length != 4){
				console.log("Error in new Segment");
				return;
			}

			for(var i=0; i<4; i++){
				value = vector[i].split(/=?"/);
				this[value[0]] = parseInt( value[1] );
			}
			this.setDist();

		}else if(arguments.length == 4){
			var v = arguments;
			this.x1 = v[0];
			this.y1 = v[1];
			this.x2 = v[2];
			this.y2 = v[3];
		}
	}

	setDist(){
		this.distX = this.x2-this.x1;
		this.distY = this.y2-this.y1;

		if(this.distX < 0) this.distX *= -1;
		if(this.distY < 0) this.distY *= -1;

		if(this.distX == 0) this.vertical = true;
		if(this.distY == 0) this.horitzontal = true;
		
		if(!this.horitzontal && !this.vertical) this.ortogonal = false;
		else this.ortogonal = true;
	}

	getOrtogonalDist(){
		if (this.distX == 0) return this.distY;
		else if (this.distY == 0) return this.distX;
		else return false;
	}
}

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

class LongWallManager {
	constructor(grid){
		this.horitzontal;
		this.vertical;

		this.rows = grid.rows;
		this.cols = grid.columns;
	}

	toString(walls){
		var line, index, n;
		var str = "";
		for(index=0; index<walls.length; index++){
			line = walls[index];
			str += "Line "+index+":";
			for(n=0; n<line.length; n++){
				str += " ["+line[n][0]+"-"+line[n][1]+"]";
			}
			str += "\n";
		}
		console.log(str);
	}

	fillLinesWithWalls(model){
		var cell = model.grid.cell;
		var index, i, j;

		// Recorrem cells en horitzontal
		// Omplim horitzontal
		this.horitzontal = [[]]
		for(j=0; j<this.rows; j++){
			this.horitzontal.push([]);
			for(i=0; i<this.cols; i++){
				index = i+j*this.cols;
				if(cell[index].wall[0] != null)
					this.horitzontal[j].push(i);
				if(cell[index].wall[2] != null)
					this.horitzontal[j+1].push(i);
			}
		}

		// Recorrem cells en vertical
		// Omplim vertical
		this.vertical = [[]]
		for(i=0; i<this.cols; i++){
			this.vertical.push([]);
			for(j=0; j<this.rows; j++){
				index = i+j*this.cols;
				if(cell[index].wall[3] != null)
					this.vertical[i].push(j);
				if(cell[index].wall[1] != null)
					this.vertical[i+1].push(j);
			}
		}
	}

	weldWalls(walls){
		var i, index, line;
		var n, nums, found;
		var first, last;
		// Input => line = [0, 1, 2, 5, 7, 8, 0, 1, 3]
		// Output => line = [[0,3], [5], [7,8]]
		
		for(i=0; i<walls.length; i++){
			line = walls[i];
			n = 0;
			nums = [];
			found = false;
			while(line.length > 0){
				index = line.indexOf(n);
				if(index > -1){
					if(!found){
						first = n;
						found = true;
					}
					line.splice(index, 1);
					// Pot ser que n estigui duplicat!
					index = line.indexOf(n);
					if(index > -1) line.splice(index, 1);
				}else{
					if(found){
						last = n-1;
						nums.push([first, last]);
						found = false;
					}
				}
				n++;
			}
			if(found){
				last = n-1;
				nums.push([first, last]);
				found = false;
			}
			walls[i] = nums;
		}
	}

	update(model){
		this.fillLinesWithWalls(model);
		this.weldWalls(this.horitzontal);
		this.weldWalls(this.vertical);
	}

	getCodeHtml(properties){
		var orientation, i;
		var code_html = "";
		var walls = [this.horitzontal, this.vertical];

		for(orientation=0; orientation<2; orientation++){
			for(i=0; i<walls[orientation].length; i++){
				code_html += this.getLongWallCodeHtml(properties, orientation, i);
			}
		}
		return code_html;
	}

	getLongWallCodeHtml(pp, orientation, index){
		var code_html = "";
		var line;
		if(orientation) line = this.vertical[index];
		else line = this.horitzontal[index];

		var n;
		for(n=0; n<line.length; n++){
			// Aquí fem tota la line
			// Suposem wall horitzontal
			var intWidth = line[n][1] - line[n][0] + 1;

			var x = line[n][0] * pp.side_length + pp.margin - pp.wall_stroke;
			var y = index * pp.side_length + pp.margin - pp.wall_stroke;
			var width = intWidth * pp.side_length + 2 * pp.wall_stroke;
			var height = 2 * pp.wall_stroke;
			
			// Si és vertical ho arreglem
			if(orientation){
				var aux = x;
				x = y;
				y = aux;

				aux = width;
				width = height;
				height = aux;
			}

			code_html += "<rect width=\""+ width +
				"\" height=\""+ height +
				"\" fill=\""+ pp.wallFillColor +
				"\" x=\""+ x +"\" y=\""+ y +"\"></rect>\n";
		}
		return code_html;
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

		this.longWall;
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

		/* create LongWallManager */
		this.longWall = new LongWallManager(grid);
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
		this.longWall.update(model);
		this.DOM_walls.innerHTML = this.longWall.getCodeHtml(this.properties);

		// Time control
		// var start = Date.now();
		// console.log(Date.now() - start);
	}

	draw_old(model){
		var start = Date.now();

		var code_html = "";		//Hem d'omplir les dades que passarem a innerHTML
		var cell = model.grid.cell;
		var wall, i, s;

		// Si walls_html esta buit, es reinicia per defecte
		if (this.walls_html.length == 0)
			for(i=0; i<cell.length; i++)
				for(s=0; s<4; s++)
					this.walls_html.push("");	// walls_html = ["", "", "", ...]
		
		for(i=0; i<cell.length; i++){
			for(s=0; s<4; s++){
				wall = cell[i].wall[s];
				if(wall == null){
					this.walls_html[4*i + s] = "";
					continue;
				}										// Si que es dibuixen parets dues vegades
				if(this.walls_html[4*i + s] == ""){		// Comprobar que no l'haguem pintat abans
					this.walls_html[4*i + s] = this.getWallCodeHtml(model, wall);
				}
				code_html += this.walls_html[4*i + s];
			}
		}
		this.DOM_walls.innerHTML = code_html;

		console.log(Date.now() - start);
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

	getComplementaryWall(index, side){
		var cell = this.grid.cell[index];
		var x = cell.x, y = cell.y;
		switch(side){
			case 0: y--; break;
			case 1: x++; break;
			case 2: y++; break;
			case 3: x--; break;
		}
		if( x<0 || y<0 || x>=this.grid.columns || y>=this.grid.rows)
			return null;

		var newIndex = x + y * this.grid.columns;
		var newSide = (side+2)%4;
		return this.grid.cell[newIndex].wall[newSide];
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

	destroyWall2(index, side){
		this.grid.cell[index].wall[side] = null;
		var wall = this.getComplementaryWall(index, side);
		this.removeWall(wall.cell, wall.side);
	}

	destroyWall(index, side){
		var cell = this.grid.cell;
		var cols = this.grid.columns;
		this.removeWall(cell[index], side);

		switch(side){
			case 0:
				if(index < cols) return; // Ignorem la primera fila
				cell[index - cols].wall[2] = null;
				break;
			case 1:
				if( (index+1) % cols == 0) return;	// Ignorem ultima columna
				cell[index + 1].wall[3] = null;
				break;
			case 2:
				if(index >= this.grid.numCells - cols) return;	// Ignorem la ultima fila
				cell[index + cols].wall[0] = null;
				break;
			case 3:
				if(index % cols == 0) return;				// Ignorem la primera columna
				cell[index - 1].wall[1] = null;
				break;
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
		document.getElementById("option_exportLab").addEventListener('click', this.exportLab.bind(this), false);
		document.getElementById("option_closeLab").addEventListener('click', this.closeLab.bind(this), false);

		document.getElementById("option_rotateRight").addEventListener('click', this.rotate.bind(this), false);
		document.getElementById("option_rotateLeft").addEventListener('click', this.rotate.bind(this), false);

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
		this.changesAreSaved = true;
		this.view.ready_drawArea(this.model.grid);
		this.view.draw(this.model);
		this.ready_cell_events.call(this);
	}

	newLab(event){
		this.view.displayOff("modal_newLab");
		if( !this.confirmQuit() ) return;
		var columns = parseInt(event.target[0].value);
		var rows = parseInt(event.target[1].value);
		this.model.grid = new Grid(columns, rows);
		this.model.loadBorders();
		this.ready_grid();
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
		var file = files[0];
		event.target.value = "";
		if( !this.confirmQuit() ) return;

		var splitFilename = file.name.toLowerCase().split(".");
		var extension = splitFilename[splitFilename.length-1];
		if(extension == "txt"){
			this.importTXT(file);
		}else if(extension == "svg"){
			this.importSVG(file);
		}else{
			console.log("Unsuported File");
		}
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

	exportLab(){
		var managerOBJ = new ExporterOBJ();
		// var poligonManager = [];
		var model = this.model;
		var cell = model.grid.cell;

		var vCell, vList, pList;
		var i, v, p;
		// Might have a modal with export properties

		for(i=0; i<cell.length; i++){
			vCell = new ExporterOBJ(cell[i]);
			vCell.fill(model);

			vList = vCell.vertex;
			for(v=0; v<vList.length; v++){
				if(vList[v] == null) continue;
				managerOBJ.vertex.push(vList[v]);
			}

			pList = vCell.poligons;
			for(p=0; p<pList.length; p++){
				managerOBJ.poligons.push(pList[p]);
			}

			/* ATENCIO!!! L'INDEX NO SERVEIX PER A RES */
		}

		// Tornem a indexar els vertex
		var vertex = managerOBJ.vertex;
		for(i=0; i<vertex.length; i++){
			vertex[i].index = i;
		}

		console.log(""+managerOBJ);
		// console.log(vertexManager);
		// console.log(poligonManager);
	}

	closeLab(){
		if( !this.confirmQuit() ) return;
		this.model.grid = new Grid(0, 0);
		this.ready_grid()
	}

	rotate(event){
		var oldGrid = this.model.grid;
		var oldCell = oldGrid.cell;
		var newGrid = new Grid(oldGrid.rows, oldGrid.columns);

		var r;	// r de rotation. Pot valdre 1 o 3
		var getIndex;
		if(event.target.id == "option_rotateRight"){
			r = 1;
			// formula = (x%col+1)*row-parseInt(x/col)-1
			getIndex = function(x){ return (x%oldGrid.columns+1)*oldGrid.rows-parseInt(x/oldGrid.columns)-1; }
		}else if(event.target.id == "option_rotateLeft"){
			r = 3;
			// formula = (col-1-x%col)*row+parseInt(x/col);
			getIndex = function(x){ return (oldGrid.columns-1-x%oldGrid.columns)*oldGrid.rows+parseInt(x/oldGrid.columns); }
		}
		
		var cell = newGrid.cell;
		var i, s;
		for(i=0; i<oldCell.length; i++){
			for(s=0; s<4; s++){
				if(oldCell[i].wall[s] != null){
					new Wall(cell[getIndex(i)], (s+r)%4);
				}
			}
		}

		this.model.grid = newGrid;
		this.view.ready_drawArea(this.model.grid);
		this.view.draw(this.model); 
		this.ready_cell_events.call(this);
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

	/* IMPORT EXTENSIONS */
	importTXT(file){
		var reader = new FileReader();
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

			this.model.grid = new Grid(data.header.columns, data.header.rows);
			var cell = this.model.grid.cell;
			var wall = data.wall;
			var i, side;
			for(i=0; i<wall.length; i++){
				for(side=0; side<4; side++){
					if(wall[i][side] == 1) new Wall(cell[i], side);
				}
			}
			this.ready_grid();
		};
		reader.onload = reader.onload.bind(this);
		reader.readAsText(file);
	}

	importSVG(file){
		var reader = new FileReader();
		reader.onload = function(){
			var content = reader.result;
			var regexSVG = /<svg([\s\S]*?)\/svg>/gim,
				regexLines = /<line([\s\S]*?)\/>/gim;

			var resultSVG = content.match(regexSVG);
			if(resultSVG.length == 0){
				console.log("Can't read file");
				return;
			}

			var resultLines = resultSVG[0].match(regexLines);
			var walls = [];
			var i;
			for(i=0; i<resultLines.length; i++){
				walls.push( new Segment(resultLines[i]) );
			}
			
			var xMax = 0, yMax = 0;
			var xMin = walls[0].x1, yMin = walls[0].y2;
			var x1, x2, y1, y2, svgWall;

			var distNotMultiple = [];
			var dist = walls[0].getOrtogonalDist();
			var distMin = dist;
			
			// Recorrem walls[Segment1, Segment2, ...]
			for(i=1; i<walls.length; i++){
				svgWall = walls[i];
				x1 = svgWall.x1;
				x2 = svgWall.x2;
				y1 = svgWall.y1;
				y2 = svgWall.y2;

				if(xMin > x1) xMin = x1;
				if(xMin > x2) xMin = x2;
				if(yMin > y1) yMin = y1;
				if(yMin > y2) yMin = y2;

				if(xMax < x1) xMax = x1;
				if(xMax < x2) xMax = x2;
				if(yMax < y1) yMax = y1;
				if(yMax < y2) yMax = y2;

				// Busquem el Segment més curt
				dist = svgWall.getOrtogonalDist();
				if (distMin > dist){
					distMin = dist;
					var j;
					for(j=0; j<distNotMultiple.length; j++){
						dist = distNotMultiple[j];
						if(dist%distMin == 0) distNotMultiple.splice(j, 1);
					}
				}
				else if(dist%distMin == 0) continue;
				else if(walls.includes(dist)) continue;
				else distNotMultiple.push(dist);
			}

			if(distNotMultiple.length != 0){
				console.log("Values not working:\n");
				console.log(distNotMultiple);
			}

			var columns, rows;
			if( (xMax-xMin)%distMin == 0 ) columns = (xMax - xMin)/distMin;
			if( (yMax-yMin)%distMin == 0 ) rows = (yMax - yMin)/distMin;

			var t = 0;	//Aixo es pot esborrar?

			this.model.grid = new Grid(columns, rows);

			var cell = this.model.grid.cell;
			var x, y, first, last, side, svgWall;

			for(i=0; i<walls.length; i++){
				svgWall = walls[i];
				if(svgWall.horitzontal){
					y = (svgWall.y1 - yMin)/distMin;
					side = 0;

					first = (svgWall.x1 - xMin)/distMin;
					last = (svgWall.x2 - xMin)/distMin;
					if(first > last){
						var aux = first;
						first = last;
						last = aux;
					}
					if(rows == y){
						y--;
						side = 2;
					}
					for(x=first; x<last; x++){
						new Wall(cell[x+y*columns], side);				
					}
				}else if(svgWall.vertical){
					x = (svgWall.x1 - xMin)/distMin;
					side = 3;

					first = (svgWall.y1 - yMin)/distMin;
					last = (svgWall.y2 - yMin)/distMin;
					if(first > last){
						var aux = first;
						first = last;
						last = aux;
					}
					if(columns == x){
						x--;
						side = 1;
					}
					for(y=first; y<last; y++){
						new Wall(cell[x+y*columns], side);				
					}
				}
			}
			this.ready_grid();
		};
		reader.onload = reader.onload.bind(this);
		reader.readAsText(file);
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
