import { create } from "zustand";
import type { TopicId } from "@/data/topics";

export type MainView = "command-room" | "calendar" | "docs" | "automations";
export type CommandRoomOverlay = null | "review" | "insights" | "automations";
export type CalendarRange = "day" | "week";

interface AppState {
  // Top-level view (controls entire layout below TopBar)
  mainView: MainView;
  setMainView: (view: MainView) => void;

  // Context (Command Room only)
  currentContext: "all" | TopicId;
  setCurrentContext: (ctx: "all" | TopicId) => void;

  // Command Room overlay (covers Chat Area, Work Panel stays visible)
  commandRoomOverlay: CommandRoomOverlay;
  setCommandRoomOverlay: (overlay: CommandRoomOverlay) => void;
  activeReviewItemId: string | null;
  setActiveReviewItemId: (id: string | null) => void;

  // Work Panel
  workPanelOpen: boolean;
  setWorkPanelOpen: (v: boolean) => void;

  // Chat
  chatInputValue: string;
  setChatInputValue: (v: string) => void;
  collapsedSessions: Record<string, boolean>;
  toggleSessionCollapse: (dateKey: string) => void;

  // Calendar
  calendarDate: string;
  calendarRange: CalendarRange;
  selectedEventId: string | null;
  setCalendarDate: (date: string) => void;
  setCalendarRange: (range: CalendarRange) => void;
  setSelectedEventId: (id: string | null) => void;

  // Docs
  openDocumentId: string | null;
  setOpenDocumentId: (id: string | null) => void;
  docSearchQuery: string;
  setDocSearchQuery: (q: string) => void;
  docTypeFilter: string;
  setDocTypeFilter: (t: string) => void;
  docTopicFilter: TopicId[];
  setDocTopicFilter: (topics: TopicId[]) => void;

  // Mobile UI
  mobileSidebarOpen: boolean;
  mobileWorkPanelOpen: boolean;
  setMobileSidebarOpen: (v: boolean) => void;
  setMobileWorkPanelOpen: (v: boolean) => void;

  // Onboarding
  onboardingComplete: boolean;
  setOnboardingComplete: (v: boolean) => void;

  // Guided Tour
  tourActive: boolean;
  tourStep: number;
  showTourHint: boolean;
  setTourActive: (v: boolean) => void;
  setTourStep: (n: number) => void;
  setShowTourHint: (v: boolean) => void;

  // Review item status mutations (mock)
  reviewItemStatuses: Record<string, string>;
  setReviewItemStatus: (id: string, status: string) => void;

  reset: () => void;
}

const defaultState = {
  mainView: "command-room" as MainView,
  currentContext: "all" as "all" | TopicId,
  commandRoomOverlay: null as CommandRoomOverlay,
  activeReviewItemId: null as string | null,
  workPanelOpen: true,
  chatInputValue: "",
  collapsedSessions: {} as Record<string, boolean>,
  calendarDate: "2026-02-24",
  calendarRange: "day" as CalendarRange,
  selectedEventId: null as string | null,
  openDocumentId: null as string | null,
  docSearchQuery: "",
  docTypeFilter: "all",
  docTopicFilter: [] as TopicId[],
  mobileSidebarOpen: false,
  mobileWorkPanelOpen: false,
  onboardingComplete: false,
  tourActive: false,
  tourStep: 0,
  showTourHint: false,
  reviewItemStatuses: {} as Record<string, string>,
};

export const useAppStore = create<AppState>((set) => ({
  ...defaultState,

  setMainView: (view) => set({ mainView: view }),

  setCurrentContext: (ctx) =>
    set({ currentContext: ctx, commandRoomOverlay: null }),

  setCommandRoomOverlay: (overlay) => set({ commandRoomOverlay: overlay }),

  setActiveReviewItemId: (id) => set({ activeReviewItemId: id }),

  setWorkPanelOpen: (v) => set({ workPanelOpen: v }),

  setChatInputValue: (v) => set({ chatInputValue: v }),

  toggleSessionCollapse: (dateKey) =>
    set((s) => ({
      collapsedSessions: {
        ...s.collapsedSessions,
        [dateKey]: !s.collapsedSessions[dateKey],
      },
    })),

  setCalendarDate: (date) => set({ calendarDate: date, selectedEventId: null }),
  setCalendarRange: (range) => set({ calendarRange: range }),
  setSelectedEventId: (id) => set({ selectedEventId: id }),

  setOpenDocumentId: (id) => set({ openDocumentId: id }),
  setDocSearchQuery: (q) => set({ docSearchQuery: q }),
  setDocTypeFilter: (t) => set({ docTypeFilter: t }),
  setDocTopicFilter: (topics) => set({ docTopicFilter: topics }),

  setMobileSidebarOpen: (v) => set({ mobileSidebarOpen: v }),
  setMobileWorkPanelOpen: (v) => set({ mobileWorkPanelOpen: v }),

  setOnboardingComplete: (v) => set({ onboardingComplete: v }),

  setTourActive: (v) => set({ tourActive: v, tourStep: 0 }),
  setTourStep: (n) => set({ tourStep: n }),
  setShowTourHint: (v) => set({ showTourHint: v }),

  setReviewItemStatus: (id, status) =>
    set((s) => ({
      reviewItemStatuses: { ...s.reviewItemStatuses, [id]: status },
    })),

  reset: () => set(defaultState),
}));
