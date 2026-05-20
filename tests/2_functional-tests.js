const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;

const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  test('Viewing one stock', function(done) {

    chai.request(server)
      .get('/api/stock-prices?stock=GOOG')
      .end(function(err, res){

        assert.equal(res.status, 200);

        assert.exists(res.body.stockData.stock);
        assert.exists(res.body.stockData.price);

        done();

      });

  });

  test('Viewing one stock and liking it', function(done) {

    chai.request(server)
      .get('/api/stock-prices?stock=GOOG&like=true')
      .end(function(err, res){

        assert.equal(res.status, 200);

        assert.isNumber(res.body.stockData.likes);

        done();

      });

  });

  test('Viewing the same stock and liking it again', function(done) {

    chai.request(server)
      .get('/api/stock-prices?stock=GOOG&like=true')
      .end(function(err, res){

        assert.equal(res.status, 200);

        assert.isNumber(res.body.stockData.likes);

        done();

      });

  });

  test('Viewing two stocks', function(done) {

    chai.request(server)
      .get('/api/stock-prices?stock=GOOG&stock=MSFT')
      .end(function(err, res){

        assert.equal(res.status, 200);

        assert.isArray(res.body.stockData);

        done();

      });

  });

  test('Viewing two stocks and liking them', function(done) {

    chai.request(server)
      .get('/api/stock-prices?stock=GOOG&stock=MSFT&like=true')
      .end(function(err, res){

        assert.equal(res.status, 200);

        assert.isArray(res.body.stockData);

        done();

      });

  });

});