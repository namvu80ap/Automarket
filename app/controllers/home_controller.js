action('about', function () {
	this.title = 'Automarket';
	render({  
	      title: "About Us"  
	});
});
action('index', function () {
	this.title = 'Automarket';
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

/**  
 *   
 * show upload form  
 */  
action('upload_form', function () {   
 render({  
  title: "upload_controller#upload_form"  
 });  
});  

/**  
 *   
 * save uploaded file, error handling
 */  
action('upload_file', function () {   

  var fs = require('fs');  

  this.file_name = req.body.file_name;  
  this.uploaded_file_tmp = req.files.file.path;  
  this.uploaded_file_type = req.files.file.type;  
  this.uploaded_file_name = req.files.file.name;  
  var new_file = "/home/yourhomedir/compound_test/uploaded_files/"+this.uploaded_file_name;  

  fs.rename( this.uploaded_file_tmp, new_file, function(err){  
   if(err) console.log(err);  
    console.log("moved");  
  });  

  console.log(this.uploaded_file_type);  
    render({  
      title: "upload_controller#upload_file"  
  });  
});  