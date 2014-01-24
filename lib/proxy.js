var http = require( 'http' );

/**
 * Proxy middleware for Express.js.
 *
 * @param params
 * 	@param [params.pattern] {RegExp} filters the request urls handled by the proxy.  Passes non-matching requests
 * 	through to application routes and middleware.
 *
 * @returns {Function( req, res, next )} The returned function implements the Express.js middleware signature.
 * @constructor
 */
var Proxy = function( params ) {
	return function( req, res, next ) {
		if ( !params.pattern || req.url.match( params.pattern ) ) {
			var options = {
				hostname: params.host || "localhost",
				port: params.port || 80,
				path: req.url,
				method: req.method || "GET"	// TODO: use request method for each request.
			};

			var p_req = http.request( options, function( p_res ) {
				console.log( "Proxying " + req.url + " (" + p_res.statusCode + ")")

				res.statusCode = p_res.statusCode;

				for ( var i in p_res.headers ) {
					res.setHeader( i, p_res.headers[i] );
				}

				p_res.on( 'data', function( chunk ) {
					res.write( chunk );
				});

				p_res.on( 'end', function() {
					res.end();
				});
			});

			for ( var i in req.headers ) {
				if ( i.match( /^host:/i ) ) {
					p_req.setHeader( i, params.host );
				}
				else {
					p_req.setHeader( i, req.headers[i] );
				}
			}

			req.on( 'data', function( chunk ) {
				p_req.write( chunk );
			});

			req.on( 'end', function( chunk ) {
				p_req.end();
			});
		}
		else {
			next();
		}
	};
};

module.exports = Proxy;