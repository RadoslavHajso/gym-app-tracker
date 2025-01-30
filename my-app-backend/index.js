const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config(); // .env
const pool = require("./config/db"); // Importujeme konfiguráciu DB

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Test pre pripojenie k DB
app.get("/", (req, res) => {
    res.send("Hello, world! Server is running.");
});

// Príklad query na testovanie pripojenia k DB
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.send(result.rows[0]);
    } catch (error) {
        res.status(500).send("Error connecting to the database");
    }
});

app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
