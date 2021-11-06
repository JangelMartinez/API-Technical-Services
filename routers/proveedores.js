const express = require("express");
const authtoken = require("../config/authtoken");
const router = express.Router();
const db = require("../config/db");

	router.get("/get/:id", authtoken, async (req, res)=>{
		
		const resultado = await db.select("*").where("ID", req.params.id).from("company");

		if(resultado.lenght == 0){
			res.json({status: false, error: "no encontrado"});
		}else{
			res.json({status: true, data: resultado[0]});
		}
	});

	router.get("/get_list/", authtoken, async (req, res)=>{
		
		const resutado = await db.select("company").where("type","proveedor").from("company");

		res.json({
			status: true,
			data: resultado
		});
	});
	
	router.post("/add", authtoken, async (req, res)=>{
		
		const allow = ["name", "phone", "email", "type", "delegation_of","address","postal_code","locality","province"];
		var valido = true;
		const array_datos = {};

		allow.forEach(Element =>{
			if(typeof req.body[element] != "undefined"){
				array_datos[element] = req.body[element];
			}else{
				valido: false;
			}
		});

		if(valido == false){
			return res.json({status: false});
		}

		const resultado = await db("company").insert(array_datos);

		res.json({
			status: true,
			data: resultado[0]
		})


	});
	
	router.post("/edit/:id", authtoken, async (req, res)=>{

		const allow = ["name", "phone", "email", "type", "delegation_of","address","postal_code","locality","province"];
		var prepare_update = {};

		allow.forEach(Element =>{
			if (typeof req.body[Element] != "undefined"){
				prepare_update[Element] = req.body[Element];
			}
		});

		const resultado = await db("company").where("ID", req.params.id).update(prepare_update);

		res.json({status: true});

	});
	
	router.post("/delete/:id", authtoken, async (req, res)=>{
		
		const resultado = await db("company").where("ID",req.params.id).delete();

		res.json({status: true})
	});

	
module.exports = router;