var app, compound
, request = require('supertest')
, sinon   = require('sinon');

function CarStub () {
    return {
        name: '',
        model: '',
        description: '',
        category: '',
        maker: '',
        pics: ''
    };
}

describe('CarController', function() {
    beforeEach(function(done) {
        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
            done();
        });
    });

    /*
     * GET /cars/new
     * Should render cars/new.ejs
     */
    it('should render "new" template on GET /cars/new', function (done) {
        request(app)
        .get('/cars/new')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/cars\/new\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /cars
     * Should render cars/index.ejs
     */
    it('should render "index" template on GET /cars', function (done) {
        request(app)
        .get('/cars')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/cars\/index\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /cars/:id/edit
     * Should access Car#find and render cars/edit.ejs
     */
    it('should access Car#find and render "edit" template on GET /cars/:id/edit', function (done) {
        var Car = app.models.Car;

        // Mock Car#find
        Car.find = sinon.spy(function (id, callback) {
            callback(null, new Car);
        });

        request(app)
        .get('/cars/42/edit')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Car.find.calledWith('42').should.be.true;
            app.didRender(/cars\/edit\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * GET /cars/:id
     * Should render cars/index.ejs
     */
    it('should access Car#find and render "show" template on GET /cars/:id', function (done) {
        var Car = app.models.Car;

        // Mock Car#find
        Car.find = sinon.spy(function (id, callback) {
            callback(null, new Car);
        });

        request(app)
        .get('/cars/42')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Car.find.calledWith('42').should.be.true;
            app.didRender(/cars\/show\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * POST /cars
     * Should access Car#create when Car is valid
     */
    it('should access Car#create on POST /cars with a valid Car', function (done) {
        var Car = app.models.Car
        , car = new CarStub;

        // Mock Car#create
        Car.create = sinon.spy(function (data, callback) {
            callback(null, car);
        });

        request(app)
        .post('/cars')
        .send({ "Car": car })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            Car.create.calledWith(car).should.be.true;

            done();
        });
    });

    /*
     * POST /cars
     * Should fail when Car is invalid
     */
    it('should fail on POST /cars when Car#create returns an error', function (done) {
        var Car = app.models.Car
        , car = new CarStub;

        // Mock Car#create
        Car.create = sinon.spy(function (data, callback) {
            callback(new Error, car);
        });

        request(app)
        .post('/cars')
        .send({ "Car": car })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Car.create.calledWith(car).should.be.true;

            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * PUT /cars/:id
     * Should redirect back to /cars when Car is valid
     */
    it('should redirect on PUT /cars/:id with a valid Car', function (done) {
        var Car = app.models.Car
        , car = new CarStub;

        Car.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(null) }
            });
        });

        request(app)
        .put('/cars/1')
        .send({ "Car": car })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            res.header['location'].should.include('/cars/1');

            app.didFlash('error').should.be.false;

            done();
        });
    });

    /*
     * PUT /cars/:id
     * Should not redirect when Car is invalid
     */
    it('should fail / not redirect on PUT /cars/:id with an invalid Car', function (done) {
        var Car = app.models.Car
        , car = new CarStub;

        Car.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(new Error) }
            });
        });

        request(app)
        .put('/cars/1')
        .send({ "Car": car })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * DELETE /cars/:id
     * -- TODO: IMPLEMENT --
     */
    it('should delete a Car on DELETE /cars/:id');

    /*
     * DELETE /cars/:id
     * -- TODO: IMPLEMENT FAILURE --
     */
    it('should not delete a Car on DELETE /cars/:id if it fails');
});
