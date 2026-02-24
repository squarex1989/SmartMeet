import type { TopicId } from "./topics";

export type DocumentId = string;

export interface DocumentMeta {
  id: DocumentId;
  title: string;
  topicId: TopicId;
  type: "notes" | "agenda" | "report" | "strategy" | "slides" | "proposal";
  updatedAt: string;
  pageCount?: number;
}

export interface DocumentContent {
  id: DocumentId;
  body: string;
  trackChanges?: TrackChange[];
}

export interface TrackChange {
  id: string;
  type: "insert" | "delete" | "replace";
  afterText?: string;
  newFragment?: string;
  oldText?: string;
  oldTextReplace?: string;
  newTextReplace?: string;
}

export const documentsMeta: DocumentMeta[] = [
  {
    id: "doc-agenda-techvision",
    title: "TechVision 需求访谈 - Agenda",
    topicId: "techvision",
    type: "agenda",
    updatedAt: "2026-02-24T08:30:00",
  },
  {
    id: "doc-meeting-notes-techvision",
    title: "TechVision 客户背景 Research",
    topicId: "techvision",
    type: "notes",
    updatedAt: "2026-02-24T08:30:00",
  },
  {
    id: "doc-slides-techvision",
    title: "TechVision 产品定位 Deck (Draft)",
    topicId: "techvision",
    type: "slides",
    updatedAt: "2026-02-24T11:00:00",
    pageCount: 8,
  },
  {
    id: "doc-proposal-techvision",
    title: "TechVision Proposal - 定价方案",
    topicId: "techvision",
    type: "proposal",
    updatedAt: "2026-02-24T11:10:00",
  },
  {
    id: "doc-agenda-retailmax",
    title: "RetailMax 营销策略工作坊 - Agenda",
    topicId: "retailmax",
    type: "agenda",
    updatedAt: "2026-02-23T18:00:00",
  },
  {
    id: "doc-report-cloudflow",
    title: "CloudFlow 周报 - 2026.02.24",
    topicId: "cloudflow",
    type: "report",
    updatedAt: "2026-02-24T08:00:00",
  },
  {
    id: "doc-strategy-retailmax",
    title: "RetailMax 营销策略文档",
    topicId: "retailmax",
    type: "strategy",
    updatedAt: "2026-02-21T14:00:00",
  },
  {
    id: "doc-pitch-deck",
    title: "Fundraising 2026 - Pitch Deck (Draft)",
    topicId: "fundraising",
    type: "slides",
    updatedAt: "2026-02-24T07:30:00",
    pageCount: 12,
  },
  {
    id: "doc-financial-model",
    title: "Financial Model - 2026 Q1 Update",
    topicId: "fundraising",
    type: "report",
    updatedAt: "2026-02-23T16:00:00",
  },
  {
    id: "doc-market-analysis",
    title: "AI 市场分析报告 - 2026",
    topicId: "ai-positioning",
    type: "report",
    updatedAt: "2026-02-24T07:45:00",
  },
  {
    id: "doc-ai-positioning-strategy",
    title: "AI 差异化定位策略",
    topicId: "ai-positioning",
    type: "strategy",
    updatedAt: "2026-02-23T10:00:00",
  },
];

const slidesDraftBody = `# TechVision 产品定位 Deck (Draft) - 8 页

## 1. 封面
TechVision - AI 驱动的产品定位

## 2. 市场机会
- 企业 AI 需求增长
- 差异化窗口期

## 3. 产品定位
- 核心价值主张
- 目标客群

## 4. AI 功能差异化
- 与竞品对比
- 技术壁垒

## 5. 竞争格局
- 主要竞品
- 我们的优势

## 6. 路线图
- Q2–Q4 关键里程碑

## 7. 团队与融资
- 核心团队
- 融资进展（脱敏）

## 8. 下一步
- 董事会材料
- 客户试点
`;

const proposalBody = `# TechVision Proposal - 定价方案

## 当前定价
- 标准版：¥X/月
- 专业版：¥Y/月

## 修改建议
- **新增** 企业套餐选项：¥Z/年，含专属成功经理与 SLA。
- 专业版价格微调为 ¥Y'/月。
`;

