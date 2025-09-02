import multer from "multer";
import CustomErrorHandler from "../utils/errorHandler.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "./uploads/";

    if (file.fieldname === "avatar") {
      uploadPath = "./uploads/avatars/";
    } else if (file.fieldname === "postImage") {
      uploadPath = "./uploads/posts/";
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new CustomErrorHandler(400, "Only image files are allowed!"), false);
  }
};

const fileUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default fileUpload;
