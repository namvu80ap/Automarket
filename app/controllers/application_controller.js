
before(function requireManager() {
    if (!req.session.user) {
        req.session.redirect = req.path;
        redirect('/goLogin');
    } else {
    	//flash('error', 'You have no permission to access this area');
    	(req.session.user) ? next() : redirect('/');
//        User.find(session.passport.user, function (err, user) {
//            if (user && user.email === 'my.email@somehost.tld') {
//                req.user = user;
//                next();
//            } else {
//                flash('error', 'You have no permission to access this area');
//                redirect('/');
//            }
//        });
    }
});