import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Doctor } from "../models/Doctor.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.utils.js";

const escapeRegex = (text = "") => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const analyzeSymptoms = asyncHandler(async (req, res, next) => {
  const { symptoms } = req.body;

  if (!symptoms) {
    return next(new ErrorHandler("Please provide your symptoms.", 400));
  }

  if (!process.env.GEMINI_API_KEY) {
    return next(
      new ErrorHandler(
        "AI Configuration Error: Please ensure GEMINI_API_KEY is configured in your backend .env file.",
        500,
      ),
    );
  }

  const availableSpecializations = await Doctor.distinct("specialization");

  if (!availableSpecializations || availableSpecializations.length === 0) {
    return next(
      new ErrorHandler(
        "Triage impossible: The database currently has no active doctors.",
        404,
      ),
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          triageExplanation: {
            type: SchemaType.STRING,
            description: "Brief professional explanation, max 40 words",
          },
          recommendedSpecialization: {
            type: SchemaType.STRING,
            description: "Must match one specialization from the provided list",
          },
        },
        required: ["triageExplanation", "recommendedSpecialization"],
      },
    },
  });

  const prompt = `
You are a highly intelligent Hospital Triage Assistant.

A patient has the following symptoms/concerns:
"${symptoms}"

Choose exactly ONE specialization from this list:
${JSON.stringify(availableSpecializations)}

Rules:
- Return ONLY JSON.
- "triageExplanation" must be brief and professional, max 40 words.
- "recommendedSpecialization" must match one of the provided strings exactly.

`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    const triageData = JSON.parse(responseText);

    const matchedSpecialization =
      availableSpecializations.find(
        (s) =>
          s.toLowerCase() ===
          String(triageData.recommendedSpecialization).toLowerCase(),
      ) || availableSpecializations[0];

    const recommendedDoctors = await Doctor.find({
      specialization: new RegExp(
        `^${escapeRegex(matchedSpecialization)}$`,
        "i",
      ),
    }).select("-password");

    return res.status(200).json({
      success: true,
      triageExplanation: triageData.triageExplanation,
      recommendedSpecialization: matchedSpecialization,
      recommendedDoctors,
    });
  } catch (error) {
    console.error("AI API Warning (Using Fallback Mode):", error.message);

    const mockSpecialization = availableSpecializations[0] || "General";

    const recommendedDoctors = await Doctor.find({
      specialization: new RegExp(`^${escapeRegex(mockSpecialization)}$`, "i"),
    }).select("-password");

    return res.status(200).json({
      success: true,
      triageExplanation:
        "SIMULATED AI RESPONSE. Based on a general review, we recommend consulting the available specialist in the database.",
      recommendedSpecialization: mockSpecialization,
      recommendedDoctors,
    });
  }
});
