
var Dropbox = require("dropbox");
  
/**  
 *   
 * show upload form  
 */  
action('upload_form', function () {
	console.log(req.query.id);
	Car.find( req.query.id ,function (err, car){
		    render({
		    	title: "Upload Car Pic",
		    	data: car
		    });
 		}
 	);
});  

/**  
 *   
 * save uploaded file, error handling
 */  
action('upload_file', function () {   

  var fs = require('fs');  
  var id = req.body.carId;
  
  var picArr = [] ;
  Car.find( id, function( err, car ){
	  if( car.pics ){
		  picArr = car.pics;
	  }
  } );
  
  console.log( "================" );
  this.file_name = req.body.file_name;  
  this.uploaded_file_tmp = req.files.file.path;  
  this.uploaded_file_type = req.files.file.type;  
  this.uploaded_file_name = req.files.file.name;  
  var new_file = "./public/"+this.uploaded_file_name;
  
  console.log("fdsdfsfdsf");
  // Server-side applications use both the API key and secret.
  var client = new Dropbox.Client({
      key: "gzzlxacfelfpf0u",
      secret: "ssx3n6x2ubqjs5w"
  });
  console.log("fdsdfsfdsf!!!!!!!!!!");
  client.authDriver(new Dropbox.AuthDriver.NodeServer(8191));
  console.log("fdsdfsfdsf********");
  client.authenticate( false ,function(error, clientA) {
  	  if (error) {
  	    // Replace with a call to your own error-handling code.
  	    //
  	    // Don't forget to return from the callback, so you don't execute the code
  	    // that assumes everything went well.
  	   console.log(error);
  	  }
  	  
	  	console.log('connected...');
	    console.log('token ', clientA);       // THE_TOKEN
	    //console.log('secret', clientA); // THE_TOKEN_SECRET
	    fs.readFile( req.files.file.path , function read( err, data ){
	    	if( err )console.log( err );
	    	console.log(data);
		    client.writeFile("hello_world3.jpg", data , function(error, stat) {
		    	console.log("do copy");
		    	
		    	console.log(error);
				console.log("File saved as revision ");
				console.log(stat);
				
				client.makeUrl( "hello_world2.jpg", { downloadHack:true }, function( err, url ){
			    	if(err) console.log(err);
			    	console.log(url);
			    	picArr[picArr.length] = { url: url.url };
			    	Car.find(id, function( err, car ){
			    		//car.pics = picArr;
			    		car.updateAttributes( { pics : picArr } , function(err){ if(err) console.log(err); } );
			    	})
			    } );
				
				});
	    });
  	});
	
    
	
	
//	
//	  fs.rename( this.uploaded_file_tmp, new_file, function(err){  
//	   if(err) console.log(err);  
//	    console.log("moved");  
//	  });  

  console.log(this.uploaded_file_type);  
    render({  
      title: "upload_controller#upload_file"  
  });  
});   