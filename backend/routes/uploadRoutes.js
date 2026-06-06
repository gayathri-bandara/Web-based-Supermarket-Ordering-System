const router = require("express").Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req,file,cb)=>{
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/", upload.single("image"), (req,res)=>{
  res.json({ imageUrl: req.file.path });
});

module.exports = router;