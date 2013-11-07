var app, compound
, request = require('supertest')
, sinon   = require('sinon');

function ItemStub () {
    return {
        name: '',
        description: '',
        category: '',
        active: ''
    };
}

describe('ItemController', function() {
    beforeEach(function(done) {
        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
            done();
        });
    });

    /*
     * GET /items/new
     * Should render items/new.ejs
     */
    it('should render "new" template on GET /items/new', function (done) {
        request(app)
        .get('/items/new')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/items\/new\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /items
     * Should render items/index.ejs
     */
    it('should render "index" template on GET /items', function (done) {
        request(app)
        .get('/items')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/items\/index\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /items/:id/edit
     * Should access Item#find and render items/edit.ejs
     */
    it('should access Item#find and render "edit" template on GET /items/:id/edit', function (done) {
        var Item = app.models.Item;

        // Mock Item#find
        Item.find = sinon.spy(function (id, callback) {
            callback(null, new Item);
        });

        request(app)
        .get('/items/42/edit')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Item.find.calledWith('42').should.be.true;
            app.didRender(/items\/edit\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * GET /items/:id
     * Should render items/index.ejs
     */
    it('should access Item#find and render "show" template on GET /items/:id', function (done) {
        var Item = app.models.Item;

        // Mock Item#find
        Item.find = sinon.spy(function (id, callback) {
            callback(null, new Item);
        });

        request(app)
        .get('/items/42')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Item.find.calledWith('42').should.be.true;
            app.didRender(/items\/show\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * POST /items
     * Should access Item#create when Item is valid
     */
    it('should access Item#create on POST /items with a valid Item', function (done) {
        var Item = app.models.Item
        , item = new ItemStub;

        // Mock Item#create
        Item.create = sinon.spy(function (data, callback) {
            callback(null, item);
        });

        request(app)
        .post('/items')
        .send({ "Item": item })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            Item.create.calledWith(item).should.be.true;

            done();
        });
    });

    /*
     * POST /items
     * Should fail when Item is invalid
     */
    it('should fail on POST /items when Item#create returns an error', function (done) {
        var Item = app.models.Item
        , item = new ItemStub;

        // Mock Item#create
        Item.create = sinon.spy(function (data, callback) {
            callback(new Error, item);
        });

        request(app)
        .post('/items')
        .send({ "Item": item })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Item.create.calledWith(item).should.be.true;

            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * PUT /items/:id
     * Should redirect back to /items when Item is valid
     */
    it('should redirect on PUT /items/:id with a valid Item', function (done) {
        var Item = app.models.Item
        , item = new ItemStub;

        Item.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(null) }
            });
        });

        request(app)
        .put('/items/1')
        .send({ "Item": item })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            res.header['location'].should.include('/items/1');

            app.didFlash('error').should.be.false;

            done();
        });
    });

    /*
     * PUT /items/:id
     * Should not redirect when Item is invalid
     */
    it('should fail / not redirect on PUT /items/:id with an invalid Item', function (done) {
        var Item = app.models.Item
        , item = new ItemStub;

        Item.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(new Error) }
            });
        });

        request(app)
        .put('/items/1')
        .send({ "Item": item })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * DELETE /items/:id
     * -- TODO: IMPLEMENT --
     */
    it('should delete a Item on DELETE /items/:id');

    /*
     * DELETE /items/:id
     * -- TODO: IMPLEMENT FAILURE --
     */
    it('should not delete a Item on DELETE /items/:id if it fails');
});
