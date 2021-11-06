const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authtoken = require("../config/authtoken");

router.get("/get_list", authtoken, async (req , res) =>{
	
	//const resultado = await db.select("*").from("cases");
	const resultado =await db.select("cases.ID","cases.ID_USER","users.name as user","company.name as company","contacts.name as contact","cases.purchase","cases.invoice","cases.warranty_date","cases.description","cases.cause","cases.state","cases.created")
						.from("cases")
						.join("users","cases.ID_USER","users.ID")
						.join("company","cases.ID_COMPANY","company.ID")
						.join("contacts","cases.ID_CONTACT","contacts.ID");

	res.json({
		status: true,
		data: resultado
	});
});

router.get("/get/:id", authtoken, async (req, res)=>{
	
	const resultado =await db.select("cases.ID","cases.ID_USER","users.name as user","company.name as company","contacts.name as contact","cases.purchase","cases.invoice","cases.warranty_date","cases.description","cases.cause","cases.state","cases.created")
						.from("cases")
						.where("cases.ID", req.params.id) 
						.join("users","cases.ID_USER","users.ID")
						.join("company","cases.ID_COMPANY","company.ID")
						.join("contacts","cases.ID_CONTACT","contacts.ID");

	res.json({
		status: true,
		data: resultado[0]
	});

});

router.post("/add", authtoken, async (req, res)=>{
	
	const obligatory = ["ID_COMPANY"];
	const allow = ["ID_COMPANY","ID_CONTACT","purchase","invoice", "warranty_date","description","cause", "state"];
	var array_datos = {};
	var valido = true;


	obligatory.forEach(Element =>{
		if(typeof req.body[Element] === "undefined"){
			//console.log('entra en obligatory');
			valido=false;
		}
	});

	array_datos["ID_USER"] = req.tokendata.ID;

	console.log('id user en array datos', array_datos);

	allow.forEach(Element =>{
		if((typeof req.body[Element] != "undefined") || (req.body[Element] != '')){
			console.log (Element, req.body[Element]);
			array_datos[Element]=req.body[Element];
		}
	});

	console.log("array datos:",array_datos);

	if (valido == false){
		console.log('valido', valido)
		return res.json({status: false});
	}

	const resultado = await db("cases").insert(array_datos);

	console.log(resultado);

	res.json({
		status: true,
		data: resultado
	});

});

router.post("/edit/:id", authtoken, async (req, res)=>{
	
	// El ID_USER no se puede modificar. El creador de la incidencia siempre será el mismo

	const allow = ["ID_COMPANY","ID_CONTACT","purchase","invoice", "warranty_date","description","cause", "state"];
	var prepare_update = {};
	
	allow.forEach(Element =>{
		if(req.body[Element] != ''){
			prepare_update[Element]=req.body[Element];
		}
	});

	const resultado = await db("cases").where("ID",req.params.id).update(prepare_update);

	res.json({
		status: true
	})

});

router.post("/delete/:id", authtoken, async (req, res)=>{
	
	const resultado = await db("cases").where("ID",req.params.id).delete();

	res.json({status: true});

});


module.exports = router;
