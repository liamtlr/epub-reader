const ePub = require("epub");
const fs = require('fs');

SOURCE_FOLDER = "./static/epubs/"

TARGET_FOLDER = "./"

METADATA_FIELDS = ["title", "contributors"]

const EPubReader = function(sourceFolder, targetFolder){
  this.sourceFolder = sourceFolder || SOURCE_FOLDER;
  this.targetFolder = targetFolder || TARGET_FOLDER
  this.jsonFields = ["title", "contributors"];
};

EPubReader.prototype.readFolder = function(){
  const self = this;
  fs.readdir(this.sourceFolder, function(err, list){
    const books = [];
    for(var i=0;i<list.length;i++){
      const book = list[i]
      const bookPath = SOURCE_FOLDER + book;
      const fileName = book.split(".").shift()
      self.makeDirectory(book)
      const metaData = self.getMetaData(bookPath,fileName)
    };
  });
};

EPubReader.prototype.getMetaData = function(path, fileName){
  const self = this;
  const epub = new ePub(path)
  epub.on("end", () => {
    const metaData = epub.metadata
    const json = self.createJson(metaData)
    self.addJsonToDir(json, fileName)
  });
  epub.parse();
};

EPubReader.prototype.makeDirectory = function(name){
  const self = this;
  const dir = self.targetFolder + name.split(".").shift()
  if(!fs.existsSync(dir)){
    fs.mkdir(dir, () => {
      console.log("Created directory at '" + dir + "'" )
    });
  };
};

EPubReader.prototype.createJson = function(data){
  const self = this;
  obj = {}
  for(var i=0;i<self.jsonFields.length;i++){
    const field = self.jsonFields[i]
    if(data[field]){
      obj[field] = data[field]
    } else {
      obj[field] = "Not present";
    };
  };
  return JSON.stringify(obj)
};


EPubReader.prototype.addJsonToDir = function(json, title){
  const fileName = title + ".json"
  const dir = TARGET_FOLDER
  const fileAtPath = dir + title + "/"+ fileName
  if(fs.existsSync(fileAtPath)){
    console.log("File '" + fileName +"' already exists at '"+ fileAtPath +"'")
  } else {
    const jsonFile = fs.writeFile(fileAtPath, json, (err) =>{
      if(err){
        console.log(err)
      } else {
        console.log("JSON file created at" + fileAtPath)
      };
    });
  };
};

exports.EPubReader = EPubReader;
