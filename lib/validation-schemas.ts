import { z } from "zod";

// Pass 1: syntactic validation (instant, free)
export const SignupSchema = z.object({
  companyName: z.string().min(2).max(100),
  email: z.string().email(),
  jobTitle: z.string().min(2),
  linkedinUrl: z.string().url().includes("linkedin.com"),
});

export type SignupFormData = z.infer<typeof SignupSchema>;

// Pass 2: semantic AI validation response schema
export const AIValidationResult = z.object({
  isValid: z.boolean(),
  confidence: z.number().min(0).max(1),
  suggestion: z.string(),
});
export type AIValidationResult = z.infer<typeof AIValidationResult>;

export const AI_VALIDATED_FIELDS = ["companyName", "jobTitle"] as const;
export type AIValidatedField = (typeof AI_VALIDATED_FIELDS)[number];
