const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: Date,
    venue: String,
    city: { type: String, default: "Sydney" },
    description: String,
    category: String,
    image: String,

    source: String,
    sourceUrl: { type: String, unique: true },

    status: {
      type: String,
      enum: ["new", "updated", "inactive", "imported"],
      default: "new"
    },

    lastScrapedAt: { type: Date, default: Date.now },

    // ✅ ADD THESE
    leads: [
      {
        email: String,
        consent: Boolean,
        createdAt: Date
      }
    ],

    importedAt: Date,
    importedBy: String,
    importNotes: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
