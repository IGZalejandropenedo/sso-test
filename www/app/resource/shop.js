iris.resource(function(self){

	self.getCatalog = function(success, fail){
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

	self.getBag = function(success, fail){
		var h = {};
		iris.ajax({
			url: iris.service.shop + '/shoppingbag'
		}).done(function(data, status, xhr){
			success(data);
		}).fail(function(){
			fail(arguments[2]);
		});
	};

},iris.path.resource.shop.js);