"use client";

import { useRef } from "react";
import type { ResumeData } from "@/lib/types";

interface Props {
  resume: ResumeData;
  name: string;
  title: string;
}

export function ResumePreview({ resume, name, title }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const downloadPdf = async () => {
    const { default: html2canvas } = await import("html2canvas");
    const { jsPDF } = await import("jspdf");

    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = (canvas.height * pageWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
    pdf.save(`${name.replace(/\s+/g, "_")}_resume.pdf`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={downloadPdf}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Download PDF
        </button>
      </div>

      {/* ATS-clean resume */}
      <div
        ref={ref}
        className="bg-white text-gray-900 font-sans max-w-2xl mx-auto p-10 shadow-sm border border-gray-100"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        {/* Header */}
        <div className="border-b-2 border-gray-900 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
          <p className="text-gray-600 mt-1">{title}</p>
        </div>

        {/* Summary */}
        {resume.summary && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Summary</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{resume.summary}</p>
          </section>
        )}

        {/* Experience */}
        {resume.experience?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3">Experience</h2>
            <div className="space-y-5">
              {resume.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{exp.role}</p>
                      <p className="text-gray-600 text-sm">{exp.org}</p>
                    </div>
                    <p className="text-gray-500 text-sm whitespace-nowrap ml-4">{exp.duration}</p>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="text-sm text-gray-700 flex gap-2">
                        <span className="flex-shrink-0 mt-1.5 w-1 h-1 bg-gray-400 rounded-full" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {resume.education?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3">Education</h2>
            <div className="space-y-2">
              {resume.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{edu.degree}</p>
                    <p className="text-gray-600 text-sm">{edu.institution}</p>
                  </div>
                  <p className="text-gray-500 text-sm">{edu.year}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
