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
    id: "doc-meeting-notes-techvision",
    title: "TechVision 需求访谈纪要 - 2026.02.24",
    topicId: "techvision",
    type: "notes",
    updatedAt: "2026-02-24T10:45:00",
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
];

const meetingNotesBody = `# TechVision 需求访谈纪要
**日期**: 2026-02-24
**参会**: Sarah, Tom (CTO), Lisa (CMO)

## 会议要点
- 产品定位 deck 需下周三董事会前交付，重点突出 AI 功能差异化。
- Proposal 定价部分将更新，加入企业套餐选项。
- 下周二下午 Follow-up 会议确认最终方案。
- 竞品对比数据将发送给技术团队。

## 行动项
| 负责人 | 事项 | 截止 |
|--------|------|------|
| Sarah | 产品定位 Slides 初稿 | 下周三前 |
| Sarah | Proposal 定价更新 | 下周二前 |
| 双方 | Follow-up Call | 下周二 14:00 |
`;

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

export const documentsContent: Record<DocumentId, DocumentContent> = {
  "doc-meeting-notes-techvision": {
    id: "doc-meeting-notes-techvision",
    body: meetingNotesBody,
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
};

export const getDocumentMeta = (id: DocumentId) =>
  documentsMeta.find((d) => d.id === id);

export const getDocumentContent = (id: DocumentId) =>
  documentsContent[id];

export const getDocumentsByTopic = (topicId: TopicId): DocumentMeta[] =>
  documentsMeta.filter((d) => d.topicId === topicId);
