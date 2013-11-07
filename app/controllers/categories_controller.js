load('application');

before(loadCategory, {
    only: ['show', 'edit', 'update', 'destroy']
    });

action('new', function () {
    this.title = 'New category';
    this.category = new Category;
    render();
});

action(function create() {
    Category.create(req.body.Category, function (err, category) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: category && category.errors || err});
                } else {
                    send({code: 200, data: category.toObject()});
                }
            });
            format.html(function () {
                if (err) {
                    flash('error', 'Category can not be created');
                    render('new', {
                        category: category,
                        title: 'New category'
                    });
                } else {
                    flash('info', 'Category created');
                    redirect(path_to.categories);
                }
            });
        });
    });
});

action(function index() {
    this.title = 'Categorys index';
    Category.all(function (err, categories) {
        switch (params.format) {
            case "json":
                send({code: 200, data: categories});
                break;
            default:
                render({
                    categories: categories
                });
        }
    });
});

action(function show() {
    this.title = 'Category show';
    switch(params.format) {
        case "json":
            send({code: 200, data: this.category});
            break;
        default:
            render();
    }
});

action(function edit() {
    this.title = 'Category edit';
    switch(params.format) {
        case "json":
            send(this.category);
            break;
        default:
            render();
    }
});

action(function update() {
    var category = this.category;
    this.title = 'Edit category details';
    this.category.updateAttributes(body.Category, function (err) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: category && category.errors || err});
                } else {
                    send({code: 200, data: category});
                }
            });
            format.html(function () {
                if (!err) {
                    flash('info', 'Category updated');
                    redirect(path_to.category(category));
                } else {
                    flash('error', 'Category can not be updated');
                    render('edit');
                }
            });
        });
    });
});

action(function destroy() {
    this.category.destroy(function (error) {
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
                    flash('error', 'Can not destroy category');
                } else {
                    flash('info', 'Category successfully removed');
                }
                send("'" + path_to.categories + "'");
            });
        });
    });
});

function loadCategory() {
    Category.find(params.id, function (err, category) {
        if (err || !category) {
            if (!err && !category && params.format === 'json') {
                return send({code: 404, error: 'Not found'});
            }
            redirect(path_to.categories);
        } else {
            this.category = category;
            next();
        }
    }.bind(this));
}
