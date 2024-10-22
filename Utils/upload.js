const multer = require("multer");
const fs = require("fs");
const path = require("path");

function upload(directory) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = `public/img/uploads/${directory}`;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  return multer({ storage: storage });
}

module.exports = upload;
