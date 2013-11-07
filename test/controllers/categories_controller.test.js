var app, compound
, request = require('supertest')
, sinon   = require('sinon');

function CategoryStub () {
    return {
        name: '',
        description: '',
        path: '',
        active: ''
    };
}

describe('CategoryController', function() {
    beforeEach(function(done) {
        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
            done();
        });
    });

    /*
     * GET /categories/new
     * Should render categories/new.ejs
     */
    it('should render "new" template on GET /categories/new', function (done) {
        request(app)
        .get('/categories/new')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/categories\/new\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /categories
     * Should render categories/index.ejs
     */
    it('should render "index" template on GET /categories', function (done) {
        request(app)
        .get('/categories')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/categories\/index\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /categories/:id/edit
     * Should access Category#find and render categories/edit.ejs
     */
    it('should access Category#find and render "edit" template on GET /categories/:id/edit', function (done) {
        var Category = app.models.Category;

        // Mock Category#find
        Category.find = sinon.spy(function (id, callback) {
            callback(null, new Category);
        });

        request(app)
        .get('/categories/42/edit')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Category.find.calledWith('42').should.be.true;
            app.didRender(/categories\/edit\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * GET /categories/:id
     * Should render categories/index.ejs
     */
    it('should access Category#find and render "show" template on GET /categories/:id', function (done) {
        var Category = app.models.Category;

        // Mock Category#find
        Category.find = sinon.spy(function (id, callback) {
            callback(null, new Category);
        });

        request(app)
        .get('/categories/42')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Category.find.calledWith('42').should.be.true;
            app.didRender(/categories\/show\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * POST /categories
     * Should access Category#create when Category is valid
     */
    it('should access Category#create on POST /categories with a valid Category', function (done) {
        var Category = app.models.Category
        , category = new CategoryStub;

        // Mock Category#create
        Category.create = sinon.spy(function (data, callback) {
            callback(null, category);
        });

        request(app)
        .post('/categories')
        .send({ "Category": category })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            Category.create.calledWith(category).should.be.true;

            done();
        });
    });

    /*
     * POST /categories
     * Should fail when Category is invalid
     */
    it('should fail on POST /categories when Category#create returns an error', function (done) {
        var Category = app.models.Category
        , category = new CategoryStub;

        // Mock Category#create
        Category.create = sinon.spy(function (data, callback) {
            callback(new Error, category);
        });

        request(app)
        .post('/categories')
        .send({ "Category": category })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Category.create.calledWith(category).should.be.true;

            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * PUT /categories/:id
     * Should redirect back to /categories when Category is valid
     */
    it('should redirect on PUT /categories/:id with a valid Category', function (done) {
        var Category = app.models.Category
        , category = new CategoryStub;

        Category.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(null) }
            });
        });

        request(app)
        .put('/categories/1')
        .send({ "Category": category })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            res.header['location'].should.include('/categories/1');

            app.didFlash('error').should.be.false;

            done();
        });
    });

    /*
     * PUT /categories/:id
     * Should not redirect when Category is invalid
     */
    it('should fail / not redirect on PUT /categories/:id with an invalid Category', function (done) {
        var Category = app.models.Category
        , category = new CategoryStub;

        Category.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(new Error) }
            });
        });

        request(app)
        .put('/categories/1')
        .send({ "Category": category })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * DELETE /categories/:id
     * -- TODO: IMPLEMENT --
     */
    it('should delete a Category on DELETE /categories/:id');

    /*
     * DELETE /categories/:id
     * -- TODO: IMPLEMENT FAILURE --
     */
    it('should not delete a Category on DELETE /categories/:id if it fails');
});
