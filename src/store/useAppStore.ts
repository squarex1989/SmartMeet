import { create } from "zustand";
import type { ConversationId } from "@/data/chats";

export type AppTab = "calendar" | "chat" | "doc" | "inbox" | "advisors";

interface AppState {
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;

  // Chat
  activeConversationId: ConversationId | null;
  setActiveConversationId: (id: ConversationId | null) => void;

  // Calendar
  selectedDate: string; // YYYY-MM-DD
  selectedEventId: string | null;
  setSelectedDate: (date: string) => void;
  setSelectedEventId: (id: string | null) => void;

  // Doc
  openDocumentId: string | null;
  setOpenDocumentId: (id: string | null) => void;

  // Inbox - pending count for badge
  inboxPendingCount: number;
  setInboxPendingCount: (n: number) => void;

  // Active meeting tabs (temporary tabs in nav)
  activeMeetings: { id: string; title: string; href: string; ongoing?: boolean; docMode?: boolean }[];
  addActiveMeeting: (meeting: { id: string; title: string; href: string; ongoing?: boolean; docMode?: boolean }) => void;
  removeActiveMeeting: (id: string) => void;

  // Alex followup script progress (for Chat view)
  alexFollowupStepIndex: number;
  setAlexFollowupStepIndex: (n: number) => void;
  alexSlidesGenerated: boolean;
  setAlexSlidesGenerated: (v: boolean) => void;

  // Mobile UI
  mobileSidebarOpen: boolean;
  mobileLogOpen: boolean;
  setMobileSidebarOpen: (v: boolean) => void;
  setMobileLogOpen: (v: boolean) => void;

  // Reset for "重新开始 Demo"
  reset: () => void;
}

const defaultState = {
  currentTab: "calendar" as AppTab,
  activeConversationId: null as ConversationId | null,
  selectedDate: "2026-02-09",
  selectedEventId: null as string | null,
  openDocumentId: null as string | null,
  inboxPendingCount: 4,
  activeMeetings: [] as { id: string; title: string; href: string; ongoing?: boolean; docMode?: boolean }[],
  alexFollowupStepIndex: 0,
  alexSlidesGenerated: false,
  mobileSidebarOpen: false,
  mobileLogOpen: false,
};

export const useAppStore = create<AppState>((set) => ({
  ...defaultState,

  setCurrentTab: (tab) => set({ currentTab: tab }),

  setActiveConversationId: (id) => set({ activeConversationId: id }),

  setSelectedDate: (date) => set({ selectedDate: date, selectedEventId: null }),

  setSelectedEventId: (id) => set({ selectedEventId: id }),

  setOpenDocumentId: (id) => set({ openDocumentId: id }),

  setInboxPendingCount: (n) => set({ inboxPendingCount: n }),

  addActiveMeeting: (meeting) =>
    set((s) => ({
      activeMeetings: s.activeMeetings.some((m) => m.id === meeting.id)
        ? s.activeMeetings.map((m) => m.id === meeting.id ? { ...m, ...meeting } : m)
        : [...s.activeMeetings, meeting],
    })),
  removeActiveMeeting: (id) =>
    set((s) => ({ activeMeetings: s.activeMeetings.filter((m) => m.id !== id) })),

  setAlexFollowupStepIndex: (n) => set({ alexFollowupStepIndex: n }),

  setAlexSlidesGenerated: (v) => set({ alexSlidesGenerated: v }),

  setMobileSidebarOpen: (v) => set({ mobileSidebarOpen: v }),
  setMobileLogOpen: (v) => set({ mobileLogOpen: v }),

  reset: () => set(defaultState),
}));
