load('application');

before(loadCarPic, {
    only: ['show', 'edit', 'update', 'destroy']
    });

action('new', function () {
    this.title = 'New CarPic';
    this.CarPic = new CarPic;
    render();
});

action(function create() {
    CarPic.create(req.body.CarPic, function (err, CarPic) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: CarPic && CarPic.errors || err});
                } else {
                    send({code: 200, data: CarPic.toObject()});
                }
            });
            format.html(function () {
                if (err) {
                    flash('error', 'CarPic can not be created');
                    render('new', {
                        CarPic: CarPic,
                        title: 'New CarPic'
                    });
                } else {
                    flash('info', 'CarPic created');
                    redirect(path_to.carpics);
                }
            });
        });
    });
});

action(function index() {
    this.title = 'CarPics index';
    var carId = req.query.carId;
    Car.all( { where : { carId : carId }}, function( error , cars ){
    	CarPic.all({ where : { carId : carId } }, function (err, carpics) {
            switch (params.format) {
                case "json":
                    send({code: 200, data: carpics});
                    break;
                default:
                    render({
                        carpics: carpics,
                        car: cars[0]
                    });
            }
        });
    } );
});

action(function show() {
    this.title = 'CarPic show';
    switch(params.format) {
        case "json":
            send({code: 200, data: this.CarPic});
            break;
        default:
            render();
    }
});

action(function edit() {
    this.title = 'CarPic edit';
    switch(params.format) {
        case "json":
            send(this.CarPic);
            break;
        default:
            render();
    }
});

action(function update() {
    var CarPic = this.CarPic;
    this.title = 'Edit CarPic details';
    this.CarPic.updateAttributes(body.CarPic, function (err) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: CarPic && CarPic.errors || err});
                } else {
                    send({code: 200, data: CarPic});
                }
            });
            format.html(function () {
                if (!err) {
                    flash('info', 'CarPic updated');
                    redirect(path_to.CarPic(CarPic));
                } else {
                    flash('error', 'CarPic can not be updated');
                    render('edit');
                }
            });
        });
    });
});

action(function destroy() {
	var carId = this.CarPic.carId;
    this.CarPic.destroy(function (error) {
        respondTo(function (format) {
        	Car.all( { where : { carId : carId } } , function( err, cars ) {
        		format.json(function () {
                    if (error) {
                        send({code: 500, error: error});
                    } else {
                        send({code: 200});
                    }
                });
                format.html(function () {
                    if (error) {
                        flash('error', 'Can not destroy CarPic');
                    } else {
                        flash('info', 'CarPic successfully removed');
                    }
                    redirect("cars/"+ cars[0].id);
                });
        	});            
        });
    });
});

function loadCarPic() {
    CarPic.find(params.id, function (err, CarPic) {
        if (err || !CarPic) {
            if (!err && !CarPic && params.format === 'json') {
                return send({code: 404, error: 'Not found'});
            }
            redirect(path_to.carpics);
        } else {
            this.CarPic = CarPic;
            next();
        }
    }.bind(this));
}
