var fs = require('fs'),
	express = require('express'),
	cansecurity = require('cansecurity'),
	user = require('./user'),
	app = express(),
	cs = cansecurity.init({
		validate: function(user, password, callback){
			//user.validate,
			console.log(arguments);
			callback(false, null, "error");
		},
		sessionKey: 'secretkeyomg!'
	});

app.use( express.static(__dirname + '/../www') );
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'secretkeyomg!'}));
app.use(cs.validate);
app.use(app.router);
/*app.use(express.errorHandler({
	dumpExceptions : true,
	showStack : true
}));*/

function sendOk(req, res, next){
	res.send(200, {});
}

app.get('/public',sendOk);
app.get('/login', function(req, res){
	fs.readFile('../www/login.html', function (err, data) {
		if (err) throw err;
		res.set('Content-Type', 'text/html');
		res.send(data);
	});
});
app.get('/logged', cs.restrictToLoggedIn, sendOk);

app.listen(3000);
