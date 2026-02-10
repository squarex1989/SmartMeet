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

  // Alex followup script progress (for Chat view)
  alexFollowupStepIndex: number;
  setAlexFollowupStepIndex: (n: number) => void;
  alexSlidesGenerated: boolean;
  setAlexSlidesGenerated: (v: boolean) => void;

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
  alexFollowupStepIndex: 0,
  alexSlidesGenerated: false,
};

export const useAppStore = create<AppState>((set) => ({
  ...defaultState,

  setCurrentTab: (tab) => set({ currentTab: tab }),

  setActiveConversationId: (id) => set({ activeConversationId: id }),

  setSelectedDate: (date) => set({ selectedDate: date, selectedEventId: null }),

  setSelectedEventId: (id) => set({ selectedEventId: id }),

  setOpenDocumentId: (id) => set({ openDocumentId: id }),

  setInboxPendingCount: (n) => set({ inboxPendingCount: n }),

  setAlexFollowupStepIndex: (n) => set({ alexFollowupStepIndex: n }),

  setAlexSlidesGenerated: (v) => set({ alexSlidesGenerated: v }),

  reset: () => set(defaultState),
}));
