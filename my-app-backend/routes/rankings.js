const express = require("express");
const pool = require("../config/db");
const router = express.Router();

router.get("/bench", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, name, profile_pic, weight, pr_bench
            FROM "user"
            WHERE pr_bench IS NOT NULL
            ORDER BY pr_bench DESC
            LIMIT 10
        `);
        res.json({ rankings: result.rows });
    } catch (error) {
        console.error("Error fetching bench rankings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//  Top 10 rebríček podľa PR deadliftu
router.get("/deadlift", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, name, profile_pic, weight, pr_deadlift
            FROM "user"
            WHERE pr_deadlift IS NOT NULL
            ORDER BY pr_deadlift DESC
            LIMIT 10
        `);
        res.json({ rankings: result.rows });
    } catch (error) {
        console.error("Error fetching deadlift rankings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Top 10 rebríček podľa PR squatu
router.get("/squat", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, name, profile_pic, weight, pr_squat
            FROM "user"
            WHERE pr_squat IS NOT NULL
            ORDER BY pr_squat DESC
            LIMIT 10
        `);
        res.json({ rankings: result.rows });
    } catch (error) {
        console.error("Error fetching squat rankings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Top 10 rebríček podľa pomeru PR bench/weight
router.get("/bench-weight-difference", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, name, profile_pic, weight, pr_bench, (pr_bench::float - weight::float) AS bench_weight_difference
            FROM "user"
            WHERE pr_bench IS NOT NULL AND weight IS NOT NULL
            ORDER BY bench_weight_difference DESC
            LIMIT 10
        `);
        res.json({ rankings: result.rows });
    } catch (error) {
        console.error("Error fetching bench-weight difference rankings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Top 10 rebríček podľa pomeru PR deadlift/weight
router.get("/deadlift-weight-difference", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, name, profile_pic, weight, pr_deadlift, 
                   (pr_deadlift::float - weight::float) AS deadlift_weight_difference
            FROM "user"
            WHERE pr_deadlift IS NOT NULL AND weight IS NOT NULL
            ORDER BY deadlift_weight_difference DESC
            LIMIT 10
        `);
        res.json({ rankings: result.rows });
    } catch (error) {
        console.error("Error fetching deadlift-weight difference rankings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});;

// Top 10 rebríček podľa pomeru PR squat/weight
router.get("/squat-weight-difference", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, name, profile_pic, weight, pr_squat, 
                   (pr_squat::float - weight::float) AS squat_weight_difference
            FROM "user"
            WHERE pr_squat IS NOT NULL AND weight IS NOT NULL
            ORDER BY squat_weight_difference DESC
            LIMIT 10
        `);
        res.json({ rankings: result.rows });
    } catch (error) {
        console.error("Error fetching squat-weight difference rankings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;
