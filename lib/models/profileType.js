var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var profileSchema = mongoose.Schema({
    name: String,
    meta: Schema.Types.Mixed
});

module.exports = mongoose.model('ProfileType', profileSchema);