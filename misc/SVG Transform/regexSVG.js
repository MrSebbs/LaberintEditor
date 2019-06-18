class VectorSVG{
	constructor(type, vec){
		this.type = type;
		this.vec = vec;
		this.len = vec.length;
	}
}

function regexParser(){

	const regexSubpath = /m([^z]*)z/gim;
	const regexSplit = /[a-zA-Z]([^a-zA-Z]*)(?=[a-zA-Z])/gm;
	const regexFloat = /(-?(\d)+(\.?(\d)+)?)/gm;

	var testText = "M8.484, 0.863L0, 9.349l12.404, 12.404l8.485-8.485L8.484, 0.863z M1.791, 9.349l6.693-6.694 l10.612, 10.613l-6.692, 6.695L1.791, 9.349z";
	var path = [];
	var subpath = [];

	var findSubpath = regexSubpath.exec(testText);
	// console.log(findSubpath);
	while (findSubpath != null){
		subpath.push(findSubpath[0]);
		findSubpath = regexSubpath.exec(testText);
	}

	// console.log(subpath);

	var splitPath;
	for(var i=0; i<subpath.length; i++){
		path.push([]);
		splitPath = regexSplit.exec(subpath[i]);
		while (splitPath != null){
			path[i].push(splitPath[0]);
			splitPath = regexSplit.exec(subpath[i]);
		}
	}

	console.log(path);
	var strElement, floatNumber, type, vec = [], pathVectorSVG = [];

	for(var i=0; i<=path.length; i++){
		subpath = path[i];
		console.log(subpath);
		for(var j=0; i<=(subpath).length; i++){
			pathVectorSVG.push([]);
			strElement = subpath[j];
			type = strElement[0];
			type.toUpperCase();

			floatNumber = regexFloat.exec(strElement);
			while(floatNumber != null){
				vec.push(floatNumber);
				floatNumber = regexFloat.exec(strElement);
			}

			pathVectorSVG[i].push(new VectorSVG(type, vec));
		}
	}

	console.log(pathVectorSVG);



}

regexParser();