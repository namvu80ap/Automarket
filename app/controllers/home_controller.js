/**
 * Index page
 */
action('index', function () {
	this.title = 'Automarket';
	var async = require('async');
	var obj = [];
	var count = 0;
    Car.all(function (err, cars) {
    	async.each( cars , 
    				function( item , callback ){
    					
    					CarPic.all( { where: { carId : item.carId } }, function( err, carPics ){
    						console.log( carPics );
    						obj[count] = { car : item , pics : carPics };
    						count++;
    						callback();
    					} );
    					
    				} , 
    				function( error ){
    					//console.log(obj);
    					switch (params.format) {
    			        case "json":
    			            send({code: 200, data: cars});
    			            break;
    			        default:
    			            render({
    			                cars: cars,
    			                obj:obj
    			            });
    			        }
    				}
    			
    	);
    	
    });
    
});

/**
 * About Us
 */
action('about', function () {
	this.title = 'Automarket';
	render({  
	      title: "About Us"  
	});
});

/**
 * Go to login Page
 */
action('goLogin', function () {
	render({  
	      title: "LOGIN PAGE"  
	});
});

/**
 * LOGIN ACTION
 * TODO- Hardcode username and password
 */
action('login', function signin() {
    if ( req.body.username == "nam" && req.body.password =="nam" ) {
    	var user = {};
    	user.name = req.body.username;
    	req.session.user = user;
    	redirect('/');
    } else {
        flash('error', 'error');
        redirect('/');
    }
 
});

/**
 * View car details
 */
action('carDetails', function carDetails() {
	Car.find( req.query.carId , function( err, car ){
		if( err ) console.log(err); //when problem
		console.log("################");
			console.log(car);
		CarPic.all( { where: { carId : car.carId } } , function( error , pics ){
			if( error ) console.log( error );
			console.log( pics );
			render({
				  title: "View Details of" + car.name ,
			      car: { car : car , pics : pics }  
			});
		});
	});
});

///**  
// *   
// * show upload form  
// */  
//action('upload_form', function () {   
// render({  
//  title: "upload_controller#upload_form"  
// });  
//});  
//
///**  
// *   
// * save uploaded file, error handling
// */  
//action('upload_file', function () {   
//
//  var fs = require('fs');  
//
//  this.file_name = req.body.file_name;  
//  this.uploaded_file_tmp = req.files.file.path;  
//  this.uploaded_file_type = req.files.file.type;  
//  this.uploaded_file_name = req.files.file.name;  
//  var new_file = "/home/yourhomedir/compound_test/uploaded_files/"+this.uploaded_file_name;  
//
//  fs.rename( this.uploaded_file_tmp, new_file, function(err){  
//   if(err) console.log(err);  
//    console.log("moved");  
//  });  
//
//  console.log(this.uploaded_file_type);  
//    render({  
//      title: "upload_controller#upload_file"  
//  });  
//});  