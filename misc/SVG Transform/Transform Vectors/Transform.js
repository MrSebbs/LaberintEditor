function parseText(Sexe){
	const text = document.getElementById("rawText").value;
	const path = /\"m.*\"/gm;
	
	const regexSplit = /[a-zA-Z]([^a-zA-Z]*)[a-zA-Z]/gm;

	var testText = "M1177 1832 l-947 -947 -64 -375 c-35 -206 -63 -376 -61 -378 1 -1 172 26 380 62 l378 64 948 948 949 949 -312 312 c-172 172 -315 313 -318 313 -3 0 -431 -426 -953 -948z m1038 658 l80 -80 -860 -860 -860 -860 -82 82 -83 83 857 857 c472 472 860 858 863 858 3 0 41 -36 85 -80z m-525 -1195 l-860 -860 -85 85 -86 85 863 857 863 856 83 -81 82 -82 -860 -860z m-995 -914 c-3 -2 -67 -14 -142 -27 l-138 -24 -56 56 -56 55 24 137 c12 75 23 141 23 147 0 5 79 -69 175 -165 96 -96 172 -176 170 -179z";

	var splitPath = regexSplit.exec(testText);

	console.log(splitPath);


	var i, ctrl = 0;

	var stringPath
	for(i=0; i<path.length; i++){
		stringPath = path[i];
		while(ctrl < 10000){

			stringPath



			ctrl++;
		}
	}



	const regexNom = /(?<=(\bNom\s))(\w* ?)+\b/gm,
		regexCognoms = /(?<=(\bCognoms\s))(\w* ?-?\Ñ?)+\t/gm,
		regexMobil = /(?<=(\bM\òbil\s))(\+?(\d)+)/gm,
		regexDataNaixement = /(?<=(\bData\snaixement\s))((\d){2}[/]){2}(\d){4}/gm,
		regexDNI = /(?<=(\bDNI\s))\-?(\w)*/gm,
		regexEmail = /(?<=(\bE\-mail\s))[\w.\-?]*@[\w.\-?]*/gm;
	
	var Nom = regexNom.exec(text),
	Cognoms = regexCognoms.exec(text),
	Mobil = regexMobil.exec(text),
	DataNaixement = regexDataNaixement.exec(text),
	DNI = regexDNI.exec(text),
	Email = regexEmail.exec(text);

	if (Nom) Nom = Nom[0];
	if (Cognoms) Cognoms = Cognoms[0];
	if (Mobil) Mobil = Mobil[0];
	if (DataNaixement) DataNaixement = DataNaixement[0];
	if (DNI) DNI = DNI[0];
	if (Email) Email = Email[0];

	Cognoms = Cognoms.substr(0, Cognoms.length-1);
	Cognoms = Cognoms.split(" ");
	var Cognom1 = Cognoms[0];
	var Cognom2 = Cognoms[1];
	
	//Si algun camp és nul
	if (!Nom) alert("El camp Nom té valor nul");
	if (!Cognoms) alert("El camp Cognoms té valor nul");
	if (!Mobil){
		Mobil = "-";
		alert("El camp Mobil té valor nul");
	}
	if (!DataNaixement) alert("El camp DataNaixement té valor nul");
	// if (!DNI) alert("El camp DNI té valor nul");
	if (!Email) alert("El camp Email té valor nul");

	//Si el DNI és nul o -
	if(DNI == "-" || !DNI){
		DNI = "AAAAAAAAA";
		alert("No hi ha DNI!");
	}

	//Si hi ha més de 2 cognoms
	if(Cognoms.length > 2){
		var Cognom1 = Cognoms[0];
		var Cognom2 = Cognoms[Cognoms.length-1];
		for (var i = 1; i <= Cognoms.length - 2; i++) {
			Cognom1 = Cognom1+" "+Cognoms[i];
		}
		Cognoms = [Cognom1, Cognom2];
		alert("Hi ha més de 2 cognoms!\nRevisa que estiguin bé!");
	}

	//Si hi ha només hi ha un cognom
	if(!Cognom2) Cognom2 = "";

	console.log("Nom: "+Nom+"\n"+
		"Cognom1: "+Cognom1+"\n"+
		"Cognom2: "+Cognom2+"\n"+
		"Mobil: "+Mobil+"\n"+
		"DataNaixement: "+DataNaixement+"\n"+
		"DNI: "+DNI+"\n"+
		"Email: "+Email+"\n"+
		"Sexe: "+Sexe+" (Home: -1. Dona: 0)\n");

	var result = "document.getElementById(\"ctl00_ContentPlaceHolder1_CampDNI_TxtValor\").value = \""+DNI+"\";\ndocument.getElementById(\"ctl00_ContentPlaceHolder1_CampNombre_TxtValor\").value = \""+Nom+"\";\ndocument.getElementById(\"ctl00_ContentPlaceHolder1_CampApellido1_TxtValor\").value = \""+Cognom1+"\";\ndocument.getElementById(\"ctl00_ContentPlaceHolder1_CampApellido2_TxtValor\").value = \""+Cognom2+"\";\ndocument.getElementById(\"ctl00_ContentPlaceHolder1_CampTelefonoMovil_TxtValor\").value = \""+Mobil+"\";\ndocument.getElementById(\"ctl00_ContentPlaceHolder1_CampEmail1_TxtValor\").value = \""+Email+"\";\ndocument.getElementById(\"ctl00_ContentPlaceHolder1_CampFechaNacimiento_TxtValor\").value = \""+DataNaixement+"\";\ndocument.getElementById(\"ctl00_ContentPlaceHolder1_CampGenero_CboValor\").value = "+Sexe+";\n"

	var textArea = document.getElementById("resultCode");
	textArea.value = result;
	textArea.style.display = "block";
	document.getElementById("instruccions2").style.display = "block";
}