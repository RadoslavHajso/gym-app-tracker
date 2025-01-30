const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config(); // .env

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

//test for starting server
app.get("/", (req, res) => {
    res.send("Hello, world! Server is running.");
});

app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
