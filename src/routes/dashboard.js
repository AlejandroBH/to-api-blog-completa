// routes/dashboard.js
const express = require("express");
const { getStats } = require("../controllers/dashboardController");

const router = express.Router();

// GET /api/dashboard/stats
router.get("/stats", getStats);

module.exports = router;
