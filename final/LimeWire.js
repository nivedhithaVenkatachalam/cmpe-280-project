var express = require( 'express' );
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
//var mysql = require("mysql");
app.use(express.static(path.join(__dirname, 'public')));
//app.use(app.router);
app.use(bodyParser.json());
//app.use(express['static'](__dirname + '/../public'));
//get
app.get('/', function(req, res){
  fs.readFile(__dirname+'/public/froggerhome.html', 'utf8', function(err, text){
        res.send(text);
    });
});
http = require('http');
var http = require('http').Server( app );
var io = require( './public/SocketIO.js' ).listen( http );
//start mysql DB
/*var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "YES",
  database:"LiveWires"
});
con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

con.query('SELECT * FROM user_registration',function(err,rows){
  if(err) throw err;

  console.log('Data received from Db:\n');
  console.log(rows);
});

app.post('/register', function(req, res){
	console.log(req.body);
    var user = { user_name: 'test2', user_email: 'test2@gmail.com', ind_password:"password" };
    user.user_name=req.body.user_name;
    user.user_email=req.body.user_email;
    user.ind_password=req.body.ind_password;
    con.query('INSERT INTO user_registration SET ?', user, function(err,res){
  if(err) throw err;

  console.log('Last insert ID:', res.insertId);
	});
  });
*/
/*var user = { user_name: 'test2', user_email: 'test2@gmail.com', ind_password:"password" };
con.query('INSERT INTO user_registration SET ?', user, function(err,res){
  if(err) throw err;

  console.log('Last insert ID:', res.insertId);
});*/

/*con.end(function(err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
});*/
//End mysql
http.listen( process.env.PORT || 3000, function() {
  console.log( 'listening on *:3000' );
} );
