var express = require('express'),
	// Cansecurity base module
	cansecurity = require('cansecurity'),

	user = require('./user'),
	publicApp = express(),
	privateApp = express(),
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

publicApp.use( express.static(__dirname + '/../www') );

// Express middlewares for parssing request data
publicApp.use(express.json());
publicApp.use(express.urlencoded());
publicApp.use(express.cookieParser());
//publicApp.use(express.bodyParser());

// Express session manager
/*publicApp.use(
	express.session({
		secret: secret
	})
);
publicApp.use(function(req, res, next){
	console.log('>>>>> cookies', req.cookies);
	console.log('>>>>> session', req.session);
	next();
});*/

// Cansecurity user validation middleware
publicApp.use(cs.validate);
publicApp.use(function(req, res, next){
	res.header('Allow', 'GET, POST; PUT, DELETE, HEAD');
	res.header('Access-Control-Allow-Origin',"*");
	res.header('Access-Control-Allow-Headers',"X-CS-Auth,X-CS-User");
	next();
});
publicApp.use(publicApp.router);
publicApp.use(express.errorHandler({
	dumpExceptions : true,
	showStack : true
}));

// Public paths
publicApp.get('/login', sendOk);
publicApp.get('/logout', function(req, res){
	cs.clear(req, res);
	res.send(200);
});

// Only for logged in users and restricted to self or certain roles
publicApp.get('/profile', cs.restrictToLoggedIn, function(req, res){
	res.send(cs.getUser(req));
});
publicApp.get('/profile/:username', cs.restrictToSelfOrRoles(['admin']), function(req, res){
	var profile = user.get(req.params.username);
	res.send(profile);
});

// Restricted to certain roles
publicApp.get('/admin', cs.restrictToRoles(['admin']), function(req, res){
	res.send(user.getAll());
});

function sendOk(req, res, next){
	res.send(200,{});
}


privateApp.use(express.json());
privateApp.use(express.urlencoded());
privateApp.use(express.cookieParser());
//privateApp.use(express.bodyParser());

privateApp.use(privateApp.router);
privateApp.use(express.errorHandler({
	dumpExceptions : true,
	showStack : true
}));

privateApp.post("/validate", function(req, res){
	//console.log(req.body);
	var username = req.body.username;
	var password = req.body.password;

	user.validate(username, password, function(success, user, username, hash){
		var result =  {
			success: success,
			user: user,
			username: username,
			hash:hash
		};

		res.send(200, result);
	});
});

console.log('Auth public listening on port', port);
publicApp.listen(port);
console.log('Auth private listening on port', port - 1);
privateApp.listen(port - 1);
