"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export const IMAGE_SEARCH_KEY = "snehalayaa:imageSearch";

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-5" aria-hidden>
      <path d="M12 15.5V4M12 4 7.5 8.5M12 4l4.5 4.5" />
      <path d="M4.5 15.5V18a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2.5" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-5" aria-hidden>
      <path d="M4 8V6.5a1.5 1.5 0 0 1 1.5-1.5H8l1-1.5h6L16 5h2.5A1.5 1.5 0 0 1 20 6.5V8" />
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <circle cx="12" cy="13.5" r="3.4" />
    </svg>
  );
}

// Reads a File/Blob into a data URL so it survives a route change via sessionStorage.
function toDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

export default function ImageSearchModal({
  open,
  onClose,
  onImage,
}: {
  open: boolean;
  onClose: () => void;
  /** When provided (e.g. the results page), receives the new image instead of navigating. */
  onImage?: (dataUrl: string) => void;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [camera, setCamera] = useState(false);
  const [error, setError] = useState("");

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    if (!open) { stopCamera(); setCamera(false); setError(""); }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const useImage = (dataUrl: string) => {
    try { sessionStorage.setItem(IMAGE_SEARCH_KEY, dataUrl); } catch {}
    stopCamera();
    onClose();
    if (onImage) onImage(dataUrl);
    else router.push("/image-search");
  };

  const onFile = async (file: File) => {
    try { useImage(await toDataUrl(file)); } catch { setError("Could not read that image. Please try another."); }
  };

  const startCamera = async () => {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) { setError("Camera isn't available in this browser."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setCamera(true);
      // Attach after the <video> renders.
      requestAnimationFrame(() => {
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(() => {}); }
      });
    } catch {
      setError("Camera permission was denied.");
    }
  };

  const capture = async () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob(async (blob) => { if (blob) useImage(await toDataUrl(blob)); }, "image/jpeg", 0.9);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div onClick={() => { stopCamera(); onClose(); }} className="absolute inset-0 bg-black/45" />
      <div className="relative w-full max-w-[440px] bg-white rounded-[14px] border-[1.5px] border-burgundy shadow-[0_24px_64px_rgba(23,23,23,0.28)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <h2 className="font-display text-[20px] leading-none uppercase tracking-[0.5px] text-burgundy">Search by Image</h2>
          <button type="button" onClick={() => { stopCamera(); onClose(); }} aria-label="Close" className="text-ink-faint text-2xl leading-none hover:text-ink">×</button>
        </div>

        <div className="px-5 py-6">
          {camera ? (
            <div>
              <div className="relative w-full aspect-[3/4] max-h-[52vh] overflow-hidden rounded-[10px] bg-black">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
              </div>
              <div className="mt-4 flex gap-3">
                <button type="button" onClick={capture} className="flex-1 flex items-center justify-center gap-2 h-12 rounded-[6px] bg-burgundy text-cream text-[13px] font-semibold">
                  <CameraIcon /> Capture
                </button>
                <button type="button" onClick={() => { stopCamera(); setCamera(false); }} className="h-12 px-5 rounded-[6px] border border-burgundy text-[13px] font-semibold text-burgundy">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-[13px] text-[#777] text-center">
                Upload a saree photo or capture one — we&apos;ll find similar styles from our catalogue.
              </p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2.5 h-12 rounded-[6px] bg-burgundy text-cream text-[13px] font-semibold tracking-[0.4px]"
                >
                  <UploadIcon /> Upload the Photo
                </button>
                <button
                  type="button"
                  onClick={startCamera}
                  className="w-full flex items-center justify-center gap-2.5 h-12 rounded-[6px] border border-burgundy bg-white text-[13px] font-semibold tracking-[0.4px] text-burgundy"
                >
                  <CameraIcon /> Capture with Camera
                </button>
              </div>
            </>
          )}
          {error && <p className="mt-3 text-center text-[12px] text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
