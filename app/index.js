const aws = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const cors = require('cors');
const path = require('path');
const uuid = require('uuid');

const app = express();

const upload = multer({ storage: multerS3({
  s3: new aws.S3(),
  bucket: process.env.S3_BUCKET_NAME,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata(req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key(req, file, cb) {
    cb(null, path.join('uploads', uuid.v4()));
  },
}) });

app.use(cors());

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    message: 'success',
    location: req.file.location,
  });
})

module.exports.app = app;
