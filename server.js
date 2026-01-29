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
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Item = mongoose.model("Item", ItemSchema);


app.get("/", (req, res) => {
  res.json({ message: "Backend is working" });
});

app.get("/version", (req, res) => {
  res.json({
    version: "1.2",
    updatedAt: "2026-01-28",
  });
});

app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json(item);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

app.post("/api/items", async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const newItem = new Item({ name, price });
    const savedItem = await newItem.save();

    res.status(201).json(savedItem);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/items/:id", async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      { name, price },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json(updated);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

app.patch("/api/items/:id", async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json(updated);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

app.delete("/api/items/:id", async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(204).send();
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});