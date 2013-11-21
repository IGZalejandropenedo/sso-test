iris.screen(function(self) {
	self.create = function() {
		self.tmpl(iris.path.screen.welcome.html);

		self.screens('screens',
			[
				[ 'admin', iris.path.screen.admin.js],
				[ 'bag', iris.path.screen.bag.js],
				[ 'catalog', iris.path.screen.catalog.js],
				[ 'login', iris.path.screen.login.js],
				[ 'logout', iris.path.screen.logout.js],
				[ 'profile', iris.path.screen.profile.js]
			]
		);
	};

	self.awake = function () {
		if ( !document.location.hash ) {
			iris.navigate('#/login');
		}
	};

}, iris.path.screen.welcome.js);