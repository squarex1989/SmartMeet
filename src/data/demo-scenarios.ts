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
    label: "会前自动准备",
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
    label: "自定义工作流",
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
    label: "主动识别任务",
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
            text: "**识别到的任务：**\n\n1. 📄 **更新产品定位 Deck** — Tom 要求下周三董事会前完成，需突出 AI 差异化（已放入 Prepared for you）\n2. 📧 **回复 Lisa 会员运营数据邮件** — Lisa 会上追问了具体数据维度（已加入 Your follow-ups）\n3. 📊 **竞品数据校验** — Pitch Deck 第 7 页数据需要更新确认（已加入 Your follow-ups）\n\n会议纪要和 CRM 更新已放在右侧 Work Panel，请 review。",
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
    label: "主动提醒风险",
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
    label: "问答与发起任务",
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
              { name: "客户", from: "TechVision", to: "RetailMax" },
              { name: "阶段", from: "需求对接", to: "策略深化" },
              { name: "健康度", from: "⚡ 活跃", to: "✅ 良好" },
              { name: "下一步", from: "产品定位 Deck", to: "执行策略方案" },
              { name: "风险", from: "时间窗口紧", to: "无" },
            ],
          },
          {
            type: "text",
            text: "CloudFlow 单独列出，因为状态需要特别关注：",
          },
          {
            type: "crm_preview",
            crmFields: [
              { name: "客户", from: "CloudFlow", to: "" },
              { name: "阶段", from: "续约谈判", to: "" },
              { name: "健康度", from: "⚠️ 风险", to: "" },
              { name: "下一步", from: "发送续约提案", to: "" },
              { name: "风险", from: "沟通频率下降 + 逾期", to: "" },
            ],
          },
        ],
        createdAt: "2026-02-24T11:02:30",
      },
      {
        id: "demo-qa-5",
        topicId: "global",
        role: "user",
        content: [{ type: "text", text: "帮我给 CloudFlow 的 James 写一封关怀邮件，重新建立联系" }],
        createdAt: "2026-02-24T11:05:00",
      },
      {
        id: "demo-qa-6",
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
        createdAt: "2026-02-24T11:05:30",
      },
    ],
  },
];

export const getScenarioById = (id: DemoScenario): ScenarioConfig | undefined =>
  demoScenarios.find((s) => s.id === id);
