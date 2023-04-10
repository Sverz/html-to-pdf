const minio = require("minio");
var aes256 = require("aes256");

var key = "1065473";

async function addToMinio(filename, bufferFile, req) {
  var minioData = JSON.parse(aes256.decrypt(key, req.body.minioEncrypted));

  const minioClient = new minio.Client({
    endPoint: minioData.endPoint,
    port: minioData.port,
    useSSL: false,
    accessKey: minioData.accessKey,
    secretKey: minioData.secretKey,
  });

  await minioClient.putObject(
    minioData.bucketName,
    `declarations/${filename}`,
    bufferFile,
    {
      "Content-Type": "application/pdf",
    }
  );

  console.log("File uploaded successfully!");
}
module.exports = {
  addToMinio,
};
