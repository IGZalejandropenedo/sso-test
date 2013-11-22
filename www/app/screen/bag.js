iris.screen(function(self) {
	var content = null;
	self.create = function() {
		self.tmpl(iris.path.screen.bag.html);
		content = self.get('content');
	};

	self.awake = function() {
		iris.resource(iris.path.resource.shop.js).getBag(
			function(data){
				content.html(JSON.stringify(data));
			},
			function(data){
				content.html(data);
			}
		);
	};
}, iris.path.screen.bag.js);