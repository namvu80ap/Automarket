
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
 
  this.file_name = req.body.file_name;  
  this.uploaded_file_tmp = req.files.file.path;
  this.uploaded_file_type = req.files.file.type;
  this.uploaded_file_name = req.files.file.name;
  //var new_file = "./public/"+this.uploaded_file_name;
  
  // Server-side applications use both the API key and secret.
  var client = new Dropbox.Client({
	  key: 'gzzlxacfelfpf0u',
	  secret: 'ssx3n6x2ubqjs5w',
	  token: 'XUKR5BpjukcAAAAAAAAAAUd9UC1GrtkghGP1Bms32BwsqRImsemIzMt4EZszuZNS',
	  uid: '181841728' 
  });
  
  var server = new Dropbox.AuthDriver.NodeServer(8191)
  client.authDriver( server );
  
  client.authenticate( false ,function(error, clientA) {
  	  if (error) {
  	   console.log(error);
  	  }
  	  
  	  //console.log("===============");
  	  //console.log(clientA.credentials());
  	  //console.log("===============");
  	    client.mkdir( id , function( dirErr, dirStat ) {
  	    	if( dirErr ) console.log(dirErr);
  	    	
		    fs.readFile( req.files.file.path , function read( err, data ){
		    	if( err )console.log( err );
		    	
		    	//Write fiel
			    client.writeFile( id +"/"+req.files.file.name , data , function(error, stat) {
			    	
			    	if(error) console.log(error);
					
					//console.log(stat);
					
					client.makeUrl( id +"/"+ req.files.file.name  , { downloadHack:true }, function( err, url ){
				    	if(err) console.log(err);
				    	
				    	var carPic = {};
				    	carPic.carId = id;
				    	carPic.name = req.files.file.name;
				    	carPic.url = url.url;
				    	CarPic.create( carPic , function (err, carPic) {
				    		if(err) console.log( err );
				    		console.log( carPic )
				    	});
				    	
//				    	Car.find(id, function( err, car ){
//				    		console.log(car);
//				    		car.pics.push( url.url);
//				    		car.updateAttributes( { pics : car.pics } , function(err){ if(err) console.log(err); } );
//				    	})
				    	
				    } );
					
					});
		    });
  	    });
  	});
  
  server.closeServer();
	
//	
//	  fs.rename( this.uploaded_file_tmp, new_file, function(err){  
//	   if(err) console.log(err);  
//	    console.log("moved");  
//	  });  

  console.log(this.uploaded_file_type);  
  redirect("upload/upload_pic?id=528b729be1ef5c4306000001");  
});   