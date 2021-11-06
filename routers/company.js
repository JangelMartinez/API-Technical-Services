const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authtoken = require('../config/authtoken');

router.post("/add", authtoken, async (req, res)=>{

	const obligatory = ["name", "phone", "email", "type"];
	const allow = ["name", "phone", "email", "type", "delegation_of","address","postal_code","locality","province"];
	var valido = true;
	var array_datos = {};

	

	obligatory.forEach(Element =>{
		if(typeof req.body[Element] === "undefined"){
			valido = false;
		}
	});

	allow.forEach(element => {
		if(req.body[element] != ''){
			array_datos[element] = req.body[element];
		}
		
	});

	// Miramos si tiene todos los datos
		if(valido==false){
			return res.json({ status: false });
		}

	
	const resultado = await db("company").insert(array_datos);

	res.json({
		status: true,
		data: resultado[0]
	});

});

router.get("/get_list/:tipo?", authtoken, async (req , res) =>{

	console.log("ID:", req.tokendata.ID);

	const tipo = req.params.tipo;
	
	if(tipo==="cliente"){ var tiporeal = "cliente";
	}else if(tipo==="proveedor"){ var tiporeal = "proveedor";
	}else{ var tiporeal = null; }

	if(tiporeal === null){
		var resultado = await db.select("*").from("company");
	}else{
		var resultado = await db.select("*").from("Company").where("type", tiporeal);
	}

	res.json({
		status: true,
		data: resultado
	});

	
});

router.get("/get/:id", authtoken, async (req, res)=>{
	var resultado = await db.select("*").from("company").where("ID", req.params.id);

	if(resultado.length == 0){
		res.json({ status: false, error: "no-encontrado" });	
	}else{
		res.json({ status: true, data: resultado[0] });	
	}

});

router.post("/edit/:id", authtoken, async (req, res)=>{
	const permitidos = ["name", "phone", "email", "type", "delegation_of","address","postal_code","locality","province"];
	var prepare_update = {};

	permitidos.forEach(element => {
		if(req.body[element] != ''){
			prepare_update[element] = req.body[element];
		}
	});


	const resultado = await db("company")
		.where("ID", req.params.id)
		.update(prepare_update);

	res.json({status:true});
});

router.post("/delete/:id", authtoken, async (req, res)=>{
	
	const resultado = await db("company")
		.where("ID", req.params.id)
		.delete();

	res.json({status:true});

});


module.exports = router;
