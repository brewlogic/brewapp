'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Spot = mongoose.model('Spot'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  spot;

/**
 * Spot routes tests
 */
describe('Spot CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Spot
    user.save(function () {
      spot = {
        name: 'Spot name'
      };

      done();
    });
  });

  it('should be able to save a Spot if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Spot
        agent.post('/api/spots')
          .send(spot)
          .expect(200)
          .end(function (spotSaveErr, spotSaveRes) {
            // Handle Spot save error
            if (spotSaveErr) {
              return done(spotSaveErr);
            }

            // Get a list of Spots
            agent.get('/api/spots')
              .end(function (spotsGetErr, spotsGetRes) {
                // Handle Spots save error
                if (spotsGetErr) {
                  return done(spotsGetErr);
                }

                // Get Spots list
                var spots = spotsGetRes.body;

                // Set assertions
                (spots[0].user._id).should.equal(userId);
                (spots[0].name).should.match('Spot name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Spot if not logged in', function (done) {
    agent.post('/api/spots')
      .send(spot)
      .expect(403)
      .end(function (spotSaveErr, spotSaveRes) {
        // Call the assertion callback
        done(spotSaveErr);
      });
  });

  it('should not be able to save an Spot if no name is provided', function (done) {
    // Invalidate name field
    spot.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Spot
        agent.post('/api/spots')
          .send(spot)
          .expect(400)
          .end(function (spotSaveErr, spotSaveRes) {
            // Set message assertion
            (spotSaveRes.body.message).should.match('Please fill Spot name');

            // Handle Spot save error
            done(spotSaveErr);
          });
      });
  });

  it('should be able to update an Spot if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Spot
        agent.post('/api/spots')
          .send(spot)
          .expect(200)
          .end(function (spotSaveErr, spotSaveRes) {
            // Handle Spot save error
            if (spotSaveErr) {
              return done(spotSaveErr);
            }

            // Update Spot name
            spot.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Spot
            agent.put('/api/spots/' + spotSaveRes.body._id)
              .send(spot)
              .expect(200)
              .end(function (spotUpdateErr, spotUpdateRes) {
                // Handle Spot update error
                if (spotUpdateErr) {
                  return done(spotUpdateErr);
                }

                // Set assertions
                (spotUpdateRes.body._id).should.equal(spotSaveRes.body._id);
                (spotUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Spots if not signed in', function (done) {
    // Create new Spot model instance
    var spotObj = new Spot(spot);

    // Save the spot
    spotObj.save(function () {
      // Request Spots
      request(app).get('/api/spots')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Spot if not signed in', function (done) {
    // Create new Spot model instance
    var spotObj = new Spot(spot);

    // Save the Spot
    spotObj.save(function () {
      request(app).get('/api/spots/' + spotObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', spot.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Spot with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/spots/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Spot is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Spot which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Spot
    request(app).get('/api/spots/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Spot with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Spot if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Spot
        agent.post('/api/spots')
          .send(spot)
          .expect(200)
          .end(function (spotSaveErr, spotSaveRes) {
            // Handle Spot save error
            if (spotSaveErr) {
              return done(spotSaveErr);
            }

            // Delete an existing Spot
            agent.delete('/api/spots/' + spotSaveRes.body._id)
              .send(spot)
              .expect(200)
              .end(function (spotDeleteErr, spotDeleteRes) {
                // Handle spot error error
                if (spotDeleteErr) {
                  return done(spotDeleteErr);
                }

                // Set assertions
                (spotDeleteRes.body._id).should.equal(spotSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Spot if not signed in', function (done) {
    // Set Spot user
    spot.user = user;

    // Create new Spot model instance
    var spotObj = new Spot(spot);

    // Save the Spot
    spotObj.save(function () {
      // Try deleting Spot
      request(app).delete('/api/spots/' + spotObj._id)
        .expect(403)
        .end(function (spotDeleteErr, spotDeleteRes) {
          // Set message assertion
          (spotDeleteRes.body.message).should.match('User is not authorized');

          // Handle Spot error error
          done(spotDeleteErr);
        });

    });
  });

  it('should be able to get a single Spot that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Spot
          agent.post('/api/spots')
            .send(spot)
            .expect(200)
            .end(function (spotSaveErr, spotSaveRes) {
              // Handle Spot save error
              if (spotSaveErr) {
                return done(spotSaveErr);
              }

              // Set assertions on new Spot
              (spotSaveRes.body.name).should.equal(spot.name);
              should.exist(spotSaveRes.body.user);
              should.equal(spotSaveRes.body.user._id, orphanId);

              // force the Spot to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Spot
                    agent.get('/api/spots/' + spotSaveRes.body._id)
                      .expect(200)
                      .end(function (spotInfoErr, spotInfoRes) {
                        // Handle Spot error
                        if (spotInfoErr) {
                          return done(spotInfoErr);
                        }

                        // Set assertions
                        (spotInfoRes.body._id).should.equal(spotSaveRes.body._id);
                        (spotInfoRes.body.name).should.equal(spot.name);
                        should.equal(spotInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Spot.remove().exec(done);
    });
  });
});
