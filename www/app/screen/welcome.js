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
				[ 'profile', iris.path.screen.profile.js],
				[ 'profile2', iris.path.screen.profile2.js]
			]
		);
	};

	self.awake = function () {
		var cookie = $.cookie('ryu-auth');
		if( cookie ) {
			var authHeader = {
				'X-CS-Auth' : cookie
			};
			
			$.ajaxSetup({
				headers: authHeader,
				crossDomain: true
			});
			iris.navigate('#/catalog');
		}

		if ( !document.location.hash || !cookie) {
			iris.navigate('#/login');
		}
	};

}, iris.path.screen.welcome.js);