"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import {
  AI_VALIDATED_FIELDS,
  AIValidationResult,
  SignupSchema,
  type SignupFormData,
} from "@/lib/validation-schemas";

const FIELDS: { key: keyof SignupFormData; label: string; placeholder: string }[] =
  [
    {
      key: "companyName",
      label: "Company name",
      placeholder: "Acme Corp",
    },
    {
      key: "email",
      label: "Work email",
      placeholder: "you@company.com",
    },
    {
      key: "jobTitle",
      label: "Job title",
      placeholder: "Head of Engineering",
    },
    {
      key: "linkedinUrl",
      label: "LinkedIn URL",
      placeholder: "https://linkedin.com/in/yourprofile",
    },
  ];

const emptyForm: SignupFormData = {
  companyName: "",
  email: "",
  jobTitle: "",
  linkedinUrl: "",
};

function isAIField(
  field: keyof SignupFormData
): field is (typeof AI_VALIDATED_FIELDS)[number] {
  return (AI_VALIDATED_FIELDS as readonly string[]).includes(field);
}

export function ValidationForm() {
  const [form, setForm] = useState<SignupFormData>(emptyForm);
  const [zodErrors, setZodErrors] = useState<
    Partial<Record<keyof SignupFormData, string>>
  >({});
  const [aiFeedback, setAIFeedback] = useState<
    Partial<Record<keyof SignupFormData, AIValidationResult>>
  >({});
  const [aiLoading, setAILoading] = useState<
    Partial<Record<keyof SignupFormData, boolean>>
  >({});

  const validateWithZod = (field: keyof SignupFormData, value: string) => {
    const result = SignupSchema.shape[field].safeParse(value);
    setZodErrors((prev) => ({
      ...prev,
      [field]: result.success ? undefined : result.error.issues[0]?.message,
    }));
    return result.success;
  };

  const validateWithAI = async (field: keyof SignupFormData, value: string) => {
    setAILoading((prev) => ({ ...prev, [field]: true }));
    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value }),
      });
      const result: AIValidationResult = await res.json();
      setAIFeedback((prev) => ({ ...prev, [field]: result }));
    } finally {
      setAILoading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleChange = (field: keyof SignupFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setAIFeedback((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    if (value.trim()) {
      validateWithZod(field, value);
    } else {
      setZodErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = async (field: keyof SignupFormData) => {
    const value = form[field];
    if (!value.trim()) return;
    if (!validateWithZod(field, value)) return;
    if (!isAIField(field)) return;
    await validateWithAI(field, value);
  };

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      {FIELDS.map(({ key, label, placeholder }) => {
        const zodError = zodErrors[key];
        const feedback = aiFeedback[key];
        const loading = aiLoading[key];
        const usesAI = isAIField(key);

        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor={key}
                className="text-sm font-medium text-gray-300"
              >
                {label}
              </label>
              <span className="text-xs text-gray-600">
                {usesAI ? "Zod + AI" : "Zod only"}
              </span>
            </div>

            <input
              id={key}
              type={key === "email" ? "email" : "text"}
              value={form[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              onBlur={() => handleBlur(key)}
              placeholder={placeholder}
              className={`w-full bg-gray-900 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none transition ${
                zodError
                  ? "border-rose-500/60 focus:border-rose-500"
                  : "border-gray-700 focus:border-blue-500"
              }`}
            />

            {zodError && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                {zodError}
              </p>
            )}

            {!zodError && loading && (
              <p className="text-xs text-blue-400 flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                Checking meaning…
              </p>
            )}

            {!zodError && !loading && feedback && feedback.isValid && (
              <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                Looks plausible ({(feedback.confidence * 100).toFixed(0)}%
                confidence)
              </p>
            )}

            {!zodError && !loading && feedback && !feedback.isValid && (
              <p className="text-xs text-amber-400 flex items-start gap-1.5">
                <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                {feedback.suggestion}
              </p>
            )}
          </div>
        );
      })}
    </form>
  );
}
