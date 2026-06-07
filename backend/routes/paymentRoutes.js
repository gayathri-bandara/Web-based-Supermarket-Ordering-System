const router = require("express").Router();
const Payment = require("../models/Payment");

router.post("/", async (req, res) => {
  const payload = {
    ...req.body,
    invoiceNo: req.body.invoiceNo || `INV-${Date.now()}`,
  };
  const pay = new Payment(payload);
  await pay.save();
  res.json(pay);
});

router.get("/", async (req, res) => {
  const data = await Payment.find().sort({ createdAt: -1 });
  res.json(data);
});

router.get("/:id", async (req, res) => {
  const data = await Payment.findById(req.params.id);
  if (!data) return res.status(404).json("Payment not found");
  res.json(data);
});

router.put("/:id", async (req, res) => {
  const updated = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json("Payment not found");
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await Payment.findByIdAndDelete(req.params.id);
  res.json("Deleted");
});

module.exports = router;
