const regexSubpath = /m([^z]*)z/gim;
const regexSplit = /[a-zA-Z]([^a-zA-Z]*)(?=[a-zA-Z])/gm;

var testText = "M8.484, 0.863L0, 9.349l12.404, 12.404l8.485-8.485L8.484, 0.863z M1.791, 9.349l6.693-6.694 l10.612, 10.613l-6.692, 6.695L1.791, 9.349z";
var path = [];
var subpath = [];

var findSubpath = regexSubpath.exec(testText);
// console.log(findSubpath);
while (findSubpath != null){
	subpath.push(findSubpath[0]);
	findSubpath = regexSubpath.exec(testText);
}

console.log(subpath)


for(var i=0; i<subpath.lenght; i++){
	var splitPath = regexSplit.exec(subpath[i]);
	while (splitPath != null){
		path.push(splitPath[0]);
		splitPath = regexSplit.exec(subpath[i]);
	}
}

console.log(path);