var fs = require('fs'),
	express = require('express'),
	// Cansecurity base module
	cansecurity = require('cansecurity'),

	user = require('./user'),
	catalog = require('./catalog'),
	bag = require('./shopping_bag'),
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

// Express middlewares for parssing request data
app.use(express.json());
app.use(express.urlencoded());
//app.use(express.bodyParser());
app.use(express.cookieParser());

// Express session manager
app.use(express.session({secret: secret}));

// Cansecurity user validation middleware
app.use(cs.validate);
app.use(app.router);
app.use(express.errorHandler({
	dumpExceptions : true,
	showStack : true
}));

// Public paths
app.get('/login', sendOk);
app.get('/logout', function(req, res){
	console.log(res);
	res.send(200);
});

// Only for logged in users and restricted to self or certain roles
app.get('/catalog', cs.restrictToLoggedIn, function(req, res){
	res.send(catalog.getAll());
});
app.get('/profile', cs.restrictToLoggedIn, function(req, res){
	res.send(cs.getUser(req));
});
app.get('/profile/:username', cs.restrictToSelfOrRoles(['admin']), function(req, res){
	var profile = user.get(req.params.username);
	res.send(profile);
});

app.get('/shoppingbag', cs.restrictToField('owner', getShoppingBag), sendShoppingBag);
app.get('/shoppingbag/:username', cs.restrictToFieldOrRoles('owner', ['admin'], getShoppingBag), sendShoppingBag);

// Restricted to certain roles
app.get('/admin', cs.restrictToRoles(['admin']), function(req, res){
	res.send(cs.getUser(req));
});

function sendOk(req, res, next){
	res.send(200,{});
}

function getShoppingBag(req, res) {
	var username = req.params.username || cs.getUser(req).username;
	var b = bag.get(username);
	console.log(">>>> getShoppingBag", username, b);
	req.shoppingBag = b;
	return b || {owner: username};
}

function sendShoppingBag(req, res) {
	if(req.shoppingBag) {
		return res.send(req.shoppingBag);
	}
	else {
		var username = req.params.username || cs.getUser(req).username;
		var shoppingBag = bag.get(username);
		res.send(shoppingBag ? shoppingBag.items : []);
	}
}

console.log('Application listening on port', port);
app.listen(port);
