const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    problemId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Tough"], required: true },
    youtubeLink: { type: String, required: true },
    practiceLink: { type: String, required: true },
    articleLink: { type: String, required: true },
  },
  { _id: false }
);

const topicSchema = new mongoose.Schema(
  {
    topicId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
    problems: { type: [problemSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Topic", topicSchema);
