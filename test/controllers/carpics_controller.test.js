var app, compound
, request = require('supertest')
, sinon   = require('sinon');

function CarpicStub () {
    return {
        carId: '',
        name: '',
        url: ''
    };
}

describe('CarpicController', function() {
    beforeEach(function(done) {
        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
            done();
        });
    });

    /*
     * GET /carpics/new
     * Should render carpics/new.ejs
     */
    it('should render "new" template on GET /carpics/new', function (done) {
        request(app)
        .get('/carpics/new')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/carpics\/new\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /carpics
     * Should render carpics/index.ejs
     */
    it('should render "index" template on GET /carpics', function (done) {
        request(app)
        .get('/carpics')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/carpics\/index\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /carpics/:id/edit
     * Should access Carpic#find and render carpics/edit.ejs
     */
    it('should access Carpic#find and render "edit" template on GET /carpics/:id/edit', function (done) {
        var Carpic = app.models.Carpic;

        // Mock Carpic#find
        Carpic.find = sinon.spy(function (id, callback) {
            callback(null, new Carpic);
        });

        request(app)
        .get('/carpics/42/edit')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Carpic.find.calledWith('42').should.be.true;
            app.didRender(/carpics\/edit\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * GET /carpics/:id
     * Should render carpics/index.ejs
     */
    it('should access Carpic#find and render "show" template on GET /carpics/:id', function (done) {
        var Carpic = app.models.Carpic;

        // Mock Carpic#find
        Carpic.find = sinon.spy(function (id, callback) {
            callback(null, new Carpic);
        });

        request(app)
        .get('/carpics/42')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Carpic.find.calledWith('42').should.be.true;
            app.didRender(/carpics\/show\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * POST /carpics
     * Should access Carpic#create when Carpic is valid
     */
    it('should access Carpic#create on POST /carpics with a valid Carpic', function (done) {
        var Carpic = app.models.Carpic
        , carpic = new CarpicStub;

        // Mock Carpic#create
        Carpic.create = sinon.spy(function (data, callback) {
            callback(null, carpic);
        });

        request(app)
        .post('/carpics')
        .send({ "Carpic": carpic })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            Carpic.create.calledWith(carpic).should.be.true;

            done();
        });
    });

    /*
     * POST /carpics
     * Should fail when Carpic is invalid
     */
    it('should fail on POST /carpics when Carpic#create returns an error', function (done) {
        var Carpic = app.models.Carpic
        , carpic = new CarpicStub;

        // Mock Carpic#create
        Carpic.create = sinon.spy(function (data, callback) {
            callback(new Error, carpic);
        });

        request(app)
        .post('/carpics')
        .send({ "Carpic": carpic })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Carpic.create.calledWith(carpic).should.be.true;

            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * PUT /carpics/:id
     * Should redirect back to /carpics when Carpic is valid
     */
    it('should redirect on PUT /carpics/:id with a valid Carpic', function (done) {
        var Carpic = app.models.Carpic
        , carpic = new CarpicStub;

        Carpic.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(null) }
            });
        });

        request(app)
        .put('/carpics/1')
        .send({ "Carpic": carpic })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            res.header['location'].should.include('/carpics/1');

            app.didFlash('error').should.be.false;

            done();
        });
    });

    /*
     * PUT /carpics/:id
     * Should not redirect when Carpic is invalid
     */
    it('should fail / not redirect on PUT /carpics/:id with an invalid Carpic', function (done) {
        var Carpic = app.models.Carpic
        , carpic = new CarpicStub;

        Carpic.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(new Error) }
            });
        });

        request(app)
        .put('/carpics/1')
        .send({ "Carpic": carpic })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * DELETE /carpics/:id
     * -- TODO: IMPLEMENT --
     */
    it('should delete a Carpic on DELETE /carpics/:id');

    /*
     * DELETE /carpics/:id
     * -- TODO: IMPLEMENT FAILURE --
     */
    it('should not delete a Carpic on DELETE /carpics/:id if it fails');
});
