const express = require("express");
const { getActiveBanners, getCMSContent, getCMSContentBySlug, getSettings } = require("../controllers/cms.controller");

const router = express.Router();

// Public routes for Customer/Tailor portals
router.get("/settings", getSettings);
router.get("/banners/active", getActiveBanners);
router.get("/content", getCMSContent);
router.get("/content/:slug", getCMSContentBySlug);

module.exports = router;
