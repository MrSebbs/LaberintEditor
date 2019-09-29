// text.split(/[a-zA-Z]/);

class VectorSVG{
	constructor(type, vec){
		this.type = type;
		this.vec = vec;
	}
}

class ReaderSVG{
	constructor(){
		this.strPath = [];
		this.path = [];
	}

	regexSearch(text, regex){
		var result = [];
		var find = regex.exec(text);
		while (find != null){
			result.push(find[0]);
			find = regex.exec(text);
		}
		return result;
	}

	regexParse(strSVG){
		const regexPathSVG = /<path (.*)d=(.*)>/gim;
		const regexPathMZ = /m([^z]*)z/gim;
		const regexSplit = /[a-zA-Z]([^a-zA-Z]*)(?=[a-zA-Z])/gm;
		const regexFloat = /(-?(\d)+(\.?(\d)+)?)/gm;

		var pathSVG = this.regexSearch(strSVG, regexPathSVG);
		if(pathSVG.length == 0) pathSVG = strSVG;
		pathSVG = pathSVG.toString();

		var pathMZ = this.regexSearch(pathSVG, regexPathMZ);
		for(var i=0; i<pathMZ.length; i++){
			this.strPath.push(this.regexSearch(pathMZ[i], regexSplit));
		}

		var strElement, type, vec;

		for(var i=0; i<this.strPath.length; i++){
			pathMZ = this.strPath[i];
			for(var j=0; j<pathMZ.length; j++){
				strElement = pathMZ[j];
				type = strElement[0];
				// type = type.toUpperCase();
				vec = this.regexSearch(strElement, regexFloat);
				this.path.push(new VectorSVG(type, vec));
			}
			this.path.push(new VectorSVG('Z', []));
		}
	}

	round(value){
		var floatNum;
		var strValue;

		var integer, decimal, decimalValue, result;

		var path = this.path;
		for(var i=0; i<path.length; i++){
			for(var v=0; v<path[i].vec.length; v++){
				floatNum = path[i].vec[v];
				strValue = floatNum.toString();

				strValue = strValue.split('.');
				if(strValue.length == 1){
					console.log(strValue[0]);
					console.log("Rounded");
					continue;
				}else if(strValue.length == 2){
					integer = strValue[0];
					decimal = strValue[1];

					console.log(strValue);
					console.log(integer);
					console.log(decimal);

					result = decimal.slice(0, value);
					console.log(result);
					if(decimal[value+1]>=5){
						decimalValue = parseInt(decimal[value]);
						decimalValue ++;
						decimalValue 
					}

				}
			}
		}
	}

	print(){
		var result = '';
		var path = this.path;
		for(var i=0; i<path.length; i++){
			result += path[i].type +' ';
			for(var v=0; v<path[i].vec.length; v++){
				result += path[i].vec[v] +' ';
				// if(v%2 == 0) result += ',';
			}
		}
		// Eliminar l'últim espai
		return result;
	}

	scale(value){
		var path = this.path;
		for(var i=0; i<path.length; i++){
			for(var v=0; v<path[i].vec.length; v++){
				path[i].vec[v] *= value;
			}
		}
	}

	simetryH(){
		var path = this.path;
		for(var i=0; i<path.length; i++){
			for(var v=0; v<path[i].vec.length; v+=2){
				path[i].vec[v] *= -1;
			}
		}
	}
}

function parseText(Sexe){
	const text = document.getElementById("rawText").value;
	svg.regexParse(text);
	// console.log();
	var result = svg.print();
	var textArea = document.getElementById("resultCode");
	textArea.value = result;
	textArea.style.display = "block";
	document.getElementById("instruccions2").style.display = "block";
}

function test(){
	const text = "M 16.968 1.726 L 0 18.698 l 24.808 24.808 l 16.97 -16.97 L 16.968 1.726 Z";
	svg.regexParse(text);
	svg.scale(0.1);
	svg.print();
	svg.round(3);
}



var svg = new ReaderSVG();
