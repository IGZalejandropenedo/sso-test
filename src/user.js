var user = {},
	userStore = [
	{
		username: 'admin',
		password: 'admin',
		roles: ['admin', 'user']
	},
	{
		username: 'superadmin',
		password: 'superadmin',
		roles: ['superadmin', 'admin', 'user']
	},
	{
		username: 'user1',
		password: 'user1',
		roles: ['user']
	}
];

user.get = function(username) {
	for(var i in userStore) {
		if(userStore[i].username === username) {
			return userStore[i];
		}
	}
	return null;
};

user.validate = function(username, password, callback) {
	console.log(arguments);
	var user = user.get(username);
	if(user.username === username) {
		if(password) {
			if(user.password === password) {
				return callback(true, user, user.username, user.password);
			} else {
				return callback(false, null, 'invalid password');
			}
		} else {
			return callback(true, user, user.username);
		}
	} else {
		callback(false, null, 'invalid user');
	}
};

