const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authtoken = require("../config/authtoken");

router.get("/get_list", authtoken, async (req , res) =>{
	
	const resultado = await db.select("*").from("products_case");

	res.json({
		status: true,
		data: resultado
	});
});

router.get("/get/:id_case", authtoken, async (req, res)=>{
	const resultado = await db.select("*").from("products_case").where("ID_CASE", req.params.id_case);

	res.json({
		status: true,
		data: resultado
	});
});

router.post("/add", authtoken, async (req, res)=>{
	
	const obligatory = ["ID_PROD","ID_CASE"];
	const allow = ["ID_PROD","ID_CASE","serial_number","product_date","error","description","state"];
	var valido = true;
	var array_datos = {};

	obligatory.forEach(Element=>{
		if(typeof req.body[Element] === "undefined"){
			valido = false;
		}
	})
	allow.forEach(Element=>{
		if(typeof req.body[Element] != "undefined"){
			array_datos[Element]=req.body[Element];
		}
	});

	if(valido == false){
		return res.json({status: false});
	}

	const resultado = await db("products_case").insert(array_datos);

	res.json({
		status: true,
		data: resultado
	})


});

router.post("/edit/:id", authtoken, async (req, res)=>{
	const allow = ["ID_PROD","ID_CASE","serial_number","product_date","error","description","state"];
	var prepare_update = {};

	allow.forEach(Element=>{
		if(typeof req.body[Element] != "undefined"){
			prepare_update[Element] = req.body[Element];
		}
	});

	const resultado = await db("products_case").where("ID",req.params.id).update(prepare_update);

	res.json({status: true});
});

router.post("/delete/:id", authtoken, async (req, res)=>{
	
	const resultado = await db("products_case").where("ID", req.params.id).delete();

	res.json({status: true})
});


module.exports = router;
