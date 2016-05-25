var Profile = require('../models/profile');
var ProfileType = require('../models/profileType');
var util = require('util');
var extend = util._extend;

function get(req, res) {
  var q_cnt = 0;
  var f = {};
  var detail = false;
  if (req.query.detail){
    detail = req.query.detail;
    delete req.query['detail']
  }
  var fields = null;
  if (detail === 'id'){
    fields = '_id';
  }
  for(x in req.query) {
    q_cnt++;
    if (x === 'locked'){
      f['locked'] = req.query.locked;
    }
    else {
      f['meta.' + x] = req.query[x];
    }
  }
  if (q_cnt === 0){
    f = null;
  }
  Profile.find(f, fields, function(err, profiles) {
    if (err) {
      res.statusCode = 500;
      return res.json({
        error: err
      });
    }
    if (detail === 'id') {
      var d = profiles.map(function(i) {
        return i._id;
      });
      res.end(d.join('\n'));
    } else if (detail) {
        res.json(profiles);
    } else {
      var d = profiles.map(function(i) {
        return i.meta;
      });
      res.json(d);
    }
  });
}

function getSessionAll(req, res) {
  Profile.find({
    session_id: req.params.sessionid
  }, function(err, profiles) {
    if (err) {
      res.statusCode = 500;
      return res.json({
        error: err
      });
    }
    if (req.query.detail) {
      res.json(profiles);
    } else {
      var d = profiles.map(function(i) {
        return i.meta;
      });
      res.json(d);
    }
  });
}

function getOne(req, res) {
  Profile.findById(req.params.id, function(err, profile) {
    if (err) {
      res.statusCode = 500;
      return res.json({
        error: err
      });
    }
    res.json(profile);
  })
}

function getDefault(req, res) {
  ProfileType.findOne({
    name: req.params.name
  }, function(err, profileType) {
    if (err) return console.error(err);
    res.json(profileType);
  })
}

function getAll(req, res) {
  Profile.find({
    name: req.params.name
  }, function(err, profiles) {
    if (err) {
      res.statusCode = 500;
      return res.json({
        error: err
      });
    }
    if (req.query.detail) {
      res.json(profiles);
    } else {
      var d = profiles.map(function(i) {
        return i.meta;
      });
      res.json(d);
    }
  })
}

function getNext(req, res) {
  var profileType = {};
  ProfileType.findOne({
    name: req.params.name
  }, function(err, profileType) {
    if (profileType && profileType.token) {
      if (profileType.token !== req.headers['x-auth']) {
        res.statusCode = 401;
        return res.json({
          error: 'Invalid token'
        });
      }
    }
    Profile.findOneAndUpdate({
      name: req.params.name,
      locked: false
    }, {
      locked: true,
      locked_dt: new Date(),
      session_id: req.query.sessionid || null
    }, {}, function(err, result) {
      if (err) {
        res.statusCode = 500;
        return res.json({
          error: err
        });
      }
      if (result) {
        var typeMeta = profileType ? profileType.meta : {};
        var r = extend(typeMeta, result.meta);
        r._id = result._id;
        res.json(r);
      } else {
        res.json(null);
      }
    });
  })
}

function releaseOne(req, res) {
  var d = {
    locked: false,
    locked_dt: null
  };

  if (req.query.error) {
    d['$inc'] = {
      error_cnt: 1
    }
  } else {
    d['$inc'] = {
      use_cnt: 1
    }
  }

  Profile.findByIdAndUpdate(req.params.id, d, {}, function(err, result) {
    if (err) {
      res.statusCode = 500;
      return res.json({
        error: err
      });
    }
    res.json(result);
  });
}

function deleteOne(req, res) {
  Profile.findByIdAndRemove(req.params.id, function(err, result) {
    if (err) {
      res.statusCode = 500;
      return res.json({
        error: err
      });
    }
    res.json(result);
  });
}


function releaseAll(req, res) {
  Profile.update({
    name: req.params.name,
    locked: true
  }, {
    locked: false,
    locked_dt: null
  }, {
    multi: true
  }, function(err, results) {
    if (err) {
      res.statusCode = 500;
      return res.json({
        error: err
      });
    }
    res.json(results);
  });
}

function releaseSession(req, res) {
  Profile.update({
    locked: true,
    session_id: req.params.sessionid
  }, {
    locked: false,
    locked_dt: null,
    session_id: null
  }, {
    multi: true
  }, function(err, results) {
    if (err) {
      res.statusCode = 500;
      return res.json({
        error: err
      });
    }
    res.json(results);
  });
}

function add(req, res) {
  if (util.isArray(req.body)) {
    addBulk(req, res);
  } else {
    addOne(req, res);
  }
}

function addOne(req, res) {
  var profile = new Profile({
    name: req.params.name,
    locked: false,
    meta: req.body
  });
  profile.save(function(err, profile) {
    if (err) {
      res.statusCode = 500;
      return res.json({
        error: err
      });
    }
    res.json(profile);
  });
}

function addBulk(req, res) {
  var d = req.body.map(function(i) {
    return {
      name: req.params.name,
      locked: false,
      meta: i
    };
  });
  Profile.create(d, function(err, profiles) {
    if (err) {
      res.statusCode = 500;
      return res.json({
        error: err
      });
    }
    res.json(profiles);
  });
}

function updateDefaults(req, res) {
  var token = req.body.token;
  if (token) {
    delete req.body.token;
  }
  ProfileType.findOneAndUpdate({
    name: req.params.name
  }, {
    token: token,
    meta: req.body
  }, {
    upsert: true
  }, function(err, results) {
    if (err) {
      res.statusCode = 500;
      return res.json({
        error: err
      });
    }
    res.json(results);
  });
}

function updateOne(req, res) {
  var d = { meta: req.body };
  Profile.findOneAndUpdate({
    _id: req.params.id
  }, d, function(err, profile) {
    if (err) {
      res.statusCode = 500;
      return res.json({
        error: err
      });
    }
    res.json(profile);
  });
}

function register(app) {
  app.get('/profile/', get);
  app.post('/profile/:name', add);
  app.get('/profile/:id', getOne);
  app.get('/profile/:name/next', getNext);
  app.get('/profile/:name/all', getAll);
  app.post('/profile/:id/release', releaseOne);
  app.post('/profile/:id', updateOne);
  app.post('/profile/:name/defaults', updateDefaults);
  app.get('/profile/:name/defaults', getDefault);
  app.post('/profile/:name/releaseAll', releaseAll);
  app.post('/profile/session/:sessionid/releaseAll', releaseSession);
  app.get('/profile/session/:sessionid', getSessionAll);
  app.delete('/profile/:id', deleteOne);
}

module.exports = {
  register: register
};
