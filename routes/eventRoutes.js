const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const authMiddleware = require("../middleware/authMiddleware");

/*
--------------------------------------------------
GET ALL EVENTS
--------------------------------------------------
*/
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events" });
  }
});

/*
--------------------------------------------------
GET SINGLE EVENT
--------------------------------------------------
*/
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Error fetching event" });
  }
});

/*
--------------------------------------------------
SAVE LEAD (GET TICKETS FLOW)
--------------------------------------------------
*/
router.post("/:id/lead", async (req, res) => {
  try {
    const { email, consent } = req.body;

    if (!email || !consent) {
      return res.status(400).json({ message: "Email and consent required" });
    }

    const event = await Event.findById(req.params.id);

    event.leads.push({
      email,
      consent,
      createdAt: new Date()
    });

    await event.save();

    res.json({
      message: "Lead saved successfully",
      lead: { email }
    });
  } catch (err) {
    res.status(500).json({ message: "Error saving lead" });
  }
});

/*
--------------------------------------------------
IMPORT EVENT (PROTECTED - ADMIN)
--------------------------------------------------
*/
router.post("/:id/import", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    event.status = "imported";
    event.importedAt = new Date();
    event.importedBy = req.user.email;

    await event.save();

    res.json({
      message: "Event imported successfully",
      event
    });
  } catch (err) {
    res.status(500).json({ message: "Error importing event" });
  }
});

module.exports = router;
