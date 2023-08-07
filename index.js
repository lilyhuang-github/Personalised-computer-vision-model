
const fs = require('fs');
const path = require('path');

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
    console.log(x);
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
console.log(data);
const HTTP_PORT = process.env.PORT || 3000;
const express = require("express");
const exphbs = require("express-handlebars");
// const path = require("path");
//establish a path
const app = express();
const router = express.Router();
// router.use(express.static(path.join(__dirname, '/PetImages')));
for (x of folderPaths){
    router.use(express.static(path.join(__dirname, `\\${x}`)));
    // console.log(path);
}

app.engine(".hbs", exphbs.engine({	//establish an association between the express app and handlebar 
	extname: ".hbs",	//look for .hbs ext
	defaultLayout: false,	//dont look for default template/layout
	layoutsDir: path.join(__dirname, "/views") //go to the subdirectory and look for templates
}));
app.set('view engine', '.hbs');

app.get("/", (req,res)=>{
    res.render('index', {
        images:images
    })
});
app.listen(HTTP_PORT, function(){
	console.log(`Listening on port ${HTTP_PORT}`);
});


