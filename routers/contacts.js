const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authtoken = require("../config/authtoken");

router.get("/get_list/:empresa?", authtoken, async (req , res) =>{
	
	const empresa = req.params.empresa;

	if(empresa === undefined){
		var resultado = await db.select("*").from("contacts");
	}else{
		var resultado = await db.select("*").from("contacts").where("ID_COMPANY", empresa);
	}

	res.json({
		status: true,
		data: resultado
	});
});

router.get("/get/:id", authtoken, async (req, res)=>{

	console.log("id",req.params.id);

	var resultado = await db.select("contacts.ID","contacts.name","company.name as company","contacts.phone","contacts.mail","contacts.notes")
					.from("contacts")
					.where("contacts.ID", req.params.id)
					.join("company","contacts.ID_COMPANY","company.ID");

	res.json({
		status: true,
		data: resultado[0]
	});

	
});

router.post("/add", authtoken, async (req, res)=>{

	console.log('entro en add');
	const obligatory = ["ID_COMPANY","name"];
	const allow = ["ID_COMPANY","name","phone","mail","notes"];

	var valido = true;
	var array_datos = {};

	obligatory.forEach(Element =>{
		if (typeof req.body[Element] ==="undefined" ){
			//console.log('entro en undefined');
			valido=false;
		}
	});

	allow.forEach(Element =>{
		if (req.body[Element] != ''){
			array_datos[Element] = req.body[Element];
		}
	});

	//console.log('arrany',array_datos);
	//Miramos si tiene todos los valores
	if (valido === false){
		return res.json({status: false});
	}


	const resultado = await db("contacts").insert(array_datos);

	//console.log('resultado',resultado);
	res.json({
		status: true,
		data: resultado[0]
	});
});

router.post("/edit/:id", authtoken, async (req, res)=>{
	const permitidos = ["ID_COMPANY","name","phone","mail","notes"];
	var prepare_update = {};

	permitidos.forEach(element => {
		if(req.body[element] != ''){
			prepare_update[element] = req.body[element];
		}
	});

	const resultado = await db("contacts")
		.where("ID", req.params.id)
		.update(prepare_update);

	res.json({status:true});
});

router.post("/delete/:id", authtoken, async (req, res)=>{
	const resultado = await db("contacts")
		.where("ID", req.params.id)
		.delete();

	res.json({status:true});
});


module.exports = router;
