"use client";

import { useRef, useEffect, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { getDocumentContent } from "@/data/documents";

interface ExportMenuProps {
  documentId: string;
  title: string;
}

export function ExportMenu({ documentId, title }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const content = getDocumentContent(documentId);
  const body = content?.body ?? "";

  const download = (ext: string, mime: string, label: string) => {
    const blob = new Blob([body], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
    toast.success(`Exported as ${label}`);
  };

  const handleGoogleDocs = () => {
    setOpen(false);
    toast.success("Sent to Google Docs");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold border-0 bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
      >
        <Download className="h-4 w-4" />
        Export
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-50 w-56 rounded-xl border border-stone-200 bg-white py-1 shadow-sm">
            <button
              type="button"
              onClick={handleGoogleDocs}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-left text-stone-700 hover:bg-orange-100/40"
            >
              Google Docs
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600">
                Connected
              </span>
            </button>
            <button
              type="button"
              onClick={() => download("txt", "text/plain", "Word")}
              className="w-full px-3 py-2 text-sm text-left text-stone-700 hover:bg-orange-100/40"
            >
              Word (.docx)
            </button>
            <button
              type="button"
              onClick={() => download("md", "text/markdown", "Markdown")}
              className="w-full px-3 py-2 text-sm text-left text-stone-700 hover:bg-orange-100/40"
            >
              Markdown (.md)
            </button>
            <button
              type="button"
              onClick={() => {
                window.print();
                setOpen(false);
                toast.success("Print dialog opened");
              }}
              className="w-full px-3 py-2 text-sm text-left text-stone-700 hover:bg-orange-100/40"
            >
              PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}
