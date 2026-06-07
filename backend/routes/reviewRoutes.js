const router = require("express").Router();
const Review = require("../models/Review");

router.post("/", async (req, res) => {
  const data = new Review(req.body);
  await data.save();
  res.json(data);
});

router.get("/", async (req, res) => {
  const filter = req.query.productId ? { productId: req.query.productId } : {};
  const data = await Review.find(filter).sort({ createdAt: -1 });
  res.json(data);
});

router.put("/:id", async (req, res) => {
  const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json("Review not found");
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json("Deleted");
});

module.exports = router;
