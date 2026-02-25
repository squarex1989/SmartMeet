import type { TopicId } from "./topics";

export type TodoPriority = "high" | "medium" | "low";
export type TodoStatus = "pending" | "in_progress" | "done";

export interface TodoItem {
  id: string;
  topicId: TopicId;
  title: string;
  summary: string;
  priority: TodoPriority;
  dueDate?: string;
  aiAssistable: boolean;
  /** Pre-filled prompt when user clicks "AI Assist" */
  aiPrompt?: string;
}

export const todoItems: TodoItem[] = [
  {
    id: "todo-1",
    topicId: "techvision",
    title: "Review Pitch Deck 第 7 页竞品数据",
    summary: "确认竞品对比分析的准确性，补充缺失维度",
    priority: "high",
    dueDate: "2026-02-25T18:00:00",
    aiAssistable: true,
    aiPrompt: "帮我审阅 TechVision Pitch Deck 第 7 页的竞品数据，检查是否有遗漏或不准确之处",
  },
  {
    id: "todo-2",
    topicId: "techvision",
    title: "回复 Lisa 关于会员运营数据的邮件",
    summary: "Lisa 上周发了邮件询问会员运营数据细节",
    priority: "medium",
    dueDate: "2026-02-25T12:00:00",
    aiAssistable: true,
    aiPrompt: "帮我起草回复 Lisa 的邮件，关于会员运营数据的问题",
  },
];

export const getTodosByTopic = (topicId: TopicId): TodoItem[] =>
  todoItems.filter((t) => t.topicId === topicId);

export const getTodosForContext = (context: "all" | TopicId): TodoItem[] => {
  if (context === "all") return todoItems;
  return todoItems.filter((t) => t.topicId === context);
};
