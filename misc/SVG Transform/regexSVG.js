// text.split(/[a-zA-Z]/);

class VectorSVG{
	constructor(type, vec){
		this.type = type;
		this.vec = vec;
		// this.len = vec.length;
	}
}

class ReaderSVG{
	constructor(){
		this.strPath = [];
		this.path = [];

		var test1 = "M1177 1832 l-947 -947 -64 -375 c-35 -206 -63 -376 -61 -378 1 -1 172 26 380 62 l378 64 948 948 949 949 -312 312 c-172 172 -315 313 -318 313 -3 0 -431 -426 -953 -948z m1038 658 l80 -80 -860 -860 -860 -860 -82 82 -83 83 857 857 c472 472 860 858 863 858 3 0 41 -36 85 -80z m-525 -1195 l-860 -860 -85 85 -86 85 863 857 863 856 83 -81 82 -82 -860 -860z m-995 -914 c-3 -2 -67 -14 -142 -27 l-138 -24 -56 56 -56 55 24 137 c12 75 23 141 23 147 0 5 79 -69 175 -165 96 -96 172 -176 170 -179z";
		var goma1 = "M8.484, 0.863L0, 9.349l12.404, 12.404l8.485-8.485L8.484, 0.863z M1.791, 9.349l6.693-6.694 l10.612, 10.613l-6.692, 6.695L1.791, 9.349z";
		var goma2 = "M26.534, 18.555l-4.45-4.451c-0.1-0.101-0.261-0.101-0.357, 0l-8.487,  8.485 c-0.099, 0.099-0.099, 0.259, 0, 0.358l2.711, 2.71c0.039, 0.042, 0.091, 0.066, 0.147, 0.072l3.467, 0.015 c0.076, 0.012, 0.154-0.017, 0.211-0.072l6.759-6.759C26.634, 18.815, 26.634, 18.656, 26.534, 18.555z";
		this.regexParse(goma1);
		// this.regexParse(goma2);
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
		const regexPathMZ = /m([^z]*)z/gim;
		const regexSplit = /[a-zA-Z]([^a-zA-Z]*)(?=[a-zA-Z])/gm;
		const regexFloat = /(-?(\d)+(\.?(\d)+)?)/gm;

		var pathMZ = this.regexSearch(strSVG, regexPathMZ);
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
}

var svg = new ReaderSVG();
svg.scale(2);
svg.print();
