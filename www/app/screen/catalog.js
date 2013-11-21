iris.screen(function(self) {
	var content = null;
	self.create = function() {
		self.tmpl(iris.path.screen.catalog.html);

		console.log('Catalog created');

		content = self.get("content");
	};

	self.awake = function() {
		console.log('Catalog awaken');

		iris.resource(iris.path.resource.shop.js).getCatalog(
			showCatalog,
			function(data){
				console.log(data);
				//content.html(data);
			}
		);
	};

	self.sleep = function() {
		content.html("");
	};

	self.destroy = function() {

	};

	function showCatalog(catalog){
		content.html("");

		for(var i = 0, L = catalog.length; i < L; i++) {
			var row = $("<tr></tr>");
			row.append("<td><img src='" + catalog[i].url + "' /></td>");
			row.append("<td>" + catalog[i].name + "</td>");
			row.append("<td>" + catalog[i].description + "</td>");
			content.append(row);
		}
	}
}, iris.path.screen.catalog.js);