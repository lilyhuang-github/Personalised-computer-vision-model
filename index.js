const sharp = require('sharp');
const multer  = require('multer');
const axios = require("axios");
const fs = require('fs');
const path = require('path');
// require('dotenv').config();
// const apiKey = process.env.APIKEY

// console.log(apiKey);
/* TES T TEST*/
// $(function() {
// 	//values pulled from query string
// 	$('#model').val("ganggang");
// 	$('#version').val("1");
// 	$('#api_key').val("");

// 	setupButtonListeners();
// });

// var infer = function() {
// 	$('#output').html("Inferring...");
// 	$("#resultContainer").show();
// 	$('html').scrollTop(100000);

// 	getSettingsFromForm(function(settings) {
// 		settings.error = function(xhr) {
// 			$('#output').html("").append([
// 				"Error loading response.",
// 				"",
// 				"Check your API key, model, version,",
// 				"and other parameters",
// 				"then try again."
// 			].join("\n"));
// 		};

// 		$.ajax(settings).then(function(response) {
// 			var pretty = $('<pre>');
// 			var formatted = JSON.stringify(response, null, 4)

// 			pretty.html(formatted);
// 			$('#output').html("").append(pretty);
// 			$('html').scrollTop(100000);
// 		});
// 	});
// };

// var retrieveDefaultValuesFromLocalStorage = function() {
// 	try {
// 		var api_key = localStorage.getItem("rf.api_key");
// 		var model = localStorage.getItem("rf.model");
// 		var format = localStorage.getItem("rf.format");

// 		if (api_key) $('#api_key').val(api_key);
// 		if (model) $('#model').val(model);
// 		if (format) $('#format').val(format);
// 	} catch (e) {
// 		// localStorage disabled
// 	}

// 	$('#model').change(function() {
// 		localStorage.setItem('rf.model', $(this).val());
// 	});

// 	$('#api_key').change(function() {
// 		localStorage.setItem('rf.api_key', $(this).val());
// 	});

// 	$('#format').change(function() {
// 		localStorage.setItem('rf.format', $(this).val());
// 	});
// };

// var setupButtonListeners = function() {
// 	// run inference when the form is submitted
// 	$('#inputForm').submit(function() {
// 		infer();
// 		return false;
// 	});

// 	// make the buttons blue when clicked
// 	// and show the proper "Select file" or "Enter url" state
// 	$('.bttn').click(function() {
// 		$(this).parent().find('.bttn').removeClass('active');
// 		$(this).addClass('active');

// 		if($('#computerButton').hasClass('active')) {
// 			$('#fileSelectionContainer').show();
// 			$('#urlContainer').hide();
// 		} else {
// 			$('#fileSelectionContainer').hide();
// 			$('#urlContainer').show();
// 		}

// 		if($('#jsonButton').hasClass('active')) {
// 			$('#imageOptions').hide();
// 		} else {
// 			$('#imageOptions').show();
// 		}

// 		return false;
// 	});

// 	// wire styled button to hidden file input
// 	$('#fileMock').click(function() {
// 		$('#file').click();
// 	});

// 	// grab the filename when a file is selected
// 	$("#file").change(function() {
// 		var path = $(this).val().replace(/\\/g, "/");
// 		var parts = path.split("/");
// 		var filename = parts.pop();
// 		$('#fileName').val(filename);
// 	});
// };

// var getSettingsFromForm = function(cb) {
// 	var settings = {
// 		method: "POST",
// 	};

// 	var parts = [
// 		"https://classify.roboflow.com/",
// 		$('#model').val(),
// 		"/",
// 		$('#version').val(),
// 		"?api_key=" + $('#api_key').val()
// 	];

// 	var method = $('#method .active').attr('data-value');
// 	if(method == "upload") {
// 		var file = $('#file').get(0).files && $('#file').get(0).files.item(0);
// 		if(!file) return alert("Please select a file.");

// 		getBase64fromFile(file).then(function(base64image) {
// 			settings.url = parts.join("");
// 			settings.data = base64image;

// 			console.log(settings);
// 			cb(settings);
// 		});
// 	} else {
// 		var url = $('#url').val();
// 		if(!url) return alert("Please enter an image URL");

// 		parts.push("&image=" + encodeURIComponent(url));

// 		settings.url = parts.join("");
// 		console.log(settings);
// 		cb(settings);
// 	}
// };

// var getBase64fromFile = function(file) {
// 	return new Promise(function(resolve, reject) {
// 		var reader = new FileReader();
// 		reader.readAsDataURL(file);
// 		reader.onload = function() {
// 		resizeImage(reader.result).then(function(resizedImage){
// 			resolve(resizedImage);
// 		});
//     };
// 		reader.onerror = function(error) {
// 			reject(error);
// 		};
// 	});
// };

// var resizeImage = function(base64Str) {
// 	return new Promise(function(resolve, reject) {
// 		var img = new Image();
// 		img.src = base64Str;
// 		img.onload = function(){
// 			var canvas = document.createElement("canvas");
// 			var MAX_WIDTH = 1500;
// 			var MAX_HEIGHT = 1500;
// 			var width = img.width;
// 			var height = img.height;
// 			if (width > height) {
// 				if (width > MAX_WIDTH) {
// 					height *= MAX_WIDTH / width;
// 					width = MAX_WIDTH;
// 				}
// 			} else {
// 				if (height > MAX_HEIGHT) {
// 					width *= MAX_HEIGHT / height;
// 					height = MAX_HEIGHT;
// 				}
// 			}
// 			canvas.width = width;
// 			canvas.height = height;
// 			var ctx = canvas.getContext('2d');
// 			ctx.drawImage(img, 0, 0, width, height);
// 			resolve(canvas.toDataURL('image/jpeg', 1.0));  
// 		};
// 	});	
// };

