iris.screen(function(self) {
	self.create = function() {
		self.tmpl(iris.path.screen.logout.html);
		$.ajaxSetup({
			headers: {}
		});
	};

	self.awake = function(){
		iris.navigate("/login");
	};
}, iris.path.screen.logout.js);