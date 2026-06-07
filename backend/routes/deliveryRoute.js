const router = require("express").Router();
const Delivery = require("../models/Delivery");

router.post("/", async (req, res) => {
  const data = new Delivery(req.body);
  await data.save();
  res.json(data);
});

router.get("/", async (req, res) => {
  const filter = req.query.orderId ? { orderId: req.query.orderId } : {};
  const data = await Delivery.find(filter).sort({ createdAt: -1 });
  res.json(data);
});

router.put("/:id", async (req, res) => {
  const updated = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json("Delivery not found");
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await Delivery.findByIdAndDelete(req.params.id);
  res.json("Deleted");
});

module.exports = router;