/* TETST */


function getFolderPaths(dir) {
  const folderPaths = [];
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      folderPaths.push(filePath);
      // Recursively get folder paths inside subfolders
      folderPaths.push(...getFolderPaths(filePath));
    }
  });

  return folderPaths;
};  

function getImagesInFolders(folderPaths) {
    const imagePathsByFolder = {};
  
    folderPaths.forEach((folderPath) => {
      const files = fs.readdirSync(folderPath);
      const imagePaths = [];
  
      files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        const stat = fs.statSync(filePath);
  
        if (stat.isFile() && isImageFile(filePath)) {
          imagePaths.push(filePath);
        }
      });
  
      imagePathsByFolder[folderPath] = imagePaths;
    });
  
    return imagePathsByFolder;
  }
function isImageFile(filePath) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp']; // Add more image extensions if needed
    const ext = path.extname(filePath).toLowerCase();
    return imageExtensions.includes(ext);
}
function myFunction(key){
    var x = document.getElementById(key);
    // console.log(x);
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
}


const parentFolderPath = 'PetImages'; // Change this to your desired folder path
const folderPaths = getFolderPaths(parentFolderPath);

// console.log(folderPaths);
// let images;

const images = getImagesInFolders(folderPaths);
// for(x of folderPaths){
//     images += getImagesInFolders(x);
//     console.log(getImagesInFolders(x));
// }
// console.log(images);
// 
let data = {folderPaths,
    images};
// data += {images};
// data = JSON.stringify(data);
// console.log(JSON.stringify(data));
// console.log(data);
keys = data.images;
keys = Object.keys(keys);
for(x in keys){
  
  keys[x] = keys[x].split("\\")[1];
}

// console.log(keys);
data.keys = keys;
// console.log(data);
// data.images = keys;
for (x in keys){

}
for(x in data.images){
  let abc = data.images[x];
  let edf = [];
  // console.log(data.images[x]);
  // console.log("ADSAD");
  for(y of abc){
    splited = y.split("\\");
    file = splited[2];
    edf.push(file);
    // console.log(abc);
    // data.images = abc[2];
   
  }
  data.images[x]= edf;
  // let abc = x.split("\\");
  // console.log(abc);
  // data.images[x] = abc[2];
}
// console.log(data);
const image = fs.readFileSync("./Sasuke/20230806_195949.jpg", {
  encoding: "base64"
});
// function classify(img){
//   // const imaging = fs.readFileSync(img, {
//   //   encoding: "base64"
//   // });
//   axios({
//     method: "POST",
//     url: "https://classify.roboflow.com/ganggang/1",
//     params: {
//         api_key: ""
//     },
//     data: img,
//     headers: {
//         "Content-Type": "application/x-www-form-urlencoded"
//     }
//   })
//   .then(function(response) {
//     console.log(response.data);
//     return response.data;
   
//   })
//   .catch(function(error) {
//     console.log(error.message);
//     return error.message;
//   });
// }
function classify(img) {
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: "https://classify.roboflow.com/ganggang/1",
      params: {
        api_key: apiKey
      },
      data: img,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    .then(function(response) {
      console.log(response.data);
      resolve(response.data);
    })
    .catch(function(error) {
      console.log(error.message);
      reject(error.message);
    });
  });
}
// classify(image);
const HTTP_PORT = process.env.PORT || 3000;
const express = require("express");
const exphbs = require("express-handlebars");
// const path = require("path");


// const path = require("path");
//establish a path
const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(express.json());	//support json encoded bodies
app.use(express.urlencoded({extended: false}));	//support encoded bodies


// router.use(express.static(path.join(__dirname, '/PetImages')));
for (x of folderPaths){
    app.use(express.static(path.join(__dirname, `\\${x}`)));
    // console.log(x);
    // console.log(path);
}

app.engine(".hbs", exphbs.engine({	//establish an association between the express app and handlebar 
	extname: ".hbs",	//look for .hbs ext
	defaultLayout: false,	//dont look for default template/layout
	layoutsDir: path.join(__dirname, "/views") //go to the subdirectory and look for templates
}));
app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname, '/PetImages')));

app.use(express.static(path.join(__dirname, '/public')));
app.get("/", (req,res)=>{
    res.render('index', {
        images:images
    })
});
app.post("/", (req, res)=>{
  // console.log(req.body.imageRecognise);
//   const test = fs.readFileSync(req.body.imageRecognise, {
//     encoding: "base64"
//   });
//   console.log(test);
})

app.post('/upload', upload.single('fileToUpload'), async (req, res) => {
  sharp(req.file.path) 
    .resize(650, 650)   // resize to consistent
    .toBuffer(async (err, buffer) => {
      if (err) {
        return res.status(500).send('Error resizing image');
      }
  const image = buffer.toString('base64'); 
  // const image = fs.readFileSync(req.file.path, { encoding: 'base64' });
  
  let result = await classify(image);
  result = JSON.stringify(result);
  console.log(result);
  res.send(`File uploaded and sent for classification! \n Animal detected: }\n Response":${result}`);});

});
app.listen(HTTP_PORT, function(){
	console.log(`Listening on port ${HTTP_PORT}`);
});


// /