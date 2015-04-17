var TestGroupModel = require('../models/TestGroupModel');
var util = require('util');
var extend = util._extend;

function get(req, res) {
  TestGroupModel.find(function(err, testGroups) {
    if (err) {
      res.statusCode = 500;
      return res.json({
        error: err
      });
    }
    res.json(testGroups);
  });
}

function getOne(req, res) {
  TestGroupModel.findById(req.params.id, function(err, testGroup) {
    if (err) {
      res.statusCode = 500;
      return res.json({
        error: err
      });
    }
    res.json(testGroup);
  })
}

function deleteOne(req, res) {
  TestGroupModel.findByIdAndRemove(req.params.id, function(err, result) {
    if (err) {
      res.statusCode = 500;
      return res.json({
        error: err
      });
    }
    res.json(result);
  });
}

function addOrUpdate(req, res) {
	TestGroupModel.find({ group: req.params.group, browser: req.params.browser }, function(err, testGroups){
		if (err) {
	      res.statusCode = 500;
	      return res.json({
	        error: err
	      });
	    }

	    var tests = req.body;
	    if(testGroups.length === 0){
	    	testGroup = new TestGroupModel({
			    browser: req.params.browser,
			    group: req.params.group,
			    tests: tests
			  });
	    	testGroup.save(function(err, t) {
			    if (err) {
			      res.statusCode = 500;
			      return res.json({
			        error: err
			      });
			    }
			    res.json(t);
			  });
	    }
	    else {
	    	tList = testGroup.tests;

	    	var newTests = [];
	    	tList.forEach(function(t){
	    		var updatedTest = tests[t.name];
	    		if(!updatedTest){
	    			t.lastRunDate = updatedTest.runDate;
	    			t.lastResult = updatedTest.result;

	    			switch(t.lastResult){
	    				case 'passed': t.passCount++; break;
	    				case 'failed': t.failedCount++; break;
	    				case 'errored': t.errorCount++; break;
	    			}

	    			t.timeInMs = updatedTest.time;

	    			delete tests[t.name];
	    		}


	    	});
	    }
	});
  var testGroup = new TestGroupModel({
    browser: req.params.browser,
    group: req.params.group,
    tests: req.body
  });
  testGroup.save(function(err, t) {
    if (err) {
      res.statusCode = 500;
      return res.json({
        error: err
      });
    }
    res.json(t);
  });
}


function register(app) {
  app.get('/tests/', get);
  app.post('/tests/:group/:browser/', addOrUpdate);
  app.delete('/tests/:id', deleteOne);
}

module.exports = {
  register: register
};
