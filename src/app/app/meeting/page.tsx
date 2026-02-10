"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { meetingTranscript, meetingHighlights, suggestedQuestions } from "@/data/meeting";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export default function MeetingPage() {
  const router = useRouter();
  const [transcriptLines, setTranscriptLines] = useState<typeof meetingTranscript>([]);
  const [docLines, setDocLines] = useState<string[]>(["# TechVision 需求访谈", "", "## Agenda", "- 产品定位与 AI 差异化", "- 定价与下一步"]);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

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
    setDocLines((prev) => [...prev, "", "**记一下**", next]);
    setHighlightIndex((i) => i + 1);
  };

  const handleEndMeeting = () => {
    setShowEndConfirm(true);
  };

  const confirmEnd = () => {
    useAppStore.getState().setActiveConversationId("alex");
    router.push("/app/chat");
  };

  return (
    <div className="flex h-full">
      <div className="w-1/2 flex flex-col border-r border-border">
        <div className="flex items-center justify-center h-48 bg-[#111111] text-[#8A8A8A]">
          <div className="text-center">
            <div className="h-20 w-20 rounded-full bg-white/10 mx-auto flex items-center justify-center text-2xl font-bold text-white mb-2">
              TV
            </div>
            <p>TechVision 需求访谈</p>
            <p className="text-sm">会议进行中</p>
          </div>
        </div>
        <div className="flex gap-2 p-2 border-t border-border bg-[#111111]">
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

      <div className="w-1/2 flex flex-col">
        <div className="h-40 border-b border-border overflow-auto p-3 bg-muted/30">
          <h4 className="text-xs font-medium text-muted-foreground mb-2">实时 Transcript</h4>
          {transcriptLines.map((line, i) => (
            <p key={i} className="text-sm">
              <span className="font-medium">{line.speaker}</span> {line.text}
            </p>
          ))}
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div className="prose prose-sm max-w-none">
            {docLines.map((line, i) => (
              <p key={i} className="text-sm whitespace-pre-wrap">{line}</p>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Button size="sm" onClick={handleNote}>记一下</Button>
            <Button size="sm" variant="outline" onClick={() => setShowQuestions(!showQuestions)}>
              提问建议
            </Button>
          </div>
          {showQuestions && (
            <ul className="mt-2 space-y-2 border rounded-lg p-3">
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
        <div className="border-t border-border p-2 text-xs text-muted-foreground">
          Live Summary: 讨论产品定位 deck、定价更新、下周二跟进会议、竞品数据分享。
        </div>
      </div>

      {showEndConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-sm">
            <p className="font-medium">确定结束会议？</p>
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
