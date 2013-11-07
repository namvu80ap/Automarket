exports.routes = function (map) {
	//map.root('home#index');
	map.get('/', 'home#index');
    map.resources('categories');

    map.resources('items');
    
    // Generic routes. Add all your routes below this line
    // feel free to remove generic routes
    map.all(':controller/:action');
    map.all(':controller/:action/:id');
};