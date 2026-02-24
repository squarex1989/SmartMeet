基于 muse.md 制作的产品有几个明显的问题，我们需要在新版本里 fix，所以我写了 muse2.md

1. 用户配置 assistant 太复杂。我们现在尝试把多 assistant 的概念移除，每个用户只一个 assistant，只能和这个 assistant 对话
2. 用户可以建立多个 topic，每个 topic 指向一个项目、一个客户或者一个想要实现或达成的目标。

以下是需求细节

# 📘 Shadow PRD v1.0

**Product: Shadow – AI-native Work Operating System**

---

# 1 产品愿景

## 一句话

> Shadow works while you work.

## 核心理念

Shadow 不是聊天机器人。
Shadow 是一个观察、准备、执行并持续学习用户工作方式的 AI 工作操作系统。

---

# 2 用户画像

## Primary Persona

**Sarah**

* 独立顾问 / 市场策略顾问
* 管理 5–10 个客户
* 每周 10–20 场会议
* 使用 Calendar + Email + CRM + Docs
* 痛点：

  * 会后整理耗时
  * follow-up 容易漏
  * 多客户切换负担大
  * 信息散落

---

# 3 核心价值主张

Shadow 提供三类能力：

1️⃣ 自动执行（会后纪要 / CRM 更新 / follow-up）
2️⃣ 定期生成（周报 / 汇总）
3️⃣ 结构化组织（Workspace 图结构）

---

# 4 信息架构

```id="tsv0p7"
Shadow
   ├── Marketing Site
   └── App
       ├── Dashboard (Global Work Queue)
       ├── Workspaces
       │     └── Workspace Detail
       ├── Automations
       ├── Insights
       └── Settings
```

---

# 5 官网（Marketing Site）

## 目标

建立认知：Shadow ≠ ChatGPT
Shadow = AI 工作系统

---

## 页面结构

### Hero

标题：

> Your second self at work.

副标题：

> Shadow observes your meetings, drafts your follow-ups, updates your CRM, and learns how you operate.

CTA：

> Try Shadow
> Connect your calendar and see it in action

---

### Section 1：Before / During / After

Before
→ Prepares agenda, research, context

After
→ Writes notes, extracts follow-ups, drafts emails

Continuous
→ Detects risks and trends

---

### Section 2：How it works

1. Connect your tools
2. Shadow observes
3. Shadow prepares drafts
4. You review and approve

---

### Footer CTA

> Stop managing tasks. Start reviewing outcomes.

---

# 6 注册后体验

---

## Step 1：连接工具

页面标题：

> Let Shadow observe your work.

说明：

> Shadow works best when it understands your meetings and emails.

选项：

☑ Connect Calendar (recommended)
☐ Connect Email
☐ Connect CRM

按钮：

> Continue

---

## Step 2：即时产出（不能等待会议）

如果已连接 Calendar：

自动分析过去 7 天会议。

页面展示：

> Shadow found 5 recent meetings.
> Generating notes and follow-ups…

展示草稿卡片。

---

# 7 Dashboard（核心入口）

## 目标

成为每天的默认入口。

---

## 页面结构

### Section A：Pending Review

显示：

* Meeting Notes (Draft)
* CRM Update Suggestion
* Weekly Report (Draft)

---

### Section B：Ready to Execute

* Follow-up: Schedule next meeting
* Follow-up: Generate deck

---

### Section C：Signals

* 2 overdue follow-ups
* Response delay increased

---

## 默认文案

> Shadow has prepared 3 items for your review.

---

# 8 第一次会议 → 自动触发逻辑

---

## 触发条件

Meeting Event.status = ended

---

## 系统执行

* Generate meeting notes (draft)
* Extract follow-ups
* Generate CRM update suggestion

---

## Dashboard 展示

> TechVision – Strategy Sync
> Notes ready for review
> 3 follow-ups identified

按钮：

> Review

---

# 9 Workspace（Topic）

---

## Workspace 创建触发

条件：

* 同一域名会议 ≥ 2 次
  OR
* 用户点击 “Create workspace”

---

## 创建提示文案

> It looks like you’re working with TechVision regularly.
> Create a workspace to organize everything?

---

## Workspace 页面结构

```id="6u9s4k"
Header (Name + Stats)

Tabs:
• Overview
• Outputs
• Insights
• Automations
• Related
```

---

## Overview 页面

显示：

* Recent meetings
* Open follow-ups
* Draft artifacts
* Active rules

---

# 10 Automations（规则）

---

## 默认 Global Automations

* After meeting → Generate notes (review required)
* After meeting → Suggest CRM update (review required)
* After meeting → Extract follow-ups

---

## Workspace Override

例如：

TechVision：

* Email tone: concise
* Notes ready within 30 min

---

## 规则建议触发

条件：

* 用户重复编辑同字段 ≥ 3 次

提示：

> You often shorten emails for this workspace.
> Apply this as default?

---

# 11 Schedules（时间触发）

---

## 周报触发建议

条件：

Meetings_per_week ≥ 2

提示：

> Would you like a weekly brief every Friday at 5pm?

---

## 生成结果

Weekly Report (Draft)
Status: pending_review

---

# 12 Insights（信号）

---

## 触发条件示例

* Email response time increase > threshold
* Follow-up overdue > 5 days
* Negative sentiment detected

---

## 显示规则

只展示高置信度风险。

默认文案：

> Shadow noticed a delay in response from CTO.

---

# 13 10+ Workspaces 情况

---

## 防止失控策略

1️⃣ Global Dashboard 统一入口
2️⃣ Workspace 默认继承规则
3️⃣ Override 限制 ≤ 3 条
4️⃣ Insights 高阈值

---

## 左侧导航

Clients (6)
Projects (3)
Goals (2)

支持分组。

---

# 14 Workspace 图结构（底层）

---

## UI 表现

Workspace 页面底部：

Related Workspaces:

• Fundraising 2026
• AI Positioning

点击进入。

---

## 不展示复杂图谱（MVP）

---

# 15 关键状态流

```id="rlt4ec"
draft → pending_review → approved → executed
```

---

# 16 非目标（避免失控）

Shadow 不支持：

* 生活类订阅（天气、体育）
* 实时聊天 AI
* 多人格助手
* 手动编写复杂条件规则

---

# 17 MVP 范围

必须实现：

* Dashboard
* Workspace
* Event-based automation
* Review gate
* Weekly schedule
* Insight detection（基础版）

---

# 18 成功指标

* 会议后 review 完成率 ≥ 60%
* 7 天留存 ≥ 40%
* 至少创建 2 个 workspace ≥ 50%

---

# 19 长期演进

Phase 2：

* 图结构增强
* 跨 workspace 影响分析
* 批量规则模板

Phase 3：

* 团队协作
* 共享 workspace
* 角色权限

---

# 20 产品核心原则总结

1️⃣ 用户管理工作，不管理 AI
2️⃣ 规则从行为中长出
3️⃣ Dashboard 是主入口
4️⃣ Workspace 是深层空间
5️⃣ 图结构在底层存在

---

# 最终一句话体验

> Shadow watches your work.
> Prepares outcomes.
> You review.
> Shadow executes.
