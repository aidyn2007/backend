const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

const ItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const Item = mongoose.model("Item", ItemSchema);

app.get("/", (req, res) => {
  res.json({ message: "Backend is working" });
});

app.get("/version", (req, res) => {
  res.json({
    version: "1.1",
    updatedAt: "2026-01-28"
  });
});

app.get("/api/items", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.get("/api/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    res.json(item);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

app.post("/api/items", async (req, res) => {
  const newItem = new Item(req.body);
  const savedItem = await newItem.save();
  res.json(savedItem);
});

app.put("/api/items/:id", async (req, res) => {
  const updated = await Item.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

app.delete("/api/items/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: "Item deleted" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});