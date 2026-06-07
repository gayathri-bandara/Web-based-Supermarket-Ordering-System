const router = require("express").Router();
const Category = require("../models/Category");

router.post("/", async (req, res) => {
  const data = new Category(req.body);
  await data.save();
  res.json(data);
});

router.get("/", async (req, res) => {
  const data = await Category.find();
  res.json(data);
});

router.put("/:id", async (req, res) => {
  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json("Category not found");
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json("Deleted");
});

module.exports = router;
