function register(app){
	require('./profile').register(app);
	require('./testGroups').register(app);
	require('./test').register(app);
}

module.exports = {
	register: register
};