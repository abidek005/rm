const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ✅ Fake in-memory database (so POST, PUT can modify items)
let items = [
  { id: 1, name: "Item One" },
  { id: 2, name: "Item Two" },
  { id: 3, name: "Item Three" }
];

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "demi" && password === "test1234") {
    res.json({ token: "fake-jwt-token-123" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// ✅ GET /items
app.get("/items", (req, res) => {
  res.json(items);
});

// ✅ POST /items (Create)
app.post("/items", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const newItem = { id: Date.now(), name };
  items.push(newItem);
  res.status(201).json(newItem);
});

// ✅ PUT /items/:id (Update item)
app.put("/items/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const item = items.find((i) => i.id == id);

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  item.name = name;
  res.json({ message: "Item updated", item });
});

// ✅ DELETE /items/:id (Delete item)
app.delete("/items/:id", (req, res) => {
  const { id } = req.params;

  const index = items.findIndex((i) => i.id == id);
  if (index === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  // Remove item
  const deletedItem = items.splice(index, 1);
  res.json({ message: "Item deleted", deleted: deletedItem[0] });
});

// ✅ Handle undefined routes (404)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
// ✅ Server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));