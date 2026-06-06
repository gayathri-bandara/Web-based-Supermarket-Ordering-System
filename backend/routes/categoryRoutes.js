const router = require("express").Router();
const Category = require("../models/Category");

router.post("/", async(req,res)=>{
  const data = new Category(req.body);
  await data.save();
  res.json(data);
});

router.get("/", async(req,res)=>{
  const data = await Category.find();
  res.json(data);
});

module.exports = router;