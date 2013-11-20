var fs = require('fs'),
	express = require('express'),
	// Cansecurity base module
	cansecurity = require('cansecurity'),

	user = require('./user'),
	app = express(),
	secret = 'this_is_esparto!',

	// Initialized Cansecurity Module
	cs = cansecurity.init({
		// Function to validate if the user is logged in
		// Only executed if there is an Authorization: Basic base64(user:password) header or a Token
		validate: user.validate,
		// Key to cypher the session
		sessionKey: secret,
		// Where in the user object are the username and roles (default: id, roles)
		fields: {
			id: 'username',
			roles: 'roles'
		},
		
		// What is the path parameter where the user is (default: user)
		params: {
			id: 'username'
		}
	}),
	port = 3000;

app.use( express.static(__dirname + '/../www') );
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: secret}));
// Cansecurity user validation middleware
app.use(cs.validate);
app.use(app.router);
app.use(express.errorHandler({
	dumpExceptions : true,
	showStack : true
}));

function sendOk(req, res, next){
	res.send(200, cs.getUser(req));
}

// Public paths
app.get('/public',sendOk);
app.get('/login', function(req, res){
	fs.readFile('../www/login.html', function (err, data) {
		if (err) throw err;

		res.set('Content-Type', 'text/html');
		res.send(data);
	});
});

// Only for logged in users and restricted to self
app.get('/main', cs.restrictToLoggedIn, function(req, res){
	fs.readFile('../www/main.html', function (err, data) {
		if (err) throw err;

		data = (String(data)).replace(/##username##/, cs.getUser(req).username);
		res.set('Content-Type', 'text/html');
		res.send(data);
	});
});
app.get('/user/:username', cs.restrictToSelfOrRoles(['admin']), sendOk);

// Restricted to certain roles
app.get('/admin', cs.restrictToRoles(['admin', 'superadmin']), sendOk);

console.log('Application listening on port', port);
app.listen(port);
