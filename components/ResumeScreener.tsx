"use client";

import { useCallback, useState } from "react";
import {
  FileText,
  Loader2,
  MapPin,
  Upload,
  Wifi,
} from "lucide-react";
import { getInitials, type Candidate } from "@/lib/candidate-schema";

const DEFAULT_JOB = `Senior Frontend Engineer — React, TypeScript, Next.js.
5+ years experience. Remote-friendly. Strong UI/UX sensibility.
Experience with design systems and AI tooling is a plus.`;

function FitScoreRing({ score }: { score: number }) {
  const pct = (score / 10) * 100;
  const color =
    score >= 8 ? "#34d399" : score >= 5 ? "#fbbf24" : "#f87171";

  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke="#374151"
          strokeWidth="3"
        />
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${pct} 100`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{score}</span>
        <span className="text-[9px] uppercase tracking-wider text-gray-500">
          Fit
        </span>
      </div>
    </div>
  );
}

function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/80 overflow-hidden">
      <div className="grid gap-6 lg:grid-cols-3 p-6">
        <div className="space-y-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            }}
          >
            {getInitials(candidate.name)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {candidate.name}
            </h3>
            <p className="text-sm text-gray-400">{candidate.currentTitle}</p>
          </div>
          <p className="text-sm text-gray-500">
            <span className="text-2xl font-bold text-white">
              {candidate.yearsExp}
            </span>{" "}
            years experience
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            {candidate.summary}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-gray-500">
            Top skills
          </p>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill) => (
              <span
                key={skill.name}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-xs text-gray-300"
              >
                {skill.name}
                <span className="text-gray-500">{skill.years}y</span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center lg:items-end gap-4">
          <FitScoreRing score={candidate.fitScore} />
          <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                candidate.isRemote
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-gray-800 text-gray-400 border border-gray-700"
              }`}
            >
              <Wifi className="w-3 h-3" />
              {candidate.isRemote ? "Open to remote" : "On-site preferred"}
            </span>
          </div>
          {candidate.salary && (
            <p className="text-sm text-gray-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {candidate.salary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function ResumeScreener() {
  const [jobDescription, setJobDescription] = useState(DEFAULT_JOB);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);

  const handleFile = useCallback((f: File) => {
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setFile(f);
    setError(null);
    setCandidate(null);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleScreen = async () => {
    if (!file || !jobDescription.trim()) return;

    setLoading(true);
    setError(null);
    setCandidate(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const res = await fetch("/api/screen", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Screening failed");
      setCandidate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Screening failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-gray-500">
          Job description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={4}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-blue-500 transition resize-none"
        />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed px-8 py-12 text-center transition ${
          dragging
            ? "border-blue-500 bg-blue-500/5"
            : "border-gray-700 bg-gray-900/50 hover:border-gray-600"
        }`}
      >
        <input
          type="file"
          accept="application/pdf"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        {file ? (
          <div className="space-y-2 pointer-events-none">
            <FileText className="w-10 h-10 text-blue-400 mx-auto" />
            <p className="text-sm text-white font-medium">{file.name}</p>
            <p className="text-xs text-gray-500">Drop another PDF to replace</p>
          </div>
        ) : (
          <div className="space-y-2 pointer-events-none">
            <Upload className="w-10 h-10 text-gray-600 mx-auto" />
            <p className="text-sm text-gray-400">Drop a PDF resume here</p>
            <p className="text-xs text-gray-600">or click to browse</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleScreen}
        disabled={loading || !file || !jobDescription.trim()}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Screening resume…
          </>
        ) : (
          "Screen candidate"
        )}
      </button>

      {error && <p className="text-sm text-rose-400">{error}</p>}

      {candidate && <CandidateCard candidate={candidate} />}
    </div>
  );
}
