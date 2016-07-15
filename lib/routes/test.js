var TestModel = require('../models/test');

function getOne(req, res) {
	TestModel.find({uuid: req.params.uuid}, function(err, tests) {
		if (err) {
			res.statusCode = 500;
			return res.json({
				error: err
			});
		}
		if(tests.length !== 0) {
			res.statusCode = 200;
			res.json(tests[0]);
		} else {
			res.statusCode = 404;
			return res.json({
				error: "Resource not found."
			})
		}
	})
}

function getAll(req, res) {
	TestModel.find({}, function (err, tests) {
		if (err) {
			res.statusCode = 500;
			return res.json({
				error: err
			});
		}
		res.statusCode = 200;
		res.json(tests);
	});
}

function createOne(req, res) {
	if(isValidTestRecord(req.body)) {
		TestModel.find({uuid: req.body.uuid}, function(err, tests) {
			if(tests.length !== 0) {
				res.statusCode = 409;
				return res.json({
					error: "Conflict: Resource with uuid '" + req.body.uuid + "' already exists."
				});
			} else {
				var newTest = new TestModel({
					name: req.body.name,
					bucket: req.body.bucket,
					uuid: req.body.uuid
				});
				newTest.save(function(err, t) {
					if (err) {
						res.statusCode = 500;
						return res.json({
							error: err
						});
					}
					res.statusCode = 201;
					res.json(t);
				});
			}
		});
	} else {
		res.statusCode = 400;
		return res.json({
			error: "Record is invalid. Expecting " + getRequiredKeys().toString()
		});
	}
}

function updateOne(req, res) {
	TestModel.find({uuid: req.params.uuid}, function(err, tests) {
		if (err) {
			res.statusCode = 500;
			return res.json({
				error: err
			});
		}
		if(tests.length !== 0) {
			var test = tests[0];
			if(req.body.hasOwnProperty('name')) test.name = req.body.name;
			if(req.body.hasOwnProperty('bucket')) test.bucket = req.body.bucket;

			test.save(function (err, t) {
				if (err) {
					res.statusCode = 500;
					return res.json({
						error: err
					});
				}
				res.statusCode = 200;
				res.json(t);
			})
		} else {
			res.statusCode = 404;
			return res.json({
				error: "Resource not found."
			})
		}
	})
}

function deleteOne(req, res) {
	TestModel.find({uuid: req.params.uuid}, function(err, tests) {
		if (err) {
			res.statusCode = 500;
			return res.json({
				error: err
			});
		}
		if(tests.length !== 0) {
			var test = tests[0];
			test.remove(function (err) {
				if (err) {
					res.statusCode = 500;
					return res.json({
						error: err
					});
				}
				res.statusCode = 200;
				return res.json({
					message: "User successfully deleted."
				});
			})
		} else {
			res.statusCode = 404;
			return res.json({
				error: "Resource not found."
			})
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
		if(!test.hasOwnProperty(key)){
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
	register: register
};
