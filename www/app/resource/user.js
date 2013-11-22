iris.resource(function(self){
	self.login = function(username, password, success, fail){
		iris.ajax({
			url: iris.service.user + '/login',
			headers: {
				'Authorization': 'Basic ' + window.btoa(username + ":" + password)
			}
		}).done(function(data, status, xhr){
			var authHeader = {};
			var CSAuth = getResponseHeaders(xhr)['X-CS-Auth'].split("=")[1];

			//authHeader['X-CS-Auth'] = window.btoa(CSAuth);
			authHeader['X-CS-Auth'] = CSAuth;
			console.log(authHeader);
			$.ajaxSetup({
				headers: authHeader
			});
			success(data);
		}).fail(function(){
			fail(arguments[2]);
		});
	};

	self.logout = function(success, fail){
		iris.ajax({
			url: iris.service.user + '/logout'
		}).done(function(data, status, xhr){
			success(data);
		}).fail(function(){
			fail(arguments[2]);
		});
	};

	self.getProfile = function(user){
		var profile = '/profile' + (user ? '/' + user : '');
		return self.get(iris.service.user + profile);
	};

	self.getAll = function(){
		return self.get(iris.service.user + '/admin');
	};

	function getResponseHeaders(xhr){
		var headerArray = xhr.getAllResponseHeaders().split("\n");
		var h = {};
		for (var i = 0, L = headerArray.length; i < L; i++) {
			if(headerArray[i].length === 0) continue;
			var colonPos = headerArray[i].indexOf(':');
			h[headerArray[i].substring(0, colonPos)] = headerArray[i].substring(colonPos+1, headerArray[i].length).replace(/[\n\r]/,'');
		}

		return h;
	}
},iris.path.resource.user.js);