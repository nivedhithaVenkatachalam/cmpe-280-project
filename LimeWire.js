/**
 * Module dependencies.
 */
var express = require( 'express' );
var fs = require( 'fs' );
var http = require('http').Server( app );
var io = require( './SocketIO.js' ).listen( http );
var app = express();

app.use(express.static('./'));


http.listen( process.env.PORT || 3000, function() {
  console.log( 'listening on *:3000' );
} );
