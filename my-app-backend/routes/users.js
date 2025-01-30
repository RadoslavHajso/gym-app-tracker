const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db"); // Import pripojenia k DB
const auth = require("../middleware/auth"); // Importujeme auth middleware
const router = express.Router();

// 🟢 POST /register – Registrácia užívateľa
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email and password are required" });
        }

        const existingUser = await pool.query('SELECT * FROM "user" WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO "user" (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: "User created successfully", user: result.rows[0] });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 🟢 POST /login – Prihlásenie užívateľa
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const result = await pool.query('SELECT * FROM "user" WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 🟢 GET /me – Získanie údajov o prihlásenom používateľovi
router.get("/me", auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query('SELECT id, name, email FROM "user" WHERE id = $1', [userId]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 🟢 PATCH /api/users/update – Úprava profilu používateľa
router.patch("/update", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, bio, weight, pr_bench, pr_squat, pr_deadlift } = req.body;

        const user = await pool.query('SELECT * FROM "user" WHERE id = $1', [userId]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const updatedUser = await pool.query(
            `UPDATE "user" 
             SET name = COALESCE($1, name),
                 bio = COALESCE($2, bio),
                 weight = COALESCE($3, weight),
                 pr_bench = COALESCE($4, pr_bench),
                 pr_squat = COALESCE($5, pr_squat),
                 pr_deadlift = COALESCE($6, pr_deadlift)
             WHERE id = $7 RETURNING id, name, email, bio, weight, pr_bench, pr_squat, pr_deadlift`,
            [name, bio, weight, pr_bench, pr_squat, pr_deadlift, userId]
        );

        res.json({ message: "Profile updated successfully", user: updatedUser.rows[0] });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 🟢 POST /api/users/logout – Odhlásenie (klient zahodí token)
router.post("/logout", auth, (req, res) => {
    res.json({ message: "Logout successful" });
});

module.exports = router;
