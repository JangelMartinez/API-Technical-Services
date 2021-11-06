CREATE DATABASE IF NOT EXISTS Technical_service;

USE technical_service;

CREATE TABLE IF NOT EXISTS Users (
	ID int(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	email varchar(100) NOT NULL UNIQUE,
	password char(40) NOT NULL,
	token char(40) NOT NULL, -- Token de seguridad
	hash char(32) -- MMD5 del correo electrónico para foto de Gravatar
	name varchar (50),
	phone varchar (100),
	photo varchar(100),
	last_connection datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	created datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Products (
	ID int(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	code varchar(20) NOT NULL UNIQUE,
	name varchar(200),
	description text,	
	created datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Company (
	ID int(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name varchar(100) NOT NULL,
	phone varchar (11),
	email varchar (100),
	type ENUM ('cliente','proveedor','delegacion'),
	delegation_of varchar (100),
	address varchar (200),
	postal_code varchar (10),
	locality varchar (100),
	province varchar (100),
	created datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Contacts (
	ID int(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	ID_COMPANY int(10) NOT NULL,
	name varchar (100) NOT NULL,
	phone varchar (11),
	mail varchar(100),
	notes text,
	created datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT FOREIGN KEY (ID_COMPANY) REFERENCES Company(ID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Cases (
	ID int(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	ID_USER int(10) NOT NULL,
	ID_COMPANY int(10) NOT NULL,
	ID_CONTACT int(10),
	purchase varchar(15), -- albarán de compra
	invoice varchar(15), -- factura de compra
	warranty_date date,
	description text,
	cause ENUM ('pedidos','comercial','almacen','cliente','transporte','sat','administracion','programacion','proveedor'),
	state ENUM ('esp. material','esp. cliente', 'esp. proveedor', 'material recibido','cerrada'),	
	created datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT FOREIGN KEY (ID_USER) REFERENCES Users(ID) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT FOREIGN KEY (ID_COMPANY) REFERENCES Company(ID) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT FOREIGN KEY (ID_CONTACT) REFERENCES Contacts(ID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Actions (
	ID int(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	ID_USER int(10) NOT NULL,
	ID_COMPANY int(10) NOT NULL,
	ID_CONTACT int(10),
	ID_CASE int(10),
	type ENUM ('llamada', 'email', 'conexión remota', 'accion comercial', 'resolucion', 'reparación', 'devolución'),
	state ENUM ('en curso','pendiente', 'cancelada', 'completada'),
	description text,
	created datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT FOREIGN KEY (ID_USER) REFERENCES Users(ID) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT FOREIGN KEY (ID_COMPANY) REFERENCES Company(ID) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT FOREIGN KEY (ID_CONTACT) REFERENCES Contacts(ID) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT FOREIGN KEY (ID_CASE) REFERENCES Cases(ID) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS Products_case (
	ID int(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	ID_PROD int(10) NOT NULL,
	ID_CASE int(10) NOT NULL,
	serial_number varchar(15),
	product_date date,
	error varchar(100),
	description text,
	state ENUM ('quemado','error configuracion','error software','error hardware','reparado','error fabricante'),
	CONSTRAINT FOREIGN KEY (ID_PROD) REFERENCES Products(ID) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT FOREIGN KEY (ID_CASE) REFERENCES Cases(ID) ON DELETE CASCADE ON UPDATE CASCADE
);



