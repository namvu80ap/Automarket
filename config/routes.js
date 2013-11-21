exports.routes = function (map) {
    map.resources('cars');

    map.resources('cars');
    map.resources('categories');
    map.resources('items');
    
	//map.root('home#index');
	map.get('/', 'home#index');
	map.post('/login', 'home#login');
	map.get('/goLogin', 'home#goLogin');
	map.get('/about', 'home#about');

    
    // Generic routes. Add all your routes below this line
    // feel free to remove generic routes
    //map.all(':controller/:action');
    //map.all(':controller/:action/:id');
	
	//map.all('/cars' , 'car#index');
    
    //Update
    map.get('/upload/upload_pic', 'upload#upload_form');
    map.post('/upload/upload_file', 'upload#upload_file');
};