/*
 db/schema.js contains database schema description for application models
 by default (when using jugglingdb as ORM) this file uses database connection
 described in config/database.json. But it's possible to use another database
 connections and multiple different schemas, docs available at

 http://railwayjs.com/orm.html

 Example of model definition:

 define('User', function () {
     property('email', String, { index: true });
     property('password', String);
     property('activated', Boolean, {default: false});
 });

 Example of schema configured without config/database.json (heroku redistogo addon):
 schema('redis', {url: process.env.REDISTOGO_URL}, function () {
     // model definitions here
 });

*/

var Item = describe('Item', function () {
    property('name', String);
    property('description', String);
    property('category', String);
    property('active', Boolean);
    set('restPath', pathTo.items);
});

var Category = describe('Category', function () {
    property('name', String);
    property('description', String);
    property('active', Boolean);
    set('restPath', pathTo.categories);
});

var Car = describe('Car', function () {
    property('name', String);
    property('model', String);
    property('description', String);
    property('category', String);
    property('maker', String);
    property('pics', String, { default: new Array()} );
    set('restPath', pathTo.cars);
});

