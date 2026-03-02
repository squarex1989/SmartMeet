import type { ChatMessage } from "./chat-messages";
import type { DemoScenario } from "@/store/useAppStore";

export interface ScenarioConfig {
  id: DemoScenario;
  label: string;
  description: string;
  targetTopic: "global" | string;
  messages: ChatMessage[];
}

export const demoScenarios: ScenarioConfig[] = [
  {
    id: "pre-meeting",
    label: "1. 会前自动准备",
    description: "AI 识别会议并提前准备材料",
    targetTopic: "global",
    messages: [
      {
        id: "demo-pm-1",
        topicId: "global",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "我检测到你的日历中有 3 场即将到来的会议，正在为你做准备工作...",
          },
          { type: "status_update", text: "正在调研 TechVision 客户背景...", statusIcon: "loading" },
          { type: "status_update", text: "正在生成 RetailMax 工作坊 Agenda...", statusIcon: "loading" },
          { type: "status_update", text: "正在整理 CloudFlow 续约资料...", statusIcon: "loading" },
        ],
        createdAt: "2026-02-24T07:55:00",
      },
      {
        id: "demo-pm-2",
        topicId: "global",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "准备工作已完成！以下是今天的会议和我准备的材料：",
          },
          { type: "status_update", text: "TechVision 客户背景调研 ✓", statusIcon: "success" },
          { type: "status_update", text: "TechVision 需求访谈 Agenda ✓", statusIcon: "success" },
          { type: "status_update", text: "RetailMax 营销策略工作坊 Agenda ✓", statusIcon: "success" },
          { type: "status_update", text: "CloudFlow 续约沟通材料 ✓", statusIcon: "success" },
        ],
        createdAt: "2026-02-24T08:10:00",
      },
      {
        id: "demo-pm-3",
        topicId: "global",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "今天的会议安排如下：",
          },
          {
            type: "meeting_list",
            meetings: [
              {
                eventId: "m1",
                title: "TechVision 需求访谈",
                time: "10:00 — 11:00",
                topicId: "techvision",
                status: "ready",
                statusText: "Agenda 和客户 research 已就绪",
                prepDocs: [
                  { docId: "doc-agenda-techvision", docTitle: "需求访谈 Agenda" },
                  { docId: "doc-meeting-notes-techvision", docTitle: "客户背景 Research" },
                ],
              },
              {
                eventId: "m2",
                title: "RetailMax 营销策略工作坊",
                time: "14:00 — 15:30",
                topicId: "retailmax",
                status: "ready",
                statusText: "Agenda 和策略文档已准备好",
                prepDocs: [
                  { docId: "doc-agenda-retailmax", docTitle: "工作坊 Agenda" },
                  { docId: "doc-strategy-retailmax", docTitle: "营销策略文档" },
                ],
              },
              {
                eventId: "m3",
                title: "CloudFlow 续约沟通",
                time: "明天 14:00",
                topicId: "cloudflow",
                status: "upcoming",
                statusText: "续约材料正在准备",
                prepDocs: [
                  { docId: "doc-report-cloudflow", docTitle: "CloudFlow 周报" },
                ],
              },
            ],
          },
        ],
        createdAt: "2026-02-24T08:11:00",
      },
      {
        id: "demo-pm-4",
        topicId: "global",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "针对 10:00 的 TechVision 会议，我额外准备了以下关键信息：\n\n**关键背景：**\n- Tom (CTO) 上次提到希望在下周三董事会前看到产品定位 Deck\n- Lisa 上周发邮件询问了会员运营数据细节\n\n**建议讨论重点：**\n1. AI 功能差异化核心卖点\n2. 董事会融资节奏期望\n3. 竞品分析数据确认\n\n**建议开场白：**\n\"Tom，感谢安排这次访谈。上次你提到希望在董事会前看到产品定位 Deck，今天我们可以先对齐核心需求，确保方向正确。\"",
          },
        ],
        createdAt: "2026-02-24T08:12:00",
      },
    ],
  },
  {
    id: "custom-workflow",
    label: "2. 自定义工作流",
    description: "用自然语言叮嘱 AI 按要求工作",
    targetTopic: "techvision",
    messages: [
      {
        id: "demo-cw-1",
        topicId: "techvision",
        role: "user",
        content: [
          {
            type: "text",
            text: "以后 TechVision 的汇报里以数据为主，Tom 比较看重量化数据",
          },
        ],
        createdAt: "2026-02-24T09:30:00",
      },
      {
        id: "demo-cw-2",
        topicId: "techvision",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "收到，我已更新 TechVision 的 Playbook，后续汇报将优先使用量化数据呈现：",
          },
          {
            type: "playbook_update",
            playbookRule: {
              id: "auto-tv-data",
              description: "汇报内容以量化数据为主",
              trigger: "report_generation",
            },
          },
        ],
        createdAt: "2026-02-24T09:30:30",
      },
      {
        id: "demo-cw-3",
        topicId: "techvision",
        role: "user",
        content: [
          {
            type: "text",
            text: "另外，每次会后纪要需要在 30 分钟内交付，这是 Tom 团队的要求",
          },
        ],
        createdAt: "2026-02-24T09:32:00",
      },
      {
        id: "demo-cw-4",
        topicId: "techvision",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "明白，已更新 Playbook。TechVision 的会议纪要将标记为高优先级：",
          },
          {
            type: "playbook_update",
            playbookRule: {
              id: "auto-5",
              description: "TechVision 纪要 30 分钟内交付",
              trigger: "meeting_ended",
            },
          },
        ],
        createdAt: "2026-02-24T09:32:30",
      },
      {
        id: "demo-cw-5",
        topicId: "techvision",
        role: "user",
        content: [
          {
            type: "text",
            text: "对了，涉及融资的内容做脱敏处理，不要出现在发给客户的材料里",
          },
        ],
        createdAt: "2026-02-24T09:34:00",
      },
      {
        id: "demo-cw-6",
        topicId: "techvision",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "好的，已新增脱敏规则。在生成 TechVision 相关文档时会自动过滤融资敏感内容：",
          },
          {
            type: "playbook_update",
            playbookRule: {
              id: "auto-6",
              description: "TechVision 融资内容脱敏",
              trigger: "meeting_ended",
            },
          },
          {
            type: "text",
            text: "目前 TechVision 的 Playbook 已包含 3 条定制规则，我会严格按照这些要求执行工作。你也可以随时在 Playbook 管理页面查看和编辑。",
          },
        ],
        createdAt: "2026-02-24T09:34:30",
      },
    ],
  },
  {
    id: "task-identify",
    label: "3. 主动识别任务",
    description: "AI 从会议中提取任务并准备执行",
    targetTopic: "techvision",
    messages: [
      {
        id: "demo-ti-1",
        topicId: "techvision",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "TechVision 需求访谈已结束（10:00 — 11:05），我从会议中识别到了以下任务和行动项：",
          },
        ],
        createdAt: "2026-02-24T11:10:00",
      },
      {
        id: "demo-ti-2",
        topicId: "techvision",
        role: "shadow",
        content: [
          { type: "status_update", text: "会议纪要已生成", statusIcon: "success" },
          { type: "status_update", text: "CRM 更新方案已就绪", statusIcon: "success" },
          { type: "status_update", text: "识别到 3 个 follow-up 任务", statusIcon: "success" },
        ],
        createdAt: "2026-02-24T11:10:30",
      },
      {
        id: "demo-ti-3",
        topicId: "techvision",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "**识别到的任务（已加入 Your follow-ups）：**\n\n1. 📄 **更新产品定位 Deck** — Tom 要求下周三董事会前完成，需突出 AI 差异化\n2. 📧 **回复 Lisa 会员运营数据邮件** — Lisa 会上追问了具体数据维度\n3. 📊 **竞品数据校验** — Pitch Deck 第 7 页数据需要更新确认\n\n同时，会议纪要和 CRM 更新已按 Playbook 自动生成，放在 Prepared for you 等你 review。",
          },
        ],
        createdAt: "2026-02-24T11:11:00",
      },
      {
        id: "demo-ti-4",
        topicId: "techvision",
        role: "shadow",
        content: [
          {
            type: "doc_card",
            docId: "doc-meeting-notes-techvision",
            docTitle: "TechVision 需求访谈 — 会议纪要",
          },
          {
            type: "text",
            text: "纪要中提取的关键引用：",
          },
          {
            type: "transcript_quote",
            quote: {
              speaker: "Tom",
              text: "我们需要一份新的产品定位 deck，下周三董事会前给到，重点突出 AI 功能的差异化。",
            },
          },
        ],
        createdAt: "2026-02-24T11:12:00",
      },
    ],
  },
  {
    id: "risk-alert",
    label: "4. 主动提醒风险",
    description: "AI 发现客户互动中的风险点",
    targetTopic: "cloudflow",
    messages: [
      {
        id: "demo-ra-1",
        topicId: "cloudflow",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "我检测到 CloudFlow 续约出现了几个风险信号，建议你关注：",
          },
        ],
        createdAt: "2026-02-24T10:00:00",
      },
      {
        id: "demo-ra-2",
        topicId: "cloudflow",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "**风险分析：**\n\n🔴 **沟通频率下降** — 客户最近两周回复频率下降 40%，上一封邮件等待回复已 5 天\n\n🟡 **Follow-up 逾期** — 有 2 个逾期 follow-up 未处理：\n- 「发送续约提案给客户」逾期 3 天\n- 「更新 CRM 续约状态」逾期 2 天\n\n🟡 **续约窗口收窄** — 合同到期日在 30 天后，按照正常流程需至少 2 周完成续约谈判",
          },
        ],
        createdAt: "2026-02-24T10:00:30",
      },
      {
        id: "demo-ra-3",
        topicId: "cloudflow",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "**建议行动方案：**\n\n1. **立即** — 发送一封关怀邮件，恢复沟通节奏\n2. **本周** — 安排 30 分钟线上沟通，了解客户真实想法\n3. **备选** — 如沟通无果，准备高层拜访方案\n\n需要我帮你起草关怀邮件吗？",
          },
          {
            type: "action_buttons",
            buttons: [
              { label: "帮我起草邮件", action: "draft_email" },
              { label: "先看续约提案", action: "view_proposal" },
            ],
          },
        ],
        createdAt: "2026-02-24T10:01:00",
      },
    ],
  },
  {
    id: "qa-task",
    label: "5. 问答与发起任务",
    description: "通过 Chat 提问和发起工作",
    targetTopic: "global",
    messages: [
      {
        id: "demo-qa-1",
        topicId: "global",
        role: "user",
        content: [{ type: "text", text: "上周所有客户会议的核心结论是什么？" }],
        createdAt: "2026-02-24T11:00:00",
      },
      {
        id: "demo-qa-2",
        topicId: "global",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "上周共有 4 场客户会议，以下是核心结论：\n\n**TechVision（2/20 周四）**\n- 融资路演材料需加速，Tom 对 AI 差异化定位非常重视\n- 下周三董事会是关键节点\n\n**RetailMax（2/19 周三）**\n- CMO Lisa 关注会员运营数据，已纳入策略文档\n- 营销策略工作坊反馈积极\n\n**CloudFlow（2/18 周二）**\n- 续约沟通进展缓慢，客户回复频率下降\n- 需要重新评估报价策略\n\n**Fundraising 内部会（2/21 周五）**\n- Pitch Deck 初稿完成，竞品分析需补充\n- 目标 A 轮 $5M-$8M 已获董事会初步同意",
          },
        ],
        createdAt: "2026-02-24T11:00:30",
      },
      {
        id: "demo-qa-3",
        topicId: "global",
        role: "user",
        content: [{ type: "text", text: "帮我对比一下这三个客户的当前状态" }],
        createdAt: "2026-02-24T11:02:00",
      },
      {
        id: "demo-qa-4",
        topicId: "global",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "以下是三个客户的状态对比：",
          },
          {
            type: "crm_preview",
            crmFields: [
              { name: "", from: "TechVision", to: "RetailMax", col3: "CloudFlow" },
              { name: "阶段", from: "需求对接", to: "策略深化", col3: "续约谈判" },
              { name: "健康度", from: "⚡ 活跃", to: "✅ 良好", col3: "⚠️ 风险" },
              { name: "下一步", from: "产品定位 Deck", to: "执行策略方案", col3: "发送续约提案" },
              { name: "风险", from: "时间窗口紧", to: "无", col3: "沟通频率下降 + 逾期" },
            ],
          },
        ],
        createdAt: "2026-02-24T11:02:30",
      },
      {
        id: "demo-qa-5",
        topicId: "global",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "我注意到 CloudFlow 有续约风险信号。需要我帮你给 CloudFlow 的 James 写一封关怀邮件，重新建立联系吗？",
          },
        ],
        createdAt: "2026-02-24T11:03:00",
      },
      {
        id: "demo-qa-6",
        topicId: "global",
        role: "user",
        content: [{ type: "text", text: "要的" }],
        createdAt: "2026-02-24T11:04:00",
      },
      {
        id: "demo-qa-7",
        topicId: "global",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "好的，我根据 CloudFlow 的沟通历史和当前状况起草了一封邮件：",
          },
          {
            type: "email_preview",
            email: {
              to: "james.chen@cloudflow.io",
              cc: "sarah@company.com",
              subject: "CloudFlow 合作近况 & 下一步",
              body: "Hi James,\n\n好久没有直接沟通了，想和你 sync 一下最近的进展。\n\n上个月我们讨论的几个优化方向，团队这边已经有了初步成果，特别是在自动化部署流程方面的改进，应该能直接帮到你们 Q2 的发布节奏。\n\n方便的话，这周安排 30 分钟聊一下？我可以把最新的方案和数据一起带过来。\n\nBest,\nSarah",
            },
          },
          {
            type: "action_buttons",
            buttons: [
              { label: "确认发送", action: "send_email" },
              { label: "修改内容", action: "edit_email" },
            ],
          },
        ],
        createdAt: "2026-02-24T11:04:30",
      },
    ],
  },
  {
    id: "daily-brief",
    label: "6. 每日资讯简报",
    description: "AI 每天从指定新闻源制作简报",
    targetTopic: "global",
    messages: [
      {
        id: "demo-db-1",
        topicId: "global",
        role: "user",
        content: [
          {
            type: "text",
            text: "我需要你每天早上帮我获取 AI 和 SaaS 领域的行业资讯，做成简报发给我。来源优先用 TechCrunch、The Information 和 36氪。",
          },
        ],
        createdAt: "2026-02-24T08:00:00",
      },
      {
        id: "demo-db-2",
        topicId: "global",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "收到，我会在每个工作日早上 8 点为你生成行业简报。信息来源：TechCrunch、The Information、36氪，聚焦 AI 和 SaaS 领域。\n\n需要我现在就生成今天的简报给你看看吗？",
          },
          {
            type: "playbook_update",
            playbookRule: {
              id: "rule-daily-brief",
              description: "每个工作日 8:00 生成 AI & SaaS 行业简报",
              trigger: "每日定时 · 工作日 8:00",
            },
          },
        ],
        createdAt: "2026-02-24T08:00:30",
      },
      {
        id: "demo-db-3",
        topicId: "global",
        role: "user",
        content: [{ type: "text", text: "要的，现在给我看看" }],
        createdAt: "2026-02-24T08:01:00",
      },
      {
        id: "demo-db-4",
        topicId: "global",
        role: "shadow",
        content: [
          { type: "status_update", text: "正在检索 TechCrunch 最新内容...", statusIcon: "success" },
          { type: "status_update", text: "正在检索 The Information 最新内容...", statusIcon: "success" },
          { type: "status_update", text: "正在检索 36氪 最新内容...", statusIcon: "success" },
          { type: "status_update", text: "正在分析和整理...", statusIcon: "loading" },
        ],
        createdAt: "2026-02-24T08:01:15",
      },
      {
        id: "demo-db-5",
        topicId: "global",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "今日 AI & SaaS 行业简报 — 2026.02.24\n\n🔥 重点关注\n\n1. OpenAI 推出企业级 Agent 平台，支持多步骤工作流自动化，直接对标 ServiceNow 和 Salesforce 的自动化产品线\n→ 与我们的定位高度相关，建议关注其定价策略\n\n2. Anthropic 完成 $3.5B 新一轮融资，估值达 $60B，将重点投入 AI 安全和企业应用\n→ AI 赛道资金持续涌入，投资人情绪积极\n\n3. 36氪报道：国内 3 家 AI Agent 创业公司在过去一个月内完成 A 轮融资，合计超 5 亿人民币\n\n📊 值得留意\n\n4. Salesforce 宣布 Agentforce 2.0，整合 Slack 实现对话式 CRM 操作\n5. Notion 推出 AI 会议纪要功能，自动关联日历和任务\n→ 与 Shadow 的会议准备功能有交集，值得分析差异化\n6. Gartner 发布 2026 AI Hype Cycle，Agent 技术进入 \"Slope of Enlightenment\"",
          },
        ],
        createdAt: "2026-02-24T08:02:00",
      },
    ],
  },
  {
    id: "goal-driven",
    label: "7. 24/7 目标驱动",
    description: "告知 AI 目标，每天帮你推进",
    targetTopic: "global",
    messages: [
      {
        id: "demo-gd-1",
        topicId: "global",
        role: "user",
        content: [
          {
            type: "text",
            text: "我有一个目标：Build partnerships with 5 AI companies this quarter. 帮我推进。",
          },
        ],
        createdAt: "2026-02-24T09:00:00",
      },
      {
        id: "demo-gd-2",
        topicId: "global",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "了解，我来帮你拆解并持续推进这个目标。\n\n当前进度：0 / 5 家合作伙伴\n截止日期：Q1 2026（剩余约 5 周）\n\n我的计划：\n1. 每天为你调研 1-2 家潜在合作 AI 公司的背景\n2. 起草 cold outreach 邮件，你确认后发送\n3. 跟踪每家公司的联络状态\n4. 每周一发送进度汇总",
          },
          {
            type: "playbook_update",
            playbookRule: {
              id: "rule-partnership-goal",
              description: "持续推进「5 家 AI 公司合作」目标，每日调研 + 邮件起草 + 状态跟踪",
              trigger: "每日 · 目标驱动",
            },
          },
        ],
        createdAt: "2026-02-24T09:00:30",
      },
      {
        id: "demo-gd-3",
        topicId: "global",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "今日调研结果 — 推荐 2 家潜在合作公司：\n\n① Cohere — 企业级 LLM API 提供商\n- 与我们的客户群体重合度高（企业 SaaS）\n- 近期推出 RAG 产品线，与 Shadow 的会议准备功能有协同空间\n- 建议合作方向：联合方案（Shadow + Cohere RAG）\n- 联系人：VP of BD - Michael Zhang\n\n② LangChain — AI 开发框架公司\n- 开发者社区 10 万+，品牌影响力强\n- 有官方合作伙伴计划（Partner Program）\n- 建议合作方向：技术集成 + 联合案例\n- 联系人：Partnerships Lead - Sarah Kim",
          },
        ],
        createdAt: "2026-02-24T09:01:00",
      },
      {
        id: "demo-gd-4",
        topicId: "global",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "我已经为 Cohere 起草了一封合作意向邮件：",
          },
          {
            type: "email_preview",
            email: {
              to: "michael.zhang@cohere.com",
              subject: "Partnership Opportunity — Shadow × Cohere",
              body: "Hi Michael,\n\nI'm reaching out from Shadow, an AI-powered work assistant for knowledge workers. We're exploring partnerships with leading AI infrastructure companies, and Cohere's enterprise LLM platform is a natural fit.\n\nSpecifically, I see strong synergy between Shadow's meeting intelligence and Cohere's RAG capabilities — together, we could offer enterprise clients a seamless \"know before you meet\" experience.\n\nWould you be open to a 20-min call this week to explore?\n\nBest,\nSarah",
            },
          },
          {
            type: "action_buttons",
            buttons: [
              { label: "确认发送", action: "send_email" },
              { label: "修改内容", action: "edit_email" },
            ],
          },
        ],
        createdAt: "2026-02-24T09:02:00",
      },
    ],
  },
  {
    id: "inbox-mgmt",
    label: "8. 收件箱管理",
    description: "自动识别重要邮件并起草回复",
    targetTopic: "global",
    messages: [
      {
        id: "demo-im-1",
        topicId: "global",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "你有 3 封需要关注的未读邮件：",
          },
        ],
        createdAt: "2026-02-24T09:30:00",
      },
      {
        id: "demo-im-2",
        topicId: "global",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "📩 重要邮件 #1 — 来自 TechVision CEO Tom\n\n主题：Re: Next Steps on AI Strategy\n\n概要：Tom 确认了下周三的董事会时间，希望在会前收到产品定位 Deck 的终稿。他特别提到竞品对比部分需要加上市场数据支撑。\n\n我已经准备好了回复草稿 ↓",
          },
          {
            type: "email_preview",
            email: {
              to: "tom@techvision.com",
              subject: "Re: Next Steps on AI Strategy",
              body: "Hi Tom,\n\nThanks for confirming. We'll have the final deck ready by Monday, including updated competitive analysis with Q4 market data.\n\nI'll also prepare a one-page executive summary for the board.\n\nBest,\nSarah",
            },
          },
          {
            type: "action_buttons",
            buttons: [
              { label: "确认发送", action: "send_email" },
              { label: "修改内容", action: "edit_email" },
            ],
          },
        ],
        createdAt: "2026-02-24T09:30:30",
      },
      {
        id: "demo-im-3",
        topicId: "global",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "📩 重要邮件 #2 — 来自 RetailMax CMO Lisa\n\n主题：Workshop Follow-up — Member Data Request\n\n概要：Lisa 请求提供上季度会员运营数据的完整报告，用于她下周的管理层汇报。她还问到了我们是否能支持实时数据看板。\n\n我已经准备好了回复草稿 ↓",
          },
          {
            type: "email_preview",
            email: {
              to: "lisa@retailmax.com",
              subject: "Re: Workshop Follow-up — Member Data Request",
              body: "Hi Lisa,\n\nI'll send the Q4 member analytics report by tomorrow. It will include retention rates, engagement metrics, and cohort analysis.\n\nRegarding the real-time dashboard — yes, we can set that up. I'll prepare a demo for our next call.\n\nBest,\nSarah",
            },
          },
          {
            type: "action_buttons",
            buttons: [
              { label: "确认发送", action: "send_email" },
              { label: "修改内容", action: "edit_email" },
            ],
          },
        ],
        createdAt: "2026-02-24T09:31:00",
      },
      {
        id: "demo-im-4",
        topicId: "global",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "📩 重要邮件 #3 — 来自投资人 David（Sequoia）\n\n主题：Quick Question on Revenue Model\n\n概要：David 问到了我们的收入模型细节，特别是 per-seat 定价和企业年费方案的区分。这封邮件标记了\"高优先级\"。\n\n⚡ 建议优先回复 — 投资人邮件的平均理想响应时间在 4 小时内。",
          },
          {
            type: "action_buttons",
            buttons: [
              { label: "帮我起草回复", action: "draft_email" },
              { label: "先看完整邮件", action: "view_proposal" },
            ],
          },
        ],
        createdAt: "2026-02-24T09:31:30",
      },
    ],
  },
  {
    id: "smart-bookmark",
    label: "9. 智能收藏与灵感",
    description: "收藏内容，AI 主动关联分析",
    targetTopic: "global",
    messages: [
      {
        id: "demo-sb-1",
        topicId: "global",
        role: "user",
        content: [
          {
            type: "text",
            text: "https://hbr.org/2026/01/how-ai-agents-are-reshaping-enterprise-workflows",
          },
        ],
        createdAt: "2026-02-23T14:00:00",
      },
      {
        id: "demo-sb-2",
        topicId: "global",
        role: "shadow",
        content: [
          { type: "status_update", text: "正在阅读文章内容...", statusIcon: "success" },
          {
            type: "text",
            text: "已收藏。这篇 HBR 文章讨论了 AI Agent 如何改变企业工作流：\n\n核心观点：\n• 2026 年企业对 AI Agent 的采用率预计增长 300%\n• 最大价值不在「自动化」而在「预判」— 在人需要之前准备好信息\n• 风险：Agent 的「自主决策边界」尚未被企业清晰定义",
          },
        ],
        createdAt: "2026-02-23T14:00:30",
      },
      {
        id: "demo-sb-3",
        topicId: "global",
        role: "user",
        content: [
          {
            type: "text",
            text: "https://a16z.com/ai-agent-market-map-2026/",
          },
        ],
        createdAt: "2026-02-23T15:00:00",
      },
      {
        id: "demo-sb-4",
        topicId: "global",
        role: "shadow",
        content: [
          { type: "status_update", text: "正在阅读文章内容...", statusIcon: "success" },
          {
            type: "text",
            text: "已收藏。a16z 的 AI Agent 市场全景图（2026 版）：\n\n核心信息：\n• 将 AI Agent 分为 5 大类：个人助手、销售、工程、客服、运营\n• 「AI Staff Engineer」和「AI Account Executive」是增长最快的两个方向\n• Shadow 所在的「AI Work Assistant」类别被列入「Ones to Watch」",
          },
        ],
        createdAt: "2026-02-23T15:00:30",
      },
      {
        id: "demo-sb-5",
        topicId: "global",
        role: "user",
        content: [
          {
            type: "text",
            text: "https://twitter.com/sama/status/1892847562893",
          },
        ],
        createdAt: "2026-02-23T20:00:00",
      },
      {
        id: "demo-sb-6",
        topicId: "global",
        role: "shadow",
        content: [
          { type: "status_update", text: "正在阅读内容...", statusIcon: "success" },
          {
            type: "text",
            text: "已收藏。Sam Altman 的推文核心：\"The best AI products in 2026 won't be chatbots — they'll be agents that work alongside you, anticipating what you need before you ask.\"",
          },
        ],
        createdAt: "2026-02-23T20:00:30",
      },
      {
        id: "demo-sb-7",
        topicId: "global",
        role: "shadow",
        content: [
          {
            type: "text",
            text: "💡 基于你最近收藏的 3 篇内容，我发现了一些有趣的关联：\n\n趋势洞察：AI Agent 从「工具」到「同事」\n\n你收藏的内容指向同一个方向：2026 年市场正在从「AI 作为工具」转向「AI 作为协作者」。具体表现在：\n\n1. HBR 文章强调「预判」价值 → 这正是 Shadow 的核心能力（会前准备、风险预警）\n2. a16z 市场图把 Shadow 类产品列入「Ones to Watch」→ 市场认知正在建立\n3. Sam Altman 的表态与我们的产品方向高度一致 → 可用于融资叙事\n\n建议行动：\n• 把这个「从工具到同事」的叙事加入 Pitch Deck 的市场定位部分\n• 引用 HBR 数据（300% 增长率）作为 TAM 论据\n• a16z 的市场全景图可以放在竞品分析页",
          },
          {
            type: "action_buttons",
            buttons: [
              { label: "更新 Pitch Deck", action: "draft_email" },
              { label: "继续分析", action: "view_proposal" },
            ],
          },
        ],
        createdAt: "2026-02-24T08:00:00",
      },
    ],
  },
];

export const getScenarioById = (id: DemoScenario): ScenarioConfig | undefined =>
  demoScenarios.find((s) => s.id === id);
