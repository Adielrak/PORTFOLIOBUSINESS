"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { useAuth } from "@/lib/auth/provider";

interface FileUploadProps {
  accept: string;
  maxSizeMB?: number;
  storagePath: string;
  label: string;
  hint?: string;
  onUploadComplete: (url: string, file: File) => void;
  preview?: string;
}

export function FileUpload({
  accept,
  maxSizeMB = 10,
  storagePath,
  label,
  hint,
  onUploadComplete,
  preview,
}: FileUploadProps) {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large (max ${maxSizeMB}MB)`);
      return;
    }
    if (!user) return;

    const { ref, uploadBytesResumable, getDownloadURL } = await import("firebase/storage");
    const { getClientStorage } = await import("@/lib/firebase/client");

    const path = storagePath.replace("{uid}", user.uid);
    const storageRef = ref(getClientStorage(), path);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => setError(err.message),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        setProgress(null);
        onUploadComplete(url, file);
      }
    );
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all ${
          dragging
            ? "border-indigo-500 bg-indigo-500/10"
            : "border-gray-700 hover:border-gray-600 bg-gray-800/50"
        }`}
      >
        {preview ? (
          <div className="flex flex-col items-center gap-2">
            {accept.includes("image") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="preview" className="h-24 w-24 rounded-full object-cover" />
            ) : (
              <div className="text-green-400 text-sm font-medium">✓ File uploaded</div>
            )}
            <p className="text-xs text-gray-500">Click to replace</p>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-3xl">📁</div>
            <p className="text-sm text-gray-400">
              Drag & drop or <span className="text-indigo-400">browse</span>
            </p>
            {hint && <p className="text-xs text-gray-600">{hint}</p>}
          </div>
        )}

        {progress !== null && (
          <div className="absolute inset-x-4 bottom-3">
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{progress}%</p>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={onChange} />
    </div>
  );
}
