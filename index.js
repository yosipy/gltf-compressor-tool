const fs = require("fs-extra");
const inputDir = "./input";
const outputDir = "./output";
const workDir = "./work";

const gltfPipeline = require("gltf-pipeline");
const fsExtra = require("fs-extra");

function rmdir(dir) {
  return new Promise((resolve) => {
    fs.remove(dir, (err) => {
      resolve(err);
    });
  });
}

function mkdir(dir) {
  return new Promise((resolve) => {
    fs.mkdir(dir, (err) => {
      resolve(err);
    });
  });
}

const glbToGltf = async (inputDir, outputDir, fileName) => {
  const glb = fsExtra.readFileSync(`${inputDir}/${fileName}`);
  const results = await gltfPipeline.glbToGltf(glb);
  await fsExtra.writeJsonSync(
    `${outputDir}/${fileName.replace(".glb", ".gltf")}`,
    results.gltf
  );
};

const gltfToSeparateGltf = async (inputDir, outputDir, fileName) => {
  const processGltf = gltfPipeline.processGltf;
  const gltf = fsExtra.readJsonSync(`${inputDir}/${fileName}`);
  const options = {
    separateTextures: true,
  };
  const results = await processGltf(gltf, options);
  await fsExtra.writeJsonSync(`${outputDir}/${fileName}`, results.gltf);
  // Save separate resources
  const separateResources = results.separateResources;
  for (const relativePath in separateResources) {
    if (separateResources.hasOwnProperty(relativePath)) {
      const resource = separateResources[relativePath];
      await fsExtra.writeFileSync(`${outputDir}/${relativePath}`, resource);
    }
  }
};

const main = async () => {
  console.log("########## start ##########");

  const fileNames = await fs.readdir(inputDir);
  console.log(fileNames);

  const glbFileNames = fileNames.filter((fileName) => {
    return (
      fs.statSync(`${inputDir}/${fileName}`).isFile() &&
      /.*\.glb$/.test(fileName)
    );
  });
  glbFileNames.forEach(async (glbFileName) => {
    await rmdir(workDir);
    await mkdir(workDir);
    await glbToGltf(inputDir, workDir, glbFileName);
    await gltfToSeparateGltf(
      workDir,
      workDir,
      glbFileName.replace(".glb", ".gltf")
    );
  });
  console.log(glbFileNames);
  console.log("########## end ##########");
};

main();
