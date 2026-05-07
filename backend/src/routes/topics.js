const express = require("express");
const Topic = require("../models/Topic");
const Progress = require("../models/Progress");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const [topics, progress] = await Promise.all([
      Topic.find().sort({ order: 1, createdAt: 1 }).lean(),
      Progress.find({ userId: req.user._id }).select("problemId -_id").lean(),
    ]);

    const completedProblemIds = progress.map((p) => p.problemId);

    const safeTopics = topics.map((t) => ({
      id: t.topicId,
      title: t.title,
      description: t.description,
      problems: t.problems.map((p) => ({
        id: p.problemId,
        title: p.title,
        difficulty: p.difficulty,
        youtubeLink: p.youtubeLink,
        practiceLink: p.practiceLink,
        articleLink: p.articleLink,
      })),
    }));

    return res.json({ topics: safeTopics, completedProblemIds });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to load topics." });
  }
});

module.exports = router;