const agendaTechVisionBody = `# TechVision 需求访谈 - Agenda
**日期**: 2026-02-24 10:00–11:00
**参会**: Sarah, Tom (CTO), Lisa (CMO)

## 1. 开场与近况同步 (5 min)
- 上次沟通以来的进展回顾

## 2. 产品需求深入讨论 (20 min)
- AI 功能差异化核心卖点
- 目标客群定义

## 3. 融资与市场策略 (20 min)
- 董事会时间线与融资节奏
- Lisa 提到的会员运营数据整合

## 4. 竞品分析需求 (10 min)
- 重点关注的竞争对手
- 需要的对比维度

## 5. 下一步与行动项 (5 min)
`;

const clientResearchBody = `# TechVision 客户背景 Research
**更新日期**: 2026-02-24

## 公司概况
TechVision 是一家 AI 驱动的科技创业公司，成立于 2023 年，专注于企业级 AI 解决方案。

## 关键联系人
- **Tom (CTO)**: 技术决策者，关注 AI 功能差异化和技术壁垒
- **Lisa (CMO)**: 市场策略负责人，关注产品定位和品牌认知

## 近期动态
- 正在筹备下周三的董事会，需要产品定位 Deck
- 计划在 Q2 启动新一轮融资
- 希望建立 AI 差异化定位

## CRM 记录摘要
- 客户阶段: 需求调研中
- 上次沟通: 2026-02-05
- 沟通频率: 每两周一次
`;

