import express from "express";
import supabase from "../supabaseClient.js";

const setupLearningPlanRoute = (app) => {
  app.post("/learning-plan", async (req, res) => {
    try {
      const { studentId } = req.body;

      if (!studentId) {
        return res.status(400).json({ error: "Student ID is required" });
      }

      // Retrieve the student's profile from the 'students' table
      const { data: profile, error } = await supabase
        .from('students')
        .select()
        .eq('id', studentId)
        .single();

      if (error || !profile) {
        throw error || new Error('Student profile not found');
      }

      const learningPlan = generateLearningPlan(profile);

      res.status(200).json({ message: "Learning plan generated successfully", learningPlan });
    } catch (error) {
      console.error("Failed to generate learning plan:", error);
      res.status(500).json({ error: "Failed to generate learning plan" });
    }
  });
};

const generateLearningPlan = (profile) => {
  const { learningstyle, interests } = profile;

  // Generate a simple example of a personalized learning plan
  const learningPlan = {
    coreSubjects: {
      math: {
        resources: [
          { type: learningstyle === "Visual" ? "video" : "textbook", link: "math-resource-link" },
          { type: "interactive", link: "math-interactive-link" },
        ],
        activities: interests.includes("science") ? ["algebra project"] : ["geometry project"],
      },
      languageArts: {
        resources: [
          { type: learningstyle === "Auditory" ? "podcast" : "book", link: "language-arts-resource-link" },
          { type: "interactive", link: "language-arts-interactive-link" },
        ],
        activities: interests.includes("writing") ? ["creative writing"] : ["essay writing"],
      },
    },
    electiveSubjects: interests.map(interest => ({
      name: interest,
      resources: [{ type: "online course", link: `${interest}-course-link` }],
    })),
  };

  return learningPlan;
};

export default setupLearningPlanRoute;
