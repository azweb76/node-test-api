var TestModel = require('../models/test');

function getOne(req, res, callback) {
	TestModel.find({uuid: req.params.uuid}, function(err, tests) {
		if (err) {
			res.statusCode = 500;
			res.json({
				error: err
			});
		} else if(tests.length !== 0) {
			res.statusCode = 200;
			res.json(tests[0]);
		} else {
			res.statusCode = 404;
			res.json({
				error: "Resource not found."
			})
		}
		if(callback) callback();
	})
}

function getAll(req, res, callback) {
	TestModel.find({}, function (err, tests) {
		if (err) {
			res.statusCode = 500;
			res.json({
				error: err
			});
		} else {
			res.statusCode = 200;
			res.json(tests);
		}
		if(callback) callback();
	});
}

function createOne(req, res, callback) {
	if(isValidTestRecord(req.body)) {
		TestModel.find({uuid: req.body.uuid}, function(err, tests) {
			// check if this test already exist. Send 409: Conflict if it does
			if(tests.length !== 0) {
				res.statusCode = 409;
				res.json({
					error: "Conflict: Resource with uuid '" + req.body.uuid + "' already exists."
				});
				if(callback) callback();
			} else {
				var newTest = new TestModel({
					name: req.body.name,
					bucket: req.body.bucket,
					uuid: req.body.uuid
				});
				// Everything is perfect. Save!
				newTest.save(function(err, t) {
					if (err) {
						res.statusCode = 500;
						res.json({
							error: err
						});
					} else {
						res.statusCode = 201;
						res.json(t);
					}
					if(callback) callback();
				});
			}
		});
	} else {
		// not a valid record
		res.statusCode = 400;
		res.json({
			error: "Record is invalid. Expecting " + getRequiredKeys().toString()
		});
		if(callback) callback();
	}
}

function updateOne(req, res, callback) {
	TestModel.find({uuid: req.params.uuid}, function(err, tests) {
		if (err) {
			res.statusCode = 500;
			res.json({
				error: err
			});
			if(callback) callback();
		} else if(tests.length !== 0) {

			var test = tests[0];
			if(req.body.hasOwnProperty('name') && req.body.name) test.name = req.body.name;
			if(req.body.hasOwnProperty('bucket') && req.body.bucket) test.bucket = req.body.bucket;

			test.save(function (err, t) {
				if (err) {
					res.statusCode = 500;
					res.json({
						error: err
					});
				} else {
					res.statusCode = 200;
					res.json(t);
					if(callback) callback();
				}
			})

		} else {
			res.statusCode = 404;
			res.json({
				error: "Resource with uuid: " + req.params.uuid + " not found."
			});
			if(callback) callback();
		}
	})
}

function deleteOne(req, res, callback) {
	TestModel.find({uuid: req.params.uuid}, function(err, tests) {
		if (err) {
			res.statusCode = 500;
			res.json({
				error: err
			});
			if(callback) callback();
		} else if(tests.length !== 0) {
			var test = tests[0];
			test.remove(function (err) {
				if (err) {
					res.statusCode = 500;
					res.json({
						error: err
					});
				} else {
					res.statusCode = 200;
					res.json({
						message: "Test successfully deleted."
					});
				}
				if(callback) callback();
			})
		} else {
			res.statusCode = 404;
			res.json({
				error: "Resource with uuid: " + req.params.uuid + " not found."
			});
			if(callback) callback();
		}
	})
}

function getRequiredKeys() {
	return ['name', 'bucket', 'uuid'];
}

function isValidTestRecord(test) {
	if(!test) return false;
	var requiredKeys = getRequiredKeys();
	for(var key of requiredKeys) {
		if(!test.hasOwnProperty(key) || !test[key]){
			return false;
		}
	}
	return true;
}


function register(app) {
	app.get('/tests/', getAll);
	app.get('/tests/:uuid', getOne);
	app.post('/tests/', createOne);
	app.put('/tests/:uuid', updateOne);
	app.delete('/tests/:uuid', deleteOne);
}

module.exports = {
	register: register,
	getAll: getAll,
	getOne: getOne,
	createOne: createOne,
	updateOne: updateOne,
	deleteOne: deleteOne
};