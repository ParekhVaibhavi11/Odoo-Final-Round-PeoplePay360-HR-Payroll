// Placeholder file upload middleware wrapper
// Can be extended with multer if file attachments are uploaded
const dummyUpload = (req, res, next) => {
  next();
};

module.exports = {
  uploadSingle: () => dummyUpload,
};
