import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  email: { type: String, required: true },
  message: { type: String, required: true },
});

export const Story = mongoose.model("Story", storySchema);
