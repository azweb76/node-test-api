function register(app){
	require('./profile').register(app);
	require('./tests').register(app);
}

module.exports = {
	register: register
};