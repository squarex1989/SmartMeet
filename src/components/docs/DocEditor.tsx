"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { getDocumentMeta, getDocumentContent } from "@/data/documents";
import { ExportMenu } from "./ExportMenu";
import { cn } from "@/lib/utils";

export function DocEditor() {
  const openDocumentId = useAppStore((s) => s.openDocumentId);
  const setOpenDocumentId = useAppStore((s) => s.setOpenDocumentId);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(true);

  const meta = openDocumentId ? getDocumentMeta(openDocumentId) : null;
  const docContent = openDocumentId ? getDocumentContent(openDocumentId) : null;

  const bodyText = docContent?.body ?? "";

  useEffect(() => {
    if (bodyText) {
      setContent(bodyText);
      setSaved(true);
    }
  }, [openDocumentId, bodyText]);

  useEffect(() => {
    if (!bodyText || content === bodyText) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [content, bodyText]);

  if (!openDocumentId || !meta) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 border-b border-stone-200 bg-white px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={() => setOpenDocumentId(null)}
          className="p-2 -ml-1 rounded-xl hover:bg-orange-100/50 text-stone-500 hover:text-stone-800 hidden md:flex"
          aria-label="Back to docs"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <nav className="flex items-center gap-2 text-sm text-stone-500 min-w-0">
          <button
            type="button"
            onClick={() => setOpenDocumentId(null)}
            className="hover:text-orange-600 hidden md:inline"
          >
            Docs
          </button>
          <span className="hidden md:inline">/</span>
          <span className="text-stone-800 truncate">{meta.title}</span>
        </nav>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ExportMenu documentId={openDocumentId} title={meta.title} />
          <div className="flex rounded-xl border border-stone-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setMode("view")}
              className={cn(
                "px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm",
                mode === "view"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-stone-500 hover:bg-orange-100/50"
              )}
            >
              View
            </button>
            <button
              type="button"
              onClick={() => setMode("edit")}
              className={cn(
                "px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm",
                mode === "edit"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-stone-500 hover:bg-orange-100/50"
              )}
            >
              Edit
            </button>
          </div>
          <span className="text-xs text-stone-500 hidden sm:inline">
            {saved ? "Saved" : "Editing..."}
          </span>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-auto p-4 sm:p-6">
        {mode === "view" ? (
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
            {content}
          </pre>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full min-h-[400px] p-4 font-mono text-sm rounded-2xl border border-stone-200 bg-stone-50 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400/40"
          />
        )}
      </div>
    </div>
  );
}
