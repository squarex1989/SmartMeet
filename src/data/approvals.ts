// CRM update preview for Alex's message 2
export const crmUpdatePreview = {
  fields: [
    { name: "客户阶段", from: "需求调研中", to: "方案制定中" },
    { name: "关键联系人", from: "Tom (CTO)", to: "Tom (CTO), Lisa (CMO)" },
    { name: "最近沟通", from: "2026-02-05", to: "2026-02-11" },
    { name: "备注", from: "初步沟通已完成", to: "已完成需求访谈，进入策略制定阶段" },
  ],
};

// Email draft for Alex's message 6
export const emailDraftPreview = {
  to: "tech-team@techvision.com",
  cc: "tom@techvision.com",
  subject: "竞品分析数据 - 来自今天的需求访谈",
  body: "Hi Team,\n\n附件是我们今天讨论的竞品对比分析，供技术团队参考。如有问题随时联系。\n\nSarah",
  attachments: ["竞品对比分析.pdf"],
};

// Document diff for Proposal (Track Changes) - we use document content with trackChanges
// See documents.ts doc-proposal-techvision
