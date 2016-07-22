var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var testSchema = new Schema({
	name: String,
	bucket: String,
	uuid: String,
});
module.exports = mongoose.model('Test', testSchema);
