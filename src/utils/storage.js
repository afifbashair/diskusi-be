const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({
  keyFilename: path.join(__dirname, '../../your-service-account.json'), // sesuaikan path service account
});

const bucketName = process.env.CLOUD_STORAGE_BUCKET;
const bucket = storage.bucket(bucketName);

async function uploadFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);

    const gcsFileName = Date.now() + '_' + file.originalname;
    const fileUpload = bucket.file(gcsFileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.on('error', (err) => reject(err));

    stream.on('finish', async () => {
      await fileUpload.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;
      resolve(publicUrl);
    });

    stream.end(file.buffer);
  });
}

module.exports = { uploadFile };
