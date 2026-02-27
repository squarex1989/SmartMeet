"use client";

import { useState } from "react";
import { ArrowLeft, Send, Database, CalendarPlus, CheckCircle, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/store/useAppStore";
import { getReviewItemById, getActionLabel } from "@/data/review-items";
import { getDocumentContent } from "@/data/documents";
import type { ReviewPayload, EmailPayload, CrmUpdatePayload, FollowUpPayload } from "@/data/review-items";

export function ReviewOverlay() {
  const {
    activeReviewItemId,
    setCommandRoomOverlay,
    setMainView,
    setOpenDocumentId,
    setReviewItemStatus,
    reviewItemStatuses,
  } = useAppStore();

  const item = activeReviewItemId ? getReviewItemById(activeReviewItemId) : null;
  const isDone = item ? (reviewItemStatuses[item.id] === "done") : false;

  const [editing, setEditing] = useState(false);

  if (!item) {
    return (
      <div className="flex h-full w-full flex-col bg-background">
        <button
          onClick={() => setCommandRoomOverlay(null)}
          className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          No item selected
        </div>
      </div>
    );
  }

  const actionLabel = getActionLabel(item.type);
  const needsAction = actionLabel !== null;

  const handleAction = () => {
    setEditing(false);
    setReviewItemStatus(item.id, "done");
    toast.success(actionLabel ? `${actionLabel} completed` : "Done");
  };

  const handleLooksGood = () => {
    setReviewItemStatus(item.id, "done");
    toast.success("Marked as reviewed");
    setCommandRoomOverlay(null);
  };

  const handleOpenInDocs = (docId: string) => {
    setMainView("docs");
    setOpenDocumentId(docId);
    setCommandRoomOverlay(null);
  };

  const actionIcon = () => {
    switch (item.type) {
      case "email_draft": return <Send className="h-4 w-4" />;
      case "crm_update": return <Database className="h-4 w-4" />;
      case "follow_up": return <CalendarPlus className="h-4 w-4" />;
      case "weekly_report": return <Send className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const hasDocPayload = item.payload.type === "meeting_notes" || item.payload.type === "weekly_report";
  const docId = hasDocPayload ? (item.payload as { docId: string }).docId : null;

  return (
    <div className="flex h-full w-full flex-col overflow-auto bg-background">
      <button
        onClick={() => { setEditing(false); setCommandRoomOverlay(null); }}
        className="flex shrink-0 items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
      <div className="flex flex-1 flex-col gap-4 overflow-auto px-4 pb-6">
        <h2 className="text-lg font-semibold">{item.title}</h2>

        {isDone && (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 px-4 py-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-800 dark:text-green-300">
              {needsAction ? `${actionLabel} — Done` : "Reviewed"}
            </span>
          </div>
        )}

        <ReviewContent
          payload={item.payload}
          editing={editing}
        />

        {!isDone && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            {needsAction ? (
              <button
                onClick={handleAction}
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90"
              >
                {actionIcon()}
                {actionLabel}
              </button>
            ) : (
              <button
                onClick={handleLooksGood}
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90"
              >
                <CheckCircle className="h-4 w-4" />
                Looks Good
              </button>
            )}

            {!editing && (
              <button
                onClick={() => docId ? handleOpenInDocs(docId) : setEditing(true)}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2.5 text-sm hover:bg-surface-2"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewContent({
  payload,
  editing,
}: {
  payload: ReviewPayload;
  editing: boolean;
}) {
  if (payload.type === "meeting_notes" || payload.type === "weekly_report") {
    const doc = getDocumentContent(payload.docId);
    return (
      <pre className="whitespace-pre-wrap rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed">
        {doc?.body ?? ""}
      </pre>
    );
  }

  if (payload.type === "crm_update") {
    return <CrmContent payload={payload} editing={editing} />;
  }

  if (payload.type === "email_draft") {
    return <EmailContent payload={payload} editing={editing} />;
  }

  if (payload.type === "follow_up") {
    return <FollowUpContent payload={payload} editing={editing} />;
  }

  return null;
}

function EmailContent({ payload, editing }: { payload: EmailPayload; editing: boolean }) {
  const [to, setTo] = useState(payload.to);
  const [cc, setCc] = useState(payload.cc ?? "");
  const [subject, setSubject] = useState(payload.subject);
  const [body, setBody] = useState(payload.body);

  if (editing) {
    return (
      <div className="space-y-3 rounded-xl border border-accent/30 bg-muted/30 p-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground font-medium">To</span>
          <input value={to} onChange={(e) => setTo(e.target.value)} className="rounded border border-border bg-background px-2.5 py-1.5 text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground font-medium">CC</span>
          <input value={cc} onChange={(e) => setCc(e.target.value)} className="rounded border border-border bg-background px-2.5 py-1.5 text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground font-medium">Subject</span>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} className="rounded border border-border bg-background px-2.5 py-1.5 text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground font-medium">Body</span>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} className="rounded border border-border bg-background px-2.5 py-1.5 text-sm font-mono resize-y" />
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-xl border border-border bg-muted/30 p-4">
      <p className="text-sm"><span className="font-medium text-muted-foreground">To:</span> {payload.to}</p>
      {payload.cc && <p className="text-sm"><span className="font-medium text-muted-foreground">CC:</span> {payload.cc}</p>}
      <p className="text-sm"><span className="font-medium text-muted-foreground">Subject:</span> {payload.subject}</p>
      <div className="mt-3 border-t border-border pt-3">
        <pre className="whitespace-pre-wrap text-sm">{payload.body}</pre>
      </div>
    </div>
  );
}

function CrmContent({ payload, editing }: { payload: CrmUpdatePayload; editing: boolean }) {
  const [fields, setFields] = useState(payload.fields.map((f) => ({ ...f })));

  const updateField = (idx: number, key: "to", val: string) => {
    setFields((prev) => prev.map((f, i) => i === idx ? { ...f, [key]: val } : f));
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-4 py-2 text-left font-medium">Field</th>
            <th className="px-4 py-2 text-left font-medium">Current</th>
            <th className="px-4 py-2 text-left font-medium">Updated</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((f, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              <td className="px-4 py-2 font-medium">{f.name}</td>
              <td className="px-4 py-2 text-muted-foreground">{f.from}</td>
              <td className="px-4 py-2">
                {editing ? (
                  <input
                    value={f.to}
                    onChange={(e) => updateField(i, "to", e.target.value)}
                    className="w-full rounded border border-border bg-background px-2 py-1 text-sm"
                  />
                ) : f.to}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FollowUpContent({ payload, editing }: { payload: FollowUpPayload; editing: boolean }) {
  const [desc, setDesc] = useState(payload.description);
  const [due, setDue] = useState(payload.dueDate ?? "");

  if (editing) {
    return (
      <div className="space-y-3 rounded-xl border border-accent/30 bg-muted/30 p-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground font-medium">Description</span>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className="rounded border border-border bg-background px-2.5 py-1.5 text-sm resize-y" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground font-medium">Due date</span>
          <input type="datetime-local" value={due.slice(0, 16)} onChange={(e) => setDue(e.target.value)} className="rounded border border-border bg-background px-2.5 py-1.5 text-sm" />
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-xl border border-border bg-muted/30 p-4">
      <p className="text-sm">{payload.description}</p>
      {payload.dueDate && (
        <p className="text-sm text-muted-foreground">Due: {new Date(payload.dueDate).toLocaleString()}</p>
      )}
    </div>
  );
}
