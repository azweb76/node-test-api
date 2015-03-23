function register(app){
	require('./profile').register(app);
}

module.exports = {
	register: register
};