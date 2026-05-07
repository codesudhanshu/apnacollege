const express = require("express");
const Topic = require("../models/Topic");
const Progress = require("../models/Progress");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

async function getValidProblemIds() {
  const topics = await Topic.find().select("problems.problemId -_id").lean();
  const set = new Set();
  topics.forEach((t) => t.problems.forEach((p) => set.add(p.problemId)));
  return set;
}

router.put("/", requireAuth, async (req, res) => {
  try {
    const problemId = String(req.body?.problemId || "");
    const completed = Boolean(req.body?.completed);

    const valid = await getValidProblemIds();
    if (!valid.has(problemId)) return res.status(404).json({ message: "Problem not found." });

    if (completed) {
      await Progress.updateOne(
        { userId: req.user._id, problemId },
        { $setOnInsert: { completedAt: new Date() } },
        { upsert: true }
      );
    } else {
      await Progress.deleteOne({ userId: req.user._id, problemId });
    }

    const list = await Progress.find({ userId: req.user._id }).select("problemId -_id").lean();
    return res.json({ completedProblemIds: list.map((p) => p.problemId) });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to update progress." });
  }
});

module.exports = router;
