var app = require('../lib');
var testApi = require('../lib/routes/test');

describe("Test Service", function() {

  var testUuid, testName, testBucket;
  var req, res;

  before(function() {
    testUuid = process.env.UUID;
    testName = process.env.NAME;
    testBucket = process.env.BUCKET;

    app.start({port: 3333});
  });

  after(function() {
    app.stop();
  });

  beforeEach(function () {
    req = {};
    res = {
      statusCode: "",
      json: function(json) {
        this.json = json;
      }
    };
  });

  afterEach(function() {
    console.log(res);
  });

  it("[create_record] create new record in service", function(done) {
    req.body = {uuid: testUuid, name: testName, bucket: testBucket};
    testApi.createOne(req, res, function() {
      if(res.statusCode != 201) {
        throw new Error(res.json.error);
      }
      done();
    });
  });


  it("[update_record] update record in service", function(done) {
    req.body = {name: testName, bucket: testBucket};
    req.params = {uuid: testUuid};
    testApi.updateOne(req, res, function() {
      if(res.statusCode != 200) {
        throw new Error(res.json.error);
      }
      done();
    });
  });

  it("[delete_record] delete record in service", function(done) {
    req.params = {uuid: testUuid};
    testApi.deleteOne(req, res, function() {
      if(res.statusCode != 200) {
        throw new Error(res.json.error);
      }
      done();
    })
  });

});
