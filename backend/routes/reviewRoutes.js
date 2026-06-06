const router = require("express").Router();
const Review = require("../models/Review");

router.post("/", async(req,res)=>{
  const data = new Review(req.body);
  await data.save();
  res.json(data);
});

router.get("/", async(req,res)=>{
  const data = await Review.find();
  res.json(data);
});

module.exports = router;