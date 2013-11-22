iris.path = {
	"screen": {
		"admin" : { "js":"screen/admin.js", "html":"screen/admin.html"},
		"bag" : { "js":"screen/bag.js", "html":"screen/bag.html"},
		"catalog" : { "js":"screen/catalog.js", "html":"screen/catalog.html"},
		"login" : { "js":"screen/login.js", "html":"screen/login.html"},
		"logout" : { "js":"screen/logout.js", "html":"screen/logout.html"},
		"profile" : { "js":"screen/profile.js", "html":"screen/profile.html"},
		"profile2" : { "js":"screen/profile2.js", "html":"screen/profile2.html"},
		"welcome" : { "js":"screen/welcome.js", "html":"screen/welcome.html"}
	},
	"ui": {
	},
	"resource": {
		"user": {js: "resource/user.js"},
		"shop": {js: "resource/shop.js"}
	}
};

iris.service = {
	"user" : "http://localhost:3000",
	"shop" : "http://localhost:3001"
};

iris.evts = {
};

$(document).ready(
	function () {
		iris.translations('en-US', './app/lang/en-us.js');

		iris.baseUri('app/');

		iris.locale(
			'en-US', {
				dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
				monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				dateFormat: 'd M Y H:i:s',
				currency: {
					formatPos: 'n',
					formatNeg: '-n',
					decimal: '.',
					thousand: ',',
					precision: 2
				}
			}
			);

		iris.welcome(iris.path.screen.welcome.js);
	}
);