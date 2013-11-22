iris.screen(function(self) {
	var content = null;
	self.create = function() {
		self.tmpl(iris.path.screen.profile.html);
		content = self.get('content');
	};

	self.awake = function(){
		iris.resource(iris.path.resource.user.js).getProfile()
		.done(function(data){
			content.html(JSON.stringify(data));
		})
		.fail(function(){
			content.html(arguments[2]);
		});
	};
}, iris.path.screen.profile.js);