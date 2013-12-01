exports.routes = function (map) {
    map.resources('carpics');

    map.resources('cars');

    map.resources('cars');
    map.resources('categories');
    map.resources('items');
    
    
    //HOME and USER VIEW
	//map.root('home#index');
	map.get('/', 'home#index');
	map.post('/login', 'home#login');
	map.get('/goLogin', 'home#goLogin');
	map.get('/about', 'home#about');
	map.get('/viewCar', 'home#carDetails');
	
    // Generic routes. Add all your routes below this line
    // feel free to remove generic routes
    //map.all(':controller/:action');
    //map.all(':controller/:action/:id');
	
	//map.all('/cars' , 'car#index');
    
    //Update
    map.get('/upload/upload_pic', 'upload#upload_form');
    map.post('/upload/upload_file', 'upload#upload_file');
};