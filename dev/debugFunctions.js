function checkViewWalls(){
	var v = [], w = editor.model.getWalls();
	var walls_html = editor.view.walls_html;

	for(var i=0; i<walls_html.length; i++){
		if(walls_html[i] != "")
			v.push(walls_html[i]);
	}

	console.log("Walls: "+ w.length +"\nView walls: "+ v.length);
}

checkViewWalls();