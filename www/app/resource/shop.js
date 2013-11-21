iris.resource(function(self){

	self.getCatalog = function(success, fail){
		console.log("getCatalog", iris.service.shop);

		var h = {};
		iris.ajax({
			url: iris.service.shop + '/catalog'
		}).done(function(data, status, xhr){
			console.log("ok");
			success(data);
		}).fail(function(){
			console.log(arguments);
			console.log("ko");
			fail(arguments[2]);
		});
	};

},iris.path.resource.shop.js);