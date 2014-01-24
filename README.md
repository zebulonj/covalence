# Covalance

## Proxy

Middleware for Express.js to selectively proxy requests to another server.

Usage:

	var express = require( 'express' ),
		covalence = require( 'covalence' );

	app = express();

	app.use( covalence.Proxy({ hostname: "www.foobar.com" }) );

	app.listen( 8080 );