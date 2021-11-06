const db = require("./db");

const authtoken  = async (req, resp, next) => {

	// dc26494f8941b7c4a8d09ca3762af61e59520943

	// COMPROBAMOS SI HA MANDADO EL TOKEN
		if(req.headers.token != undefined){
			var token = req.headers.token;
		}else{
			return resp.status(401).json({
				status: false,
				error: "Falta token"
			});
		}


	// MIRAMOS SI LA COOKIE ES VÁLIDA
		const result = await db.select("*").from("Users").where("token", token);

		if(result.length == 0){
			return resp.status(401).json({
				status: false,
				error: "Token caducado o no válido"
			});

		}
		
	req.tokendata = result[0];

	next();

};

module.exports = authtoken;