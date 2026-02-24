"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { meetingTranscript, meetingHighlights, suggestedQuestions } from "@/data/meeting";
import { getEventById } from "@/data/calendar";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

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
  const meetingTitle = event?.title ?? "Meeting";

  const [transcriptLines, setTranscriptLines] = useState<typeof meetingTranscript>([]);
  const [docLines, setDocLines] = useState<string[]>(["# Meeting Notes", "", "## Agenda", "- 产品定位与 AI 差异化", "- 定价与下一步"]);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  useEffect(() => {
    setShowEndConfirm(false);
  }, [isDocMode]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      stream.getAudioTracks().forEach((t) => { t.enabled = !muted; });
      stream.getVideoTracks().forEach((t) => { t.enabled = !videoOff; });
    } catch {
      // Camera not available
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    if (!isDocMode) startCamera();
    return () => stopCamera();
  }, [isDocMode, startCamera, stopCamera]);

  useEffect(() => {
    streamRef.current?.getVideoTracks().forEach((t) => { t.enabled = !videoOff; });
  }, [videoOff]);

  useEffect(() => {
    streamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !muted; });
  }, [muted]);

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
    const store = useAppStore.getState();
    store.setMainView("command-room");
    if (event?.topicId) store.setCurrentContext(event.topicId);
    router.push("/app");
  };

  if (isDocMode) {
    return (
      <div className="flex h-full flex-col min-h-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30 shrink-0">
          <div>
            <p className="text-sm font-medium">{meetingTitle}</p>
            <p className="text-xs text-muted-foreground">文档参会模式</p>
          </div>
          <a href={`/app/meeting?id=${meetingId}`}>
            <Button size="sm">加入会议</Button>
          </a>
        </div>

        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          <div className="w-full md:w-1/2 flex flex-col border-r border-border min-h-[200px] md:min-h-0">
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

          <div className="w-full md:w-1/2 flex flex-col min-h-0">
            <div className="px-3 py-2 border-b border-border shrink-0">
              <h4 className="text-xs font-medium text-muted-foreground">My Notes</h4>
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
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-t border-border p-4 flex flex-wrap gap-2 shrink-0 bg-background">
              <Button size="sm" onClick={handleNote}>Snap</Button>
              <Button size="sm" variant="outline" onClick={() => setShowQuestions(!showQuestions)}>Smart Question</Button>
              <Button size="sm" variant="outline" className="md:ml-auto" onClick={handleEndMeeting}>离开</Button>
            </div>
          </div>
        </div>

        {showEndConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 max-w-sm">
              <p className="font-medium">确定离开？</p>
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

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="w-full md:w-1/2 flex flex-col border-r border-border min-h-0 flex-1 md:flex-initial">
        <div className="flex-1 min-h-[180px] md:min-h-0 relative flex items-center justify-center bg-surface-2 text-muted-foreground overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover scale-x-[-1] ${videoOff ? "hidden" : ""}`}
          />
          {videoOff && (
            <div className="text-center">
              <div className="h-20 w-20 rounded-full bg-white/10 mx-auto flex items-center justify-center text-2xl font-bold text-white mb-2">S</div>
              <p>{meetingTitle}</p>
              <p className="text-sm">摄像头已关闭</p>
            </div>
          )}
          {!videoOff && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 pointer-events-none">
              <p className="text-sm text-white font-medium">{meetingTitle}</p>
            </div>
          )}
        </div>
        <div className="flex gap-2 p-2 border-t border-border bg-surface-2 shrink-0">
          <button type="button" onClick={() => setMuted(!muted)} className="interactive-base p-2 rounded-full bg-surface-3 text-foreground hover:bg-accent/20">
            {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
          <button type="button" onClick={() => setVideoOff(!videoOff)} className="interactive-base p-2 rounded-full bg-surface-3 text-foreground hover:bg-accent/20">
            {videoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </button>
          <button type="button" onClick={handleEndMeeting} className="interactive-base p-2 rounded-full bg-red-600 text-white ml-auto hover:bg-red-700">
            <PhoneOff className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col min-h-0 flex-1 md:flex-initial">
        <div className="h-32 md:h-40 shrink-0 border-b border-border overflow-auto p-3 bg-muted/30">
          <h4 className="text-xs font-medium text-muted-foreground mb-2">实时 Transcript</h4>
          {transcriptLines.map((line, i) => (
            <p key={i} className="text-sm">
              <span className="font-medium">{line.speaker}</span> {line.text}
            </p>
          ))}
        </div>
        <div className="px-3 py-2 border-b border-border shrink-0">
          <h4 className="text-xs font-medium text-muted-foreground">My Notes</h4>
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
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-border p-4 flex flex-wrap gap-2 shrink-0 bg-background">
          <Button size="sm" onClick={handleNote}>Snap</Button>
          <Button size="sm" variant="outline" onClick={() => setShowQuestions(!showQuestions)}>Smart Question</Button>
        </div>
      </div>

      {showEndConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-sm w-full">
            <p className="font-medium">确定结束会议？</p>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowEndConfirm(false)}>取消</Button>
              <Button onClick={confirmEnd}>离开会议</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
