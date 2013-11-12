exports.routes = function (map) {
	//map.root('home#index');
	map.get('/', 'home#index');
    map.resources('categories');

    map.resources('items');
    
    // Generic routes. Add all your routes below this line
    // feel free to remove generic routes
    map.all(':controller/:action');
    map.all(':controller/:action/:id');
    
    //Update
    map.get('upload_form', 'upload#upload_form');  
    map.post('upload_file', 'upload#upload_file');
};