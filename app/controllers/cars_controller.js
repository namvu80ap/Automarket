load('application');

before(loadCar, {
    only: ['show', 'edit', 'update', 'destroy']
    });

action('new', function () {
    this.title = 'New car';
    this.car = new Car;
    render();
});

action(function create() {
    Car.create(req.body.Car, function (err, car) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: car && car.errors || err});
                } else {
                    send({code: 200, data: car.toObject()});
                }
            });
            format.html(function () {
                if (err) {
                    flash('error', 'Car can not be created');
                    render('new', {
                        car: car,
                        title: 'New car'
                    });
                } else {
                    flash('info', 'Car created');
                    redirect(path_to.cars);
                }
            });
        });
    });
});

action(function index() {
    this.title = 'Cars index';
    Car.all(function (err, cars) {
        switch (params.format) {
            case "json":
                send({code: 200, data: cars});
                break;
            default:
                render({
                    cars: cars
                });
        }
    });
});

action(function show() {
    this.title = 'Car show';
    switch(params.format) {
        case "json":
            send({code: 200, data: this.car});
            break;
        default:
            render();
    }
});

action(function edit() {
    
	this.title = 'Car edit';
	console.log("---------");
	console.log(this.car.pics);
    
    
    switch(params.format) {
        case "json":
            send(this.car);
            break;
        default:
            render();
    }
});

action(function update() {
    var car = this.car;
    this.title = 'Edit car details';
    this.car.updateAttributes(body.Car, function (err) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: car && car.errors || err});
                } else {
                    send({code: 200, data: car});
                }
            });
            format.html(function () {
                if (!err) {
                    flash('info', 'Car updated');
                    redirect(path_to.car(car));
                } else {
                    flash('error', 'Car can not be updated');
                    render('edit');
                }
            });
        });
    });
});

action(function destroy() {
    this.car.destroy(function (error) {
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
                    flash('error', 'Can not destroy car');
                } else {
                    flash('info', 'Car successfully removed');
                }
                send("'" + path_to.cars + "'");
            });
        });
    });
});

function loadCar() {
    Car.find(params.id, function (err, car) {
        if (err || !car) {
            if (!err && !car && params.format === 'json') {
                return send({code: 404, error: 'Not found'});
            }
            redirect(path_to.cars);
        } else {
            this.car = car;
            next();
        }
    }.bind(this));
}
