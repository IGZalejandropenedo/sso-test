iris.screen(function(self) {
	var usernameField = null,
		passwordField = null,
		content = null;

	self.create = function() {
		self.tmpl(iris.path.screen.login.html);

		usernameField = self.get("username");
		passwordField = self.get("password");
		content = self.get("content");

		self.get('submit').click(function(){
			iris.resource(iris.path.resource.user.js).login(
				usernameField.val(), passwordField.val(),
				function(data){
					iris.navigate('/catalog');
				},
				function(data){
					content.html(data);
				}
			);
		});
	};

	self.awake = function() {};

	self.sleep = function() {
		usernameField.val("");
		passwordField.val("");
		content.html("");
	};

}, iris.path.screen.login.js);