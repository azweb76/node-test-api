var Profile = require('./models/profile');

function start(opts) {
  setInterval(function() {
    Profile.update({
      locked: true,
      locked_dt: {
        $lt: (new Date() - opts.unlockProfileMs)
      }
    }, {
      locked: false,
      locked_dt: null,
      session_id: null
    }, {
      multi: true
    }, function(err, profiles) {
      if (err) return console.error(err);
    });
  }, 60000).unref();
}

module.exports = {
  start: start
};
