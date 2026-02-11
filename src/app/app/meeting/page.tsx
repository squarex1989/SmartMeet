"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { meetingTranscript, meetingHighlights, suggestedQuestions } from "@/data/meeting";
import { getEventById } from "@/data/calendar";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";

export default function MeetingPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center text-muted-foreground">Loading...</div>}>
      <MeetingPageContent />
    </Suspense>
  );
}

function MeetingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDocMode = searchParams.get("mode") === "doc";
  const meetingId = searchParams.get("id") ?? "m1";
  const event = getEventById(meetingId);
  const meetingTitle = event?.title ?? "TechVision 需求访谈";

  const [transcriptLines, setTranscriptLines] = useState<typeof meetingTranscript>([]);
  const [docLines, setDocLines] = useState<string[]>(["# TechVision 需求访谈", "", "## Agenda", "- 产品定位与 AI 差异化", "- 定价与下一步"]);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  // Reset dialog when switching between modes
  useEffect(() => {
    setShowEndConfirm(false);
  }, [isDocMode]);

  // Register active meeting tab
  useEffect(() => {
    const baseHref = `/app/meeting?id=${meetingId}`;
    const href = isDocMode ? `${baseHref}&mode=doc` : baseHref;
    useAppStore.getState().addActiveMeeting({
      id: meetingId,
      title: meetingTitle,
      href,
      ongoing: true,
      docMode: isDocMode,
    });
  }, [isDocMode, meetingId, meetingTitle]);

  // Simulate transcript streaming
  useEffect(() => {
    if (transcriptLines.length >= meetingTranscript.length) return;
    const t = setTimeout(() => {
      setTranscriptLines((prev) => [...prev, meetingTranscript[prev.length]]);
    }, 2000);
    return () => clearTimeout(t);
  }, [transcriptLines.length]);

  const handleNote = () => {
    const next = meetingHighlights[highlightIndex % meetingHighlights.length];
    setDocLines((prev) => [...prev, "", "**Snap**", next]);
    setHighlightIndex((i) => i + 1);
  };

  const handleEndMeeting = () => {
    setShowEndConfirm(true);
  };

  const confirmEnd = () => {
    useAppStore.getState().removeActiveMeeting(meetingId);
    useAppStore.getState().setActiveConversationId("alex");
    router.push("/app/chat");
  };

  // === Doc-only mode: no video, transcript + doc only ===
  if (isDocMode) {
    return (
      <div className="flex h-full flex-col min-h-0">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30 shrink-0">
          <div>
            <p className="text-sm font-medium">{meetingTitle}</p>
            <p className="text-xs text-muted-foreground">文档参会模式 · 实时同步中</p>
          </div>
          <Link href={`/app/meeting?id=${meetingId}`}>
            <Button size="sm">加入会议</Button>
          </Link>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Left: Transcript */}
          <div className="w-1/2 flex flex-col border-r border-border min-h-0">
            <div className="px-3 py-2 border-b border-border shrink-0">
              <h4 className="text-xs font-medium text-muted-foreground">实时 Transcript</h4>
            </div>
            <div className="flex-1 overflow-auto p-3 space-y-1">
              {transcriptLines.map((line, i) => (
                <p key={i} className="text-sm">
                  <span className="font-medium">{line.speaker}</span> {line.text}
                </p>
              ))}
              {transcriptLines.length === 0 && (
                <p className="text-sm text-muted-foreground">等待发言...</p>
              )}
            </div>
          </div>

          {/* Right: Doc + actions */}
          <div className="w-1/2 flex flex-col min-h-0">
            <div className="flex-1 overflow-auto p-4 min-h-0">
              <div className="prose prose-sm max-w-none">
                {docLines.map((line, i) => (
                  <p key={i} className="text-sm whitespace-pre-wrap">{line}</p>
                ))}
              </div>
              {showQuestions && (
                <ul className="mt-4 space-y-2 border rounded-lg p-3">
                  {suggestedQuestions.map((q, i) => (
                    <li key={i} className="text-sm">
                      <p>{q.text}</p>
                      <p className="text-xs text-muted-foreground">{q.reason}</p>
                      <Button size="sm" variant="ghost" className="mt-1">插入文档</Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-t border-border p-4 flex gap-2 shrink-0 bg-background">
              <Button size="sm" onClick={handleNote}>Snap</Button>
              <Button size="sm" variant="outline" onClick={() => setShowQuestions(!showQuestions)}>
                Smart Question
              </Button>
              <Button size="sm" variant="outline" className="ml-auto" onClick={handleEndMeeting}>
                离开
              </Button>
            </div>
          </div>
        </div>

        {/* Live summary footer */}
        <div className="border-t border-border p-2 text-xs text-muted-foreground shrink-0">
          Live Summary: 讨论产品定位 deck、定价更新、下周二跟进会议、竞品数据分享。
        </div>

        {showEndConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 max-w-sm">
              <p className="font-medium">确定离开文档参会？</p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowEndConfirm(false)}>取消</Button>
                <Button onClick={confirmEnd}>确认</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // === Full meeting mode (with video) ===
  return (
    <div className="flex h-full">
      <div className="w-1/2 flex flex-col border-r border-border min-h-0">
        <div className="flex-1 flex items-center justify-center min-h-0 bg-[#111111] text-[#8A8A8A]">
          <div className="text-center">
            <div className="h-20 w-20 rounded-full bg-white/10 mx-auto flex items-center justify-center text-2xl font-bold text-white mb-2">
              TV
            </div>
            <p>{meetingTitle}</p>
            <p className="text-sm">会议进行中</p>
          </div>
        </div>
        <div className="flex gap-2 p-2 border-t border-border bg-[#111111] shrink-0">
          <button type="button" onClick={() => setMuted(!muted)} className="p-2 rounded-full bg-white/10 text-white">
            {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
          <button type="button" onClick={() => setVideoOff(!videoOff)} className="p-2 rounded-full bg-white/10 text-white">
            {videoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </button>
          <button type="button" onClick={handleEndMeeting} className="p-2 rounded-full bg-red-600 text-white ml-auto">
            <PhoneOff className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="w-1/2 flex flex-col min-h-0">
        <div className="h-40 shrink-0 border-b border-border overflow-auto p-3 bg-muted/30">
          <h4 className="text-xs font-medium text-muted-foreground mb-2">实时 Transcript</h4>
          {transcriptLines.map((line, i) => (
            <p key={i} className="text-sm">
              <span className="font-medium">{line.speaker}</span> {line.text}
            </p>
          ))}
        </div>
        <div className="flex-1 overflow-auto p-4 min-h-0">
          <div className="prose prose-sm max-w-none">
            {docLines.map((line, i) => (
              <p key={i} className="text-sm whitespace-pre-wrap">{line}</p>
            ))}
          </div>
          {showQuestions && (
            <ul className="mt-4 space-y-2 border rounded-lg p-3">
              {suggestedQuestions.map((q, i) => (
                <li key={i} className="text-sm">
                  <p>{q.text}</p>
                  <p className="text-xs text-muted-foreground">{q.reason}</p>
                  <Button size="sm" variant="ghost" className="mt-1">插入文档</Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-border p-4 flex gap-2 shrink-0 bg-background">
          <Button size="sm" onClick={handleNote}>Snap</Button>
          <Button size="sm" variant="outline" onClick={() => setShowQuestions(!showQuestions)}>
            Smart Question
          </Button>
        </div>
        <div className="border-t border-border p-2 text-xs text-muted-foreground shrink-0">
          Live Summary: 讨论产品定位 deck、定价更新、下周二跟进会议、竞品数据分享。
        </div>
      </div>

      {showEndConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-sm w-full">
            <p className="font-medium">确定结束会议？</p>
            <div className="flex flex-col gap-2 mt-4">
              <Button onClick={confirmEnd} className="w-full">离开会议</Button>
              <Link href={`/app/meeting?id=${meetingId}&mode=doc`} className="w-full">
                <Button variant="outline" className="w-full">离开，但保持文档参会</Button>
              </Link>
              <Button variant="ghost" onClick={() => setShowEndConfirm(false)} className="w-full">取消</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
