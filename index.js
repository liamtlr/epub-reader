const ePub = require("epub");
const fs = require('fs');

SOURCE_FOLDER = "./static/epubs/"

TARGET_FOLDER = "./"

METADATA_FIELDS = ["title", "contributors"]

function readFolder(folderPath){
  fs.readdir(folderPath, function(err, list){
    const books = [];
    for(var i=0;i<list.length;i++){
      const book = list[i]
      const bookPath = SOURCE_FOLDER + book;
      const fileName = book.split(".").shift()
      makeDirectory(book)
      const metaData = getMetaData(bookPath,fileName)
    }
  })
};

function getMetaData(path, fileName){
  const epub = new ePub(path)
  epub.on("end", () => {
    const metaData = epub.metadata
    const json = createJson(metaData, METADATA_FIELDS)
    addJsonToDir(json, fileName)
  });
  epub.parse();
}

function makeDirectory(name){
  const dir = TARGET_FOLDER + name.split(".").shift()
  if(!fs.existsSync(dir)){
    fs.mkdir(dir, () => {
      console.log("Created directory at '" + dir + "'" )
    });
  }
};

function createJson(data, fields){
  obj = {}
  for(var i=0;i<fields.length;i++){
    const field = fields[i]
    if(data[field]){
      obj[field] = data[field]
    } else {
      obj[field] = "Not present";
    }
  }
  return JSON.stringify(obj)
}

function addJsonToDir(json, title){
  const fileName = title + ".json"
  const dir = TARGET_FOLDER
  const fileAtPath = dir + title + "/"+ fileName
  if(fs.existsSync(fileAtPath)){
    console.log("File '" + fileName +"' already exists at '"+ dir +"'")
  } else {
    const jsonFile = fs.writeFile(fileAtPath, json, (err) =>{
      if(err){
        console.log(err)
      } else {
        console.log("JSON file created at" + fileAtPath)
      }
    })
  }
}

readFolder(SOURCE_FOLDER)
