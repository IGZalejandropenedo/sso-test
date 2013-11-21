var crypto = require('crypto'),
	self = {},
	userStore = [
	{
		username: 'admin',
		password: 'admin',
		roles: ['admin']
	},
	{
		username: 'user1',
		password: 'user1',
		roles: []
	},
	{
		username: 'user2',
		password: 'user2',
		roles: []
	}
];

self.get = function(username) {
	for(var i in userStore) {
		if(userStore[i].username === username) {
			return userStore[i];
		}
	}
	return null;
};

self.validate = function(username, password, callback) {
	var user = self.get(username);
	if(user && user.username === username) {
		if(password) {
			if(user.password === password) {
				return callback(true, user, user.username, hash(user.password));
			} else {
				return callback(false, null, 'invalid password');
			}
		} else {
			return callback(true, user, user.username, hash(user.password));
		}
	} else {
		callback(false, null, 'invalid user');
	}
};

function hash(content) {
	var shasum = crypto.createHash('sha1');
	shasum.update(content);
	return shasum.digest('hex');
}

module.exports = self;

