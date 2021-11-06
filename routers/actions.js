const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authtoken = require("../config/authtoken");

router.get("/get_list", authtoken, async (req , res) =>{

	//const resultado = await db.select("*").from("actions");
	const resultado = await db.select("actions.ID","actions.ID_USER","users.name as user","company.name as company","contacts.name as contact","actions.ID_CASE","actions.type","actions.state","actions.description")
							.from("actions")
							.join("users","actions.ID_USER","users.ID")
							.join("company","actions.ID_COMPANY","company.ID")
							.join("contacts","actions.ID_CONTACT","contacts.ID");

	console.log(resultado);

	res.json({
		status: true,
		data: resultado
	});

});

router.get("/get/:id", authtoken, async (req, res)=>{
	
	//console.log("id =", req.params.id);
	//const resultado = await db.select("*").from("actions").where("ID", req.params.id);
	const resultado = await db.select("actions.ID","actions.ID_USER","users.name as user","company.name as company","contacts.name as contact","actions.type","actions.state","actions.description")
							.from("actions")
							.where("actions.ID", req.params.id)
							.join("users","actions.ID_USER","users.ID")
							.join("company","actions.ID_COMPANY","company.ID")
							.join("contacts","actions.ID_CONTACT","contacts.ID");
							

	if(resultado.length == 0){
		res.json({ status: false, error: "no-encontrado" });	
	}else{
		res.json({ status: true, data: resultado[0] });	
	}

});

router.post("/add", authtoken, async (req, res)=>{
	
	const obligatory = ["ID_COMPANY","ID_CONTACT"];
	const allow = ["ID_USER","ID_COMPANY","ID_CONTACT","ID_CASE","type","state","description"];
	var array_datos = {};
	var valido = true;
	

	obligatory.forEach(Element =>{
		if(typeof req.body[Element] === "undefined"){
			//console.log('entro en obligatory');
			valido = false;
		}
	});

	array_datos["ID_USER"] = req.tokendata.ID;

	allow.forEach(Element =>{
		if(req.body[Element] != ''){
			array_datos[Element] = req.body[Element];
		}
	});

	console.log('array:', array_datos);

	if (valido === false){
		//console.log('valido',valido);
		return res.json({status: false});
	}

	const resultado = await db("actions").insert(array_datos);

	res.json({
		status: true,
		data: resultado
	})

});

router.post("/edit/:id", authtoken, async (req, res)=>{
	
	// El ID_USER no se puede modificar. El creador de la acción siempre será el mismo
	
	const allow = ["ID_COMPANY","ID_CONTACT","ID_CASE","type","state","description"];
	var prepare_update = {};

	console.log(req.body);

	allow.forEach(Element =>{
		if(req.body[Element] != ''){
			prepare_update[Element] = req.body[Element];
		}
	});

	const resultado = await db("actions").where("ID",req.params.id).update(prepare_update);

	res.json({
		status: true
	})

});

router.post("/delete/:id", authtoken, async (req, res)=>{
	
	const resultado = await db("actions").where("ID", req.params.id).delete();

	res.json({status: true});

});


module.exports = router;
