var Profile = require('../models/profile');
var ProfileType = require('../models/profileType');
var extend = require('util')._extend;

function get(req, res){
	Profile.find(function (err, profiles) {
	  if (err) return console.error(err);
	  res.json(profiles);
	});
}

function getOne(req, res){
	Profile.findById(req.params.id, function (err, profile) {
	  if (err) return console.error(err);
	  res.json(profile);
	})
}

function getDefault(req, res){
	ProfileType.findOne({ name: req.params.name }, function (err, profileType) {
	  if (err) return console.error(err);
	  res.json(profileType);
	})
}

function getAll(req, res){
	Profile.find({ name: req.params.name }, function (err, profiles) {
	  if (err) return console.error(err);
	  res.json(profiles);
	})
}

function getNext(req, res){
	var profileType = {};
	ProfileType.findOne({ name: req.params.name }, function(err, profileType){
		Profile.findOneAndUpdate({ name: req.params.name , locked: false }, { locked: true, locked_dt: new Date() }, {}, function(err, result){
			if(result){
				var typeMeta = profileType ? profileType.meta : {};
				var r = extend(typeMeta, result.meta);
                r._id = result._id;
		        res.json(r);
		    }
		    else {
		    	res.json(null);
		    }
		});
	})
}

function releaseOne(req, res){
	Profile.findByIdAndUpdate(req.params.id, { locked: false, locked_dt: null }, {}, function(err, result){
       res.json(result);
	});
}

function deleteOne(req, res){
	Profile.findByIdAndRemove(req.params.id, function(err, result){
       res.json(result);
	});
}


function releaseAll(req, res){
	Profile.update({ name: req.params.name, locked: true }, { locked: false, locked_dt: null }, { multi: true }, function(err, results){
       res.json(results);
	});
}

function add(req, res){
	var profile = new Profile({
       name: req.params.name,
       locked: false,
       meta: req.body
	});
	profile.save(function(err, profile){
	  if (err) return console.error(err);
	  res.json(profile);
	});
}

function updateDefaults(req, res){
	ProfileType.findOneAndUpdate({ name: req.params.name }, { meta: req.body }, { upsert: true }, function(err, results){
       res.json(results);
	});
}

function register(app){
	app.get('/profile/', get);
	app.post('/profile/:name', add);
	app.get('/profile/:id', getOne);
	app.get('/profile/:name/next', getNext);
	app.get('/profile/:name/all', getAll);
	app.post('/profile/:id/release', releaseOne);
	app.post('/profile/:name/defaults', updateDefaults);
	app.get('/profile/:name/defaults', getDefault);
	app.post('/profile/:name/releaseAll', releaseAll);
	app.delete('/profile/:id', deleteOne);
}

module.exports = {
	register: register
};