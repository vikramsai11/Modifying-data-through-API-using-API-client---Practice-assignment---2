require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log(" MongoDB Connected"))
  .catch(err => console.error(" MongoDB Connection Error:", err));

//  Add a test route for "/"
app.get("/", (req, res) => {
    res.send(" Server is running! Welcome to the menu API.");
});

//  Define MenuItem Schema & Model
const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true }
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

//  CRUD Routes
app.get("/menu", async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.json(menuItems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE a menu item
app.post("/menu", async (req, res) => {
    const { name, description, price } = req.body;
    if (!name || price == null) {
        return res.status(400).json({ message: "Name and price are required" });
    }

    const newItem = new MenuItem({ name, description, price });
    try {
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//  UPDATE a menu item
app.put("/menu/:id", async (req, res) => {
    try {
        const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) return res.status(404).json({ message: "Item not found" });
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//  DELETE a menu item
app.delete("/menu/:id", async (req, res) => {
    try {
        const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: "Item not found" });
        res.json({ message: "Item deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//  Start the Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));