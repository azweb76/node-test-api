var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var profileSchema = mongoose.Schema({
    name: String,
    locked: Boolean,
    meta: Schema.Types.Mixed
});

module.exports = mongoose.model('Profile', profileSchema);