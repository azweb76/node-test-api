var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var profileSchema = mongoose.Schema({
  name: String,
  locked: Boolean,
  locked_dt: Date,
  error_cnt: Number,
  use_cnt: Number,
  session_id: String,
  meta: Schema.Types.Mixed,
  disabled: Boolean
});

module.exports = mongoose.model('Profile', profileSchema);
