const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authtoken = require("../config/authtoken");

router.get("/get_list", authtoken, async (req , res) =>{
	const resultado = await db.select("*").from("products");

	res.json({
		status : true,
		data : resultado
	});
	
});

router.get("/get/:id", authtoken, async (req, res)=>{

	const resultado = await db.select("*").from("products").where("ID", req.params.id);

	if(resultado.length == 0){
		res.json({ status: false, error: "no-encontrado" });	
	}else{
		res.json({ status: true, data: resultado[0] });	
	}
});

router.post("/add", authtoken, async (req, res)=>{
	const allow = ["code","name","description"];
	var valido = true;
	const array_datos = {};

	allow.forEach(Element =>{
		if(typeof req.body === "undefined"){
			valido=false;
		}
	});

	//Miramos si tiene todos los valores
	if(valido === false){
		return res.json({status: false});
	}

	allow.forEach(element => {
		if(req.body[element] != ''){
			array_datos[element] = req.body[element];
		}
	});

	console.log(array_datos);
/* 	const array_datos = {
		code: req.body.code,
		name : req.body.name,
		description : req.body.description
	}; */

	const resultado = await db("products").insert(array_datos);

	res.json({
		status : true,
		data : resultado
	});
});

router.post("/edit/:id", authtoken, async (req, res)=>{

	const allow = ["code","name","description"];
	var prepare_update = {}
	console.log(req.params.id);

	allow.forEach(Element =>{
		if (req.body[Element] != '' ){
			prepare_update[Element] = req.body[Element];
		}
	});

	console.log(prepare_update);

	const resultado = await db("products").where("ID", req.params.id).update(prepare_update);
	console.log(resultado);
	res.json({status : true});
});

router.post("/delete/:id", authtoken, async (req, res)=>{

	const resultado = await db("products").where("ID", req.params.id).delete();
	res.json({status : true});
});


module.exports = router;
