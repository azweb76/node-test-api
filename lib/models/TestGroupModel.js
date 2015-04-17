var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TestSchema = new Schema({
	name: String,
	error_cnt: Number,
	run_cnt: Number,
	enabled: Boolean
});

var TestGroupSchema = mongoose.Schema({
    browser: String,
    group: String,
    tests: [TestSchema]
});

module.exports = mongoose.model('TestGroup', TestGroupSchema);