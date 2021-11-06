const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

// Middlewares
	// muestra en consola las peticiones que se hacen en la web
	app.use(cors());
	app.use(express.json());	// recibir y entender json
	app.use(morgan('dev'));



// Listado de modelos
	//const proveedores = require("./routers/proveedores");
	//const clientes = require("./routers/clientes");
	const users = require("./routers/users");
	const company = require("./routers/company");
	const products = require("./routers/products");
	const actions = require("./routers/actions");
	const cases = require("./routers/cases");
	const contacts = require("./routers/contacts");
	const prod_cases = require("./routers/prod_cases");
	const others = require("./routers/others");

// Settings
	// mira que puerto tiene abierto por defecto y lo utiliza, o abre el puerto 3000 
	app.set('port', process.env.PORT || 3000)

// Endpoints
	//app.use('/', proveedores);
	//app.use('/customer', clientes);
	app.use('/users', users);
	app.use('/company', company);
	app.use('/products', products);
	app.use('/actions', actions);
	app.use('/cases', cases);
	app.use('/contacts', contacts);
	app.use('/prod_cases', prod_cases);
	app.use('/others', others);

	
	// entender los datos que vienen del formulario
	// app.use(express.urlencoded({extended: false}));

// starting server
app.listen(app.get('port'), ()=>{
	console.log("El servidor está escuchando en el puerto ", app.get('port'));
});