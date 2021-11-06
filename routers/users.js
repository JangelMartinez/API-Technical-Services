const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authtoken = require("../config/authtoken");
const seguridad = require("crypto");
const md5 = require("md5");

router.post("/login", async (req, res)=>{

	// 1º COMPROBAMOS SI EXISTE ESE LOGIN/PASSWORD EN LA DDBB
		// LA PASSWORD LA PASAMOS A SHA-1
		// Y RECUPERAMOS EL ID

	const data = req.body;
	const encrypt_password = seguridad.createHash('sha1').update(data.password,'binary').digest('hex');
	const result = await db.select("*").from("users").where('email', data.email).where('password', encrypt_password);
	
	// 2º SI NO ES CORRECTO, 401/403

	if(result.length == 0){
		return res.json({status: false, mensaje: "usuario o password incorrecto"});
	}

	// 3º SI ES CORRECTO
		// GENERAMOS UN NUEVO TOKEN --> Lo pasamos a sha-1
		// Lo guardamos en la DDBB asociado a ese ID (UPDATE)
		// Lo devolvemos con un status:true y la info del usuario si queremos

	var encrypt_token = seguridad.randomBytes(40).toString('hex').substring(0,40);

	const result2 = await db("users").where("ID", result[0].ID).update('token', encrypt_token);

	if (result2.length == 0){
		return res.json({status: false});
	}

	const result3 = await db.select("*").from("users").where('email', data.email).where('password', encrypt_password);
	
	res.json({status: true, data: result3[0]});
});


router.get("/get_list", authtoken, async (req , res) =>{
	const resultado = await db.select("*").from("users");

	res.json({
		status : true,
		data : resultado
	});
});

router.get("/get", authtoken, async (req, res)=>{
	
	res.json({ status : true, data : req.tokendata});

});

router.post("/add", async (req, res)=>{
	
	const allow = ["email", "password","token","name","phone","photo"];
	var valido = true;
	const array_datos = {};
	const data = req.body.password;
	var encrypt_password = seguridad.createHash('sha1').update(data,'binary').digest('hex');
	var encrypt_token = seguridad.randomBytes(40).toString('hex');
	var hashmd5 = md5(req.body['email']);

	array_datos["password"]= encrypt_password;
	array_datos["token"]= encrypt_token;
	array_datos["hash"]=hashmd5;

	allow.forEach(Element=>{
		if (typeof req.body[Element] != "undefined"){
			array_datos[Element] = req.body[Element];
		}
	});

	//Miramos si tiene todos los valores
	if(valido === false){
		return res.json({status: false});
	}


	const resultado = await db("users").insert(array_datos);

	res.json({
		status : true,
		data : resultado
	});

});

router.post("/edit/:id", authtoken, async (req, res)=>{
	
	const allow = ["email","password","name","phone","photo"];
	var prepare_update = {};

	allow.forEach(Element =>{
		if (typeof req.body[Element] != "undefined"){
			prepare_update[Element] = req.body[Element];
		}
	});

	const resultado = await db("users").where("ID", req.tokendata.ID).update(prepare_update);

	console.log(resultado);

	res.json({status : true});

});

router.post("/delete", authtoken, async (req, res)=>{

	const resultado = await db("users").where("ID", req.tokendata.ID).delete();
	res.json({status: true});
});



module.exports = router;
