var self = {},
	shoppingBag = {
		user1: {
			owner: 'user1',
			items: ['item1', 'item2', 'item3']
		}
	};


self.get = function(username) {
	return shoppingBag[username] || null;
};

module.exports = self;

