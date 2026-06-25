require("dotenv").config();

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./config/db");

dotenv.config();

const app = express();
const adminRoutes = require("./routes/adminRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Store Rating API Running...");
});

db.getConnection()
  .then((connection) => {
    console.log("✅ MySQL Connected Successfully");
    connection.release();

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed:", err.message);
  });