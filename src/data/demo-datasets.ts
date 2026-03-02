import type { DemoScenario } from "@/store/useAppStore";
import type { TopicId } from "./topics";
import { reviewItems, type ReviewItem } from "./review-items";
import { todoItems, type TodoItem } from "./todo-items";
import { decisionItems, type DecisionItem } from "./decision-items";

type ScenarioId = Exclude<DemoScenario, null>;

export interface DemoDataset {
  reviewItems: ReviewItem[];
  todoItems: TodoItem[];
  decisionItems: DecisionItem[];
}

const reviewById = Object.fromEntries(reviewItems.map((i) => [i.id, i])) as Record<string, ReviewItem>;
const todoById = Object.fromEntries(todoItems.map((i) => [i.id, i])) as Record<string, TodoItem>;
const decisionById = Object.fromEntries(decisionItems.map((i) => [i.id, i])) as Record<string, DecisionItem>;

const rv = (id: string, status: ReviewItem["status"] = "pending_review"): ReviewItem => ({
  ...reviewById[id],
  status,
});

const td = (id: string): TodoItem => ({ ...todoById[id] });
const dc = (id: string): DecisionItem => ({ ...decisionById[id] });

const emptyDataset: DemoDataset = {
  reviewItems: [],
  todoItems: [],
  decisionItems: [],
};

const scenarioDatasets: Record<ScenarioId, DemoDataset> = {
  "pre-meeting": {
    reviewItems: [rv("ri-1"), rv("ri-2"), rv("ri-3")],
    todoItems: [td("todo-1")],
    decisionItems: [],
  },
  "custom-workflow": {
    reviewItems: [rv("ri-1"), rv("ri-3")],
    todoItems: [],
    decisionItems: [],
  },
  "task-identify": {
    reviewItems: [rv("ri-1"), rv("ri-2"), rv("ri-3")],
    todoItems: [td("todo-1"), td("todo-2")],
    decisionItems: [dc("dec-1")],
  },
  "risk-alert": {
    reviewItems: [rv("ri-2"), rv("ri-3")],
    todoItems: [td("todo-2")],
    decisionItems: [dc("dec-2")],
  },
  "qa-task": {
    reviewItems: [rv("ri-1"), rv("ri-2")],
    todoItems: [td("todo-1"), td("todo-2")],
    decisionItems: [dc("dec-1"), dc("dec-2")],
  },
  "daily-brief": {
    reviewItems: [rv("ri-3")],
    todoItems: [],
    decisionItems: [],
  },
  "goal-driven": {
    reviewItems: [rv("ri-1")],
    todoItems: [td("todo-1")],
    decisionItems: [dc("dec-1")],
  },
  "inbox-mgmt": {
    reviewItems: [rv("ri-3"), rv("ri-6", "pending_review")],
    todoItems: [td("todo-2")],
    decisionItems: [],
  },
  "smart-bookmark": {
    reviewItems: [rv("ri-10")],
    todoItems: [],
    decisionItems: [],
  },
};

export function getDatasetForScenario(activeScenario: DemoScenario): DemoDataset {
  if (!activeScenario) return emptyDataset;
  return scenarioDatasets[activeScenario] ?? emptyDataset;
}

export function getScenarioReviewItems(
  activeScenario: DemoScenario,
  context: "all" | TopicId
): ReviewItem[] {
  const list = getDatasetForScenario(activeScenario).reviewItems;
  if (context === "all") return list;
  return list.filter((r) => r.topicId === context);
}

export function getScenarioTodoItems(
  activeScenario: DemoScenario,
  context: "all" | TopicId
): TodoItem[] {
  const list = getDatasetForScenario(activeScenario).todoItems;
  if (context === "all") return list;
  return list.filter((t) => t.topicId === context);
}

export function getScenarioDecisionItems(
  activeScenario: DemoScenario,
  context: "all" | TopicId
): DecisionItem[] {
  const list = getDatasetForScenario(activeScenario).decisionItems;
  if (context === "all") return list;
  return list.filter((d) => d.topicId === context);
}

export function getScenarioPendingByTopic(
  activeScenario: DemoScenario,
  topicId: TopicId
): number {
  return getDatasetForScenario(activeScenario).reviewItems.filter(
    (r) => r.topicId === topicId && r.status === "pending_review"
  ).length;
}

export function getScenarioPendingTotal(activeScenario: DemoScenario): number {
  return getDatasetForScenario(activeScenario).reviewItems.filter(
    (r) => r.status === "pending_review"
  ).length;
}

