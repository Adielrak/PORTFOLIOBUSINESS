"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/provider";
import { FileUpload } from "./FileUpload";
import { URLInput } from "./URLInput";
import type { FormState, Template } from "@/lib/types";

const INITIAL: FormState = {
  fullName: "",
  jobTitle: "",
  bio: "",
  photoFile: null,
  photoURL: "",
  websiteURL: "",
  twitterURL: "",
  githubURL: "",
  linkedinURL: "",
  projectURLs: ["", "", ""],
  resumeFile: null,
  resumeURL: "",
  skills: [],
  jobTarget: "",
  screenshotFiles: [],
  screenshotURLs: [],
  template: "minimal",
};

const TEMPLATES: { id: Template; label: string; desc: string; bg: string }[] = [
  { id: "minimal", label: "Minimal", desc: "Clean, white, professional", bg: "bg-white text-gray-900 border-gray-200" },
  { id: "bold", label: "Bold", desc: "Dark, large typography, dramatic", bg: "bg-gray-950 text-white border-gray-800" },
  { id: "creative", label: "Creative", desc: "Warm, asymmetric, photo-forward", bg: "bg-amber-50 text-gray-900 border-amber-200" },
];

const STEPS = ["Personal", "Work", "Resume", "Media & Style"];

export function MultiStepForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof FormState, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      set("skills", [...form.skills, s]);
    }
    setSkillInput("");
  };

  const removeSkill = (s: string) => set("skills", form.skills.filter((x) => x !== s));

  const handleGenerate = async () => {
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const token = await user.getIdToken();
      const fd = new FormData();

      fd.append("fullName", form.fullName);
      fd.append("jobTitle", form.jobTitle);
      fd.append("bio", form.bio);
      fd.append("websiteURL", form.websiteURL);
      fd.append("twitterURL", form.twitterURL);
      fd.append("githubURL", form.githubURL);
      fd.append("linkedinURL", form.linkedinURL);
      fd.append("skills", JSON.stringify(form.skills));
      fd.append("jobTarget", form.jobTarget);
      fd.append("projectURLs", JSON.stringify(form.projectURLs.filter(Boolean)));
      fd.append("photoURL", form.photoURL);
      fd.append("screenshotURLs", JSON.stringify(form.screenshotURLs));
      fd.append("template", form.template);
      if (form.resumeFile) fd.append("resumeFile", form.resumeFile);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) throw new Error(await res.text());
      router.push("/preview");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-24 px-4">
      <div className="max-w-xl mx-auto">
        {/* Progress */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex items-center gap-1">
              <div
                className={`flex-1 h-1 rounded-full transition-colors ${
                  i <= step ? "bg-indigo-500" : "bg-gray-800"
                }`}
              />
              {i === STEPS.length - 1 && null}
            </div>
          ))}
        </div>

        <p className="text-indigo-400 text-sm font-medium mb-1">
          Step {step + 1} of {STEPS.length}
        </p>
        <h2 className="text-2xl font-bold text-white mb-8">{STEPS[step]}</h2>

        {/* Step 0: Personal */}
        {step === 0 && (
          <div className="space-y-5">
            <Input label="Full name *" value={form.fullName} onChange={(v) => set("fullName", v)} placeholder="Jane Smith" />
            <Input label="Job title / Role *" value={form.jobTitle} onChange={(v) => set("jobTitle", v)} placeholder="Senior iOS Engineer" />
            <Textarea label="Bio" value={form.bio} onChange={(v) => set("bio", v)} placeholder="Tell your story in 2–3 sentences..." />
            <FileUpload
              label="Profile photo"
              accept="image/*"
              storagePath="users/{uid}/photo"
              hint="JPG, PNG — max 5MB"
              maxSizeMB={5}
              preview={form.photoURL}
              onUploadComplete={(url) => set("photoURL", url)}
            />
            <URLInput label="Personal website" placeholder="https://yoursite.com" value={form.websiteURL} onChange={(v) => set("websiteURL", v)} optional />
            <URLInput label="Twitter / X" placeholder="https://x.com/username" value={form.twitterURL} onChange={(v) => set("twitterURL", v)} optional />
          </div>
        )}

        {/* Step 1: Work */}
        {step === 1 && (
          <div className="space-y-5">
            <URLInput label="GitHub profile URL" placeholder="https://github.com/username" value={form.githubURL} onChange={(v) => set("githubURL", v)} optional />
            <URLInput label="LinkedIn URL" placeholder="https://linkedin.com/in/username" value={form.linkedinURL} onChange={(v) => set("linkedinURL", v)} optional />
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">Project URLs <span className="text-gray-500 font-normal">(up to 3, optional)</span></label>
              {form.projectURLs.map((url, i) => (
                <input
                  key={i}
                  type="url"
                  placeholder={`Project ${i + 1} URL`}
                  value={url}
                  onChange={(e) => {
                    const urls = [...form.projectURLs];
                    urls[i] = e.target.value;
                    set("projectURLs", urls);
                  }}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-sm"
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Resume */}
        {step === 2 && (
          <div className="space-y-5">
            <FileUpload
              label="Upload resume (optional)"
              accept=".pdf,.doc,.docx"
              storagePath="users/{uid}/resume"
              hint="PDF or DOCX — max 10MB. Claude will parse and enhance it."
              preview={form.resumeURL}
              onUploadComplete={(url, file) => { set("resumeURL", url); set("resumeFile", file); }}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Skills</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  placeholder="e.g. SwiftUI, React, Python"
                  className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-sm"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.skills.map((s) => (
                  <span key={s} className="flex items-center gap-1 px-3 py-1 bg-indigo-900/40 border border-indigo-700/40 text-indigo-300 text-sm rounded-full">
                    {s}
                    <button onClick={() => removeSkill(s)} className="text-indigo-400 hover:text-white ml-1">×</button>
                  </span>
                ))}
              </div>
            </div>

            <Input label="Job target *" value={form.jobTarget} onChange={(v) => set("jobTarget", v)} placeholder="e.g. Senior iOS Engineer at a startup" />
          </div>
        )}

        {/* Step 3: Media & Style */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                App screenshots / Portfolio images <span className="text-gray-500 font-normal">(up to 5)</span>
              </label>
              {form.screenshotURLs.length < 5 && (
                <FileUpload
                  label=""
                  accept="image/*"
                  storagePath={`users/{uid}/screenshots/${form.screenshotURLs.length}`}
                  hint="Each image max 10MB"
                  onUploadComplete={(url) => set("screenshotURLs", [...form.screenshotURLs, url])}
                />
              )}
              <div className="grid grid-cols-3 gap-2 mt-2">
                {form.screenshotURLs.map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={url} alt={`screenshot ${i}`} className="h-20 w-full object-cover rounded-lg" />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">Choose a template</label>
              <div className="grid gap-3">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => set("template", t.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                      form.template === t.id
                        ? "border-indigo-500 ring-2 ring-indigo-500/30"
                        : "border-gray-800 hover:border-gray-700"
                    } ${t.bg}`}
                  >
                    <div>
                      <p className="font-semibold text-sm">{t.label}</p>
                      <p className="text-xs opacity-60 mt-0.5">{t.desc}</p>
                    </div>
                    {form.template === t.id && <span className="text-indigo-400 text-sm">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-700/40 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Nav buttons */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-6 py-3 border border-gray-700 text-gray-300 hover:text-white rounded-xl transition-colors text-sm"
            >
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 0 && (!form.fullName || !form.jobTitle)}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors text-sm"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={loading || !form.jobTarget}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating your portfolio...
                </span>
              ) : (
                "✨ Generate Portfolio"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Small helper sub-components
function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm resize-none"
      />
    </div>
  );
}
