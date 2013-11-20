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

// Public paths
app.get('/login', sendOk);

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

app.get('/shoppingbag', cs.restrictToField('owner', getShoppingBag), function(req, res){
	var shoppingBag = bag.get(cs.getUser(req).username);
	res.send(shoppingBag ? shoppingBag.items : []);
});
app.get('/shoppingbag/:username', cs.restrictToFieldOrRoles('owner', ['admin'],getShoppingBagByUserParam), function(req, res){
	var shoppingBag = bag.get(req.params.username);
	res.send(shoppingBag ? shoppingBag.items : []);
});



// Restricted to certain roles
app.get('/admin', cs.restrictToRoles(['admin']), function(req, res){
	res.send(cs.getUser(req));
});

function sendOk(req, res, next){
	res.send(200,{});
}

function getShoppingBag(req, res) {
	var user = cs.getUser(req);
	var b = bag.get(user.username);
	return b || {owner: user.username};
}

function getShoppingBagByUserParam(req, res) {
	var user = req.param.username;
	var b = bag.get(user);
	return b || {owner: user};
}

console.log('Application listening on port', port);
app.listen(port);