export const documentsContent: Record<DocumentId, DocumentContent> = {
  "doc-agenda-techvision": {
    id: "doc-agenda-techvision",
    body: agendaTechVisionBody,
  },
  "doc-meeting-notes-techvision": {
    id: "doc-meeting-notes-techvision",
    body: clientResearchBody,
  },
  "doc-slides-techvision": {
    id: "doc-slides-techvision",
    body: slidesDraftBody,
  },
  "doc-proposal-techvision": {
    id: "doc-proposal-techvision",
    body: proposalBody,
    trackChanges: [
      {
        id: "tc1",
        type: "insert",
        afterText: "- 专业版：¥Y/月",
        newFragment: "\n- 企业套餐：¥Z/年，含专属成功经理与 SLA。",
      },
      {
        id: "tc2",
        type: "replace",
        oldTextReplace: "专业版：¥Y/月",
        newTextReplace: "专业版：¥Y'/月（微调）",
      },
    ],
  },
  "doc-agenda-retailmax": {
    id: "doc-agenda-retailmax",
    body: "# RetailMax 营销策略工作坊\n\n1. Q3 目标对齐\n2. 全渠道策略\n3. 会员运营\n4. 下一步",
  },
  "doc-report-cloudflow": {
    id: "doc-report-cloudflow",
    body: "# CloudFlow 周报 2026.02.24\n\n## 上周进展\n- 续约沟通推进\n- 案例整理\n\n## 本周计划\n- 续约材料定稿\n- 客户拜访\n",
  },
  "doc-strategy-retailmax": {
    id: "doc-strategy-retailmax",
    body: "# RetailMax 营销策略\n\n全渠道与品牌增长策略文档。\n\n## 核心策略\n- 全渠道数据打通\n- 会员运营体系\n- 精准投放优化\n\n## 目标\n- Q3 全渠道转化率提升 15%\n- 会员复购率提升 20%\n",
  },
  "doc-pitch-deck": {
    id: "doc-pitch-deck",
    body: `# Fundraising 2026 - Pitch Deck (Draft) — 12 页

## 1. 封面
Company Name — AI-Powered Enterprise Solutions

## 2. 问题与机会
- 企业 AI 采用率快速增长
- 现有方案缺乏行业深度

## 3. 解决方案
- 行业知识图谱 + 端到端自动化
- 核心价值主张

## 4. 产品演示
- 关键功能展示
- 客户使用场景

## 5. 商业模式
- SaaS 订阅模式
- 企业套餐定价策略

## 6. 市场规模 (TAM/SAM/SOM)
- TAM: $50B+ 全球企业 AI 市场
- SAM: $8B 目标垂直行业
- SOM: $500M 可触达市场

## 7. 竞争格局
- AlphaAI vs NeuralEdge vs DataMind 对比
- 差异化优势分析

## 8. Go-to-Market 策略
- 渠道策略与合作伙伴

## 9. 团队
- 核心团队背景

## 10. 财务预测
- 3 年收入预测
- 盈亏平衡分析

## 11. 融资计划
- 目标金额: $5M-$8M
- 资金用途分配

## 12. 下一步
- 路演时间表
- 联系方式
`,
  },
  "doc-financial-model": {
    id: "doc-financial-model",
    body: `# Financial Model - 2026 Q1 Update

## 收入预测
| 季度 | ARR | MRR 增长 |
|------|-----|---------|
| Q1 2026 | $1.2M | 15% |
| Q2 2026 | $1.5M | 18% |
| Q3 2026 | $1.9M | 20% |
| Q4 2026 | $2.4M | 22% |

## 关键指标
- CAC: $12,000
- LTV: $85,000
- LTV/CAC: 7.1x
- Gross Margin: 78%

## 资金用途 (A轮 $5M-$8M)
- 产品研发: 45%
- 市场拓展: 30%
- 团队扩张: 15%
- 运营储备: 10%

## 盈亏平衡
- 预计 2027 Q3 实现盈亏平衡
- 前提：维持当前增长率 + A轮融资到位
`,
  },
  "doc-market-analysis": {
    id: "doc-market-analysis",
    body: `# AI 市场分析报告 - 2026

## 市场概况
企业 AI 解决方案市场在 2025 年达到 $45B，预计 2028 年将突破 $100B。

## 关键趋势
1. **行业垂直化** — 通用 AI 向行业深度解决方案转变
2. **自动化升级** — 从辅助决策到端到端自动化
3. **数据隐私** — 私有部署和数据主权需求增加

## 竞品分析

### AlphaAI
- 融资: $120M (B轮)
- 优势: 品牌知名度高，客户基数大
- 弱点: 产品通用性强，行业深度不足

### NeuralEdge
- 融资: $30M (A轮)
- 优势: 垂直行业经验深
- 弱点: 规模小，产品线单一

### DataMind
- 融资: $65M (B轮)
- 优势: 数据分析能力强
- 弱点: AI 能力处于转型初期

## 我们的定位
- 差异化方向: 行业知识图谱 + 端到端自动化
- 目标客群: 中大型企业，金融/零售/科技行业
`,
  },
  "doc-ai-positioning-strategy": {
    id: "doc-ai-positioning-strategy",
    body: `# AI 差异化定位策略

## 核心定位
"行业深度 AI 自动化平台" — 不是通用 AI 工具，而是懂行业的智能伙伴。

## 两大差异化支柱

### 1. 行业知识图谱
- 构建垂直行业知识库
- 持续学习行业动态
- 技术壁垒：3 年数据积累 + 专家标注

### 2. 端到端自动化
- 从洞察到行动的完整闭环
- 减少人工干预环节
- MVP 范围：会议 → 纪要 → CRM → 邮件 → 跟进

## 目标市场定位图
- X 轴: 行业深度 (浅 → 深)
- Y 轴: 自动化程度 (低 → 高)
- 我们位于右上象限

## 行动计划
1. Q1: 完成定位文档，内部对齐
2. Q2: 更新品牌材料和产品 Messaging
3. Q3: 市场推广和客户验证
`,
  },
};

export const getDocumentMeta = (id: DocumentId) =>
  documentsMeta.find((d) => d.id === id);

export const getDocumentContent = (id: DocumentId) =>
  documentsContent[id];

export const getDocumentsByTopic = (topicId: TopicId): DocumentMeta[] =>
  documentsMeta.filter((d) => d.topicId === topicId);
