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

        // Validácia, či sú všetky údaje zadané
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email and password are required" });
        }

        // Skontroluj, či už email neexistuje v databáze
        const existingUser = await pool.query('SELECT * FROM "user" WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // Hashovanie hesla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Uloženie nového používateľa do databázy
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

        // Skontroluj, či používateľ existuje
        const result = await pool.query('SELECT * FROM "user" WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const user = result.rows[0];
        // Porovnanie zadaného hesla s hashovaným heslom
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Generovanie JWT tokenu
        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            process.env.JWT_SECRET, // Tajný kľúč, ktorý nastavíš v .env
            { expiresIn: "365d" } // Token platí 7 dní
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

// 🟢 PUT /users/:id – Aktualizácia používateľského profilu
router.put("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, profile_pic, bio, weight, pr_bench, pr_squat, pr_deadlift } = req.body;

        if (req.user.id !== parseInt(id)) {
            return res.status(403).json({ error: "You are not authorized to update this user" });
        }

        const result = await pool.query(
            `UPDATE "user" 
             SET name = COALESCE($1, name), email = COALESCE($2, email), profile_pic = COALESCE($3, profile_pic), 
             bio = COALESCE($4, bio), weight = COALESCE($5, weight), pr_bench = COALESCE($6, pr_bench), 
             pr_squat = COALESCE($7, pr_squat), pr_deadlift = COALESCE($8, pr_deadlift)
             WHERE id = $9 RETURNING *`,
            [name, email, profile_pic, bio, weight, pr_bench, pr_squat, pr_deadlift, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User profile updated successfully", user: result.rows[0] });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 🟢 POST /api/users/logout – Odhlásenie (klient zahodí token)
router.post("/logout", auth, (req, res) => {
    res.json({ message: "Logout successful" });
});

// 🟢 DELETE /users/:id – Vymazanie používateľa
router.delete("/:id", auth, async (req, res) => {
    try {
        const userId = req.params.id;

        // Skontrolujeme, či sa používateľ pokúša vymazať svoj účet
        if (req.user.id !== parseInt(userId)) {
            return res.status(403).json({ error: "You are not authorized to delete this user" });
        }

        // Vymazanie používateľa z databázy
        await pool.query('DELETE FROM "user" WHERE id = $1', [userId]);

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
