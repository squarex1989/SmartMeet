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
      <div className="shrink-0 border-b border-border bg-background px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={() => setOpenDocumentId(null)}
          className="interactive-base p-2 -ml-1 rounded-md hover:bg-surface-2 text-muted-foreground hover:text-foreground hidden md:flex"
          aria-label="Back to docs"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <nav className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
          <button
            type="button"
            onClick={() => setOpenDocumentId(null)}
            className="interactive-base hover:text-accent hidden md:inline"
          >
            Docs
          </button>
          <span className="hidden md:inline">/</span>
          <span className="text-foreground truncate">{meta.title}</span>
        </nav>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ExportMenu documentId={openDocumentId} title={meta.title} />
          <div className="flex rounded-md border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setMode("view")}
              className={cn(
                "interactive-subtle px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm",
                mode === "view"
                  ? "bg-accent text-accent-foreground"
                  : "bg-surface-1 text-muted-foreground hover:bg-surface-2"
              )}
            >
              View
            </button>
            <button
              type="button"
              onClick={() => setMode("edit")}
              className={cn(
                "interactive-subtle px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm",
                mode === "edit"
                  ? "bg-accent text-accent-foreground"
                  : "bg-surface-1 text-muted-foreground hover:bg-surface-2"
              )}
            >
              Edit
            </button>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:inline">
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
            className="interactive-subtle w-full h-full min-h-[400px] p-4 font-mono text-sm rounded-md border border-border bg-surface-1 resize-none focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        )}
      </div>
    </div>
  );
}
