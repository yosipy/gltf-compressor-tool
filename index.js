console.log("########## start ##########");

const fs = require("fs");
const input_dir = "./input";

fs.readdir(input_dir, (err, fileNames) => {
  console.log(fileNames);
  if (err) throw err;
  const glbFileNames = fileNames.filter((fileName) => {
    return (
      fs.statSync(`${input_dir}/${fileName}`).isFile() &&
      /.*\.glb$/.test(fileName)
    );
  });
  console.log(glbFileNames);
});

console.log("########## end ##########");
