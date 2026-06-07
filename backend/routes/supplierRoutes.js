const router = require("express").Router();
const Supplier = require("../models/Supplier");

router.post("/", async (req, res) => {
  const data = new Supplier(req.body);
  await data.save();
  res.json(data);
});

router.get("/", async (req, res) => {
  const data = await Supplier.find();
  res.json(data);
});

router.put("/:id", async (req, res) => {
  const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json("Supplier not found");
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await Supplier.findByIdAndDelete(req.params.id);
  res.json("Deleted");
});

module.exports = router;
