const router = require("express").Router();
const Payment = require("../models/Payment");

router.post("/", async(req,res)=>{
  const pay = new Payment(req.body);
  await pay.save();
  res.json(pay);
});

router.get("/", async(req,res)=>{
  const data = await Payment.find();
  res.json(data);
});

module.exports = router;