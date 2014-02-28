var fs = require('fs'),
	express = require('express'),
	request = require('request'),
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
		validate: function(username, password, callback){
			var options = {
				url:"http://localhost:2999/validate", 
				json: {
					username: username, 
					password:password 
				}
			};

			request.post(options, function(error, response, body){
				callback(body.success, body.user, body.username, body.hash);
			});
		},
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
	port = 3001;

// Express middlewares for parssing request data
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser());
//app.use(express.bodyParser());


// Express session manager
/*app.use(
	express.session({
		secret: secret
	})
);
app.use(function(req, res, next){
	console.log('>>>>> cookies', req.cookies);
	console.log('>>>>> session', req.session);
	next();
});*/

// Cansecurity user validation middleware
app.use(cs.validate);
app.use(function(req, res, next){
	res.header('Allow', 'GET, POST; PUT, DELETE, HEAD');
	res.header('Access-Control-Allow-Origin',"*");
	res.header('Access-Control-Allow-Headers',"X-CS-Auth,X-CS-User");
	next();
});
app.use(app.router);
app.use(express.errorHandler({
	dumpExceptions : true,
	showStack : true
}));

// Only for logged in users and restricted to self or certain roles
app.get('/catalog', cs.restrictToLoggedIn, function(req, res){
	res.send(catalog.getAll());
});

app.get('/shoppingbag', cs.restrictToField('owner', getShoppingBag), sendShoppingBag);
app.get('/shoppingbag/:username', cs.restrictToFieldOrRoles('owner', ['admin'], getShoppingBag), sendShoppingBag);


function sendOk(req, res, next){
	res.send(200,{});
}

function getShoppingBag(req, res) {
	var username = req.params.username || cs.getUser(req).username;
	var b = bag.get(username);
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

console.log('Serv listening on port', port);
app.listen(port);
