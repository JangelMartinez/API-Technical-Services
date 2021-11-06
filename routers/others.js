const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authtoken = require("../config/authtoken");
const { route } = require("./users");

// Se pide información de acciones e incidencias del usuario logueado
router.get("/home", authtoken, async (req, res)=>{
	
	const user = req.tokendata;
	
	const result_action = await db.select("actions.ID","actions.ID_USER","users.name as user","company.name as company","contacts.name as contact","actions.type","actions.state","actions.description")
							.from("actions")
							.where("actions.ID_USER", user.ID)
							.join("users","actions.ID_USER","users.ID")
							.join("company","actions.ID_COMPANY","company.ID")
							.join("contacts","actions.ID_CONTACT","contacts.ID");

	const result_cases = await db.select("cases.ID","cases.ID_USER","users.name as user","company.name as company","contacts.name as contact","cases.purchase","cases.invoice","cases.warranty_date","cases.description","cases.cause","cases.state","cases.created")
							.from("cases")
							.where("cases.ID_USER", user.ID) 
							.join("users","cases.ID_USER","users.ID")
							.join("company","cases.ID_COMPANY","company.ID")
							.join("contacts","cases.ID_CONTACT","contacts.ID");

	console.log(user.ID);
	console.log(result_cases);

	res.json({
		status: true,
		data_actions: result_action,
		data_cases: result_cases
	});
});

router.get("/datos", authtoken, async (req, res)=>{
	
	const user = req.tokendata;
	
	const result_company = await db.select("*").from("company");

	const result_contact = await db.select("*").from("contacts");


	res.json({
		status: true,
		data_company: result_company,
		data_contact: result_contact
	});
});

module.exports =router;