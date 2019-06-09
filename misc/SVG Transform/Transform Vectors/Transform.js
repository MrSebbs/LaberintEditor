function parseText(Sexe){
	const text = document.getElementById("rawText").value;
	const first = /\"m.*\"/gm,
	regexM = /m ?-?(\d)+\.?(\d)+/gm;



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