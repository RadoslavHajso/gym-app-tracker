// index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config(); // Načítanie .env súboru
const pool = require("./config/db"); // Import pripojenia k DB
const usersRouter = require("./routes/users"); // Importovanie rout pre užívateľov
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Test pripojenia k serveru
app.get("/", (req, res) => {
    res.send("Hello, world! Server is running.");
});

// Test pripojenia k DB
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.send(result.rows[0]);
    } catch (error) {
        res.status(500).send("Error connecting to the database");
    }
});

// Použitie rout pre užívateľov (registrácia, prihlásenie)
app.use("/api/users", usersRouter);

// Spustenie serveru
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
