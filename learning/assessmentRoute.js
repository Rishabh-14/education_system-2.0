import express from "express";
import supabase from "../supabaseClient.js";
import { v4 as uuidv4 } from 'uuid';

const setupAssessmentRoute = (app) => {
  app.post("/assessment", async (req, res) => {
    try {
      const { name, age, learningStyle, interests } = req.body;

      // Generate a unique ID for the student
      const studentId = uuidv4();

      // Insert the student profile into the 'students' table
      const { data, error } = await supabase
        .from('students')
        .insert([
          {
            id: studentId,
            name,
            age,
            learningstyle: learningStyle,
            interests,
            createdat: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      res.status(200).json({ message: "Assessment completed successfully", profile: data[0] });
    } catch (error) {
      console.error("Failed to complete assessment:", error);
      res.status(500).json({ error: "Failed to complete assessment" });
    }
  });
};

export default setupAssessmentRoute;
