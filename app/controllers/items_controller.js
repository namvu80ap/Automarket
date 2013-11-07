load('application');

before(loadItem, {
    only: ['show', 'edit', 'update', 'destroy']
    });

action('new', function () {
    this.title = 'New item';
    this.item = new Item;
    render();
});

action(function create() {
    Item.create(req.body.Item, function (err, item) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: item && item.errors || err});
                } else {
                    send({code: 200, data: item.toObject()});
                }
            });
            format.html(function () {
                if (err) {
                    flash('error', 'Item can not be created');
                    render('new', {
                        item: item,
                        title: 'New item'
                    });
                } else {
                    flash('info', 'Item created');
                    redirect(path_to.items);
                }
            });
        });
    });
});

action(function index() {
    this.title = 'Items index';
    Item.all(function (err, items) {
        switch (params.format) {
            case "json":
                send({code: 200, data: items});
                break;
            default:
                render({
                    items: items
                });
        }
    });
});

action(function show() {
    this.title = 'Item show';
    switch(params.format) {
        case "json":
            send({code: 200, data: this.item});
            break;
        default:
            render();
    }
});

action(function edit() {
    this.title = 'Item edit';
    switch(params.format) {
        case "json":
            send(this.item);
            break;
        default:
            render();
    }
});

action(function update() {
    var item = this.item;
    this.title = 'Edit item details';
    this.item.updateAttributes(body.Item, function (err) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: item && item.errors || err});
                } else {
                    send({code: 200, data: item});
                }
            });
            format.html(function () {
                if (!err) {
                    flash('info', 'Item updated');
                    redirect(path_to.item(item));
                } else {
                    flash('error', 'Item can not be updated');
                    render('edit');
                }
            });
        });
    });
});

action(function destroy() {
    this.item.destroy(function (error) {
        respondTo(function (format) {
            format.json(function () {
                if (error) {
                    send({code: 500, error: error});
                } else {
                    send({code: 200});
                }
            });
            format.html(function () {
                if (error) {
                    flash('error', 'Can not destroy item');
                } else {
                    flash('info', 'Item successfully removed');
                }
                send("'" + path_to.items + "'");
            });
        });
    });
});

function loadItem() {
    Item.find(params.id, function (err, item) {
        if (err || !item) {
            if (!err && !item && params.format === 'json') {
                return send({code: 404, error: 'Not found'});
            }
            redirect(path_to.items);
        } else {
            this.item = item;
            next();
        }
    }.bind(this));
}
