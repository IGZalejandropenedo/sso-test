iris.screen(function(self) {
	self.create = function() {
		self.tmpl(iris.path.screen.logout.html);
	};

	self.awake = function(){
		iris.resource(iris.path.resource.user.js).logout(function(data){
			$.ajaxSetup({
				headers: {}
			});
			iris.navigate("/login");
		}, function(data){
			$.ajaxSetup({
				headers: {}
			});
			iris.navigate("/login");
		});
	};
}, iris.path.screen.logout.js);