
export type FollowupMessageId = string;

export interface FollowupStep {
  id: FollowupMessageId;
  role: "alex";
  content: FollowupContent[];
  buttons?: { label: string; action: string }[];
  // When user clicks a button, we either show a reply (replyContent) or navigate (navigateTo)
  onAction?: Record<
    string,
    { type: "reply"; replyContent: FollowupContent[] } | { type: "navigate"; path: string } | { type: "advance"; nextStepId: FollowupMessageId }
  >;
}

export type FollowupContent =
  | { type: "text"; text: string }
  | { type: "doc_card"; docId: string; docTitle: string; pageCount?: number }
  | { type: "crm_preview"; fields: { name: string; from: string; to: string }[] }
  | { type: "email_preview"; to: string; cc: string; subject: string; body: string }
  | { type: "quote"; speaker: string; text: string };

// Ordered script for Alex 1:1 after meeting
export const alexFollowupScript: FollowupStep[] = [
  {
    id: "msg1",
    role: "alex",
    content: [
      { type: "text", text: "TechVision 需求访谈结束了，我已经整理好了会议纪要。" },
      { type: "doc_card", docId: "doc-meeting-notes-techvision", docTitle: "TechVision 需求访谈纪要 - 2026.02.11" },
    ],
    buttons: [{ label: "查看纪要", action: "view_notes" }],
    onAction: {
      view_notes: { type: "navigate", path: "/app/doc?id=doc-meeting-notes-techvision" },
    },
  },
  {
    id: "msg2",
    role: "alex",
    content: [
      { type: "text", text: "根据今天的会议，TechVision 的 CRM 记录需要更新几个字段，你看一下：" },
      {
        type: "crm_preview",
        fields: [
          { name: "客户阶段", from: "需求调研中", to: "方案制定中" },
          { name: "关键联系人", from: "Tom (CTO)", to: "Tom (CTO), Lisa (CMO)" },
          { name: "最近沟通", from: "2026-02-05", to: "2026-02-11" },
          { name: "备注", from: "初步沟通已完成", to: "已完成需求访谈，进入策略制定阶段" },
        ],
      },
    ],
    buttons: [{ label: "确认更新", action: "confirm_crm" }, { label: "需要修改", action: "edit_crm" }],
    onAction: {
      confirm_crm: { type: "reply", replyContent: [{ type: "text", text: "CRM 已更新 ✓" }] },
      edit_crm: { type: "reply", replyContent: [{ type: "text", text: "好的，你希望改哪里？" }] },
    },
  },
  {
    id: "msg3",
    role: "alex",
    content: [
      { type: "text", text: "我从会议中识别到几个需要跟进的事项。第一个比较重要——" },
      { type: "text", text: "Tom 在会上提到：" },
      { type: "quote", speaker: "Tom", text: "我们需要一份新的产品定位 deck，下周三董事会前给到，重点突出 AI 功能的差异化。" },
      { type: "text", text: "要我帮你生成一个初稿吗？我可以基于今天的讨论内容、历史策略文档和竞品分析数据来写。" },
    ],
    buttons: [{ label: "帮我生成", action: "generate_slides" }, { label: "先不用", action: "skip_slides" }],
    onAction: {
      generate_slides: { type: "advance", nextStepId: "msg3_loading" },
      skip_slides: { type: "reply", replyContent: [{ type: "text", text: "好的，需要的时候随时叫我。" }] },
    },
  },
  {
    id: "msg3_loading",
    role: "alex",
    content: [{ type: "text", text: "好的，正在生成中..." }],
  },
  {
    id: "msg3_done",
    role: "alex",
    content: [
      { type: "text", text: "产品定位 Slides 初稿写好了，一共 8 页，涵盖产品定位、AI 差异化优势、竞争格局和路线图。" },
      { type: "doc_card", docId: "doc-slides-techvision", docTitle: "TechVision 产品定位 Deck (Draft)", pageCount: 8 },
    ],
    buttons: [{ label: "查看并编辑", action: "view_slides" }, { label: "直接发给 Tom", action: "send_slides" }],
    onAction: {
      view_slides: { type: "navigate", path: "/app/doc?id=doc-slides-techvision" },
      send_slides: { type: "reply", replyContent: [{ type: "text", text: "已发送给 Tom ✓" }] },
    },
  },
  {
    id: "msg4",
    role: "alex",
    content: [
      { type: "text", text: "第二件事——Tom 还说：" },
      { type: "quote", speaker: "Tom", text: "现有的 proposal 里定价部分要更新，加入我们讨论的企业套餐选项。" },
      { type: "text", text: "我已经写好了 Proposal 的修改建议。因为是改现有文档，你 review 一下再生效？" },
    ],
    buttons: [{ label: "查看修改", action: "view_proposal" }, { label: "先不用", action: "skip_proposal" }],
    onAction: {
      view_proposal: { type: "navigate", path: "/app/doc?id=doc-proposal-techvision&trackChanges=1" },
      skip_proposal: { type: "reply", replyContent: [{ type: "text", text: "好的，Proposal 修改建议我先保留，你随时可以 review。" }] },
    },
  },
  {
    id: "msg5",
    role: "alex",
    content: [
      { type: "text", text: "第三件——Lisa 在会上说：" },
      { type: "quote", speaker: "Lisa", text: "那我们下周二下午再碰一次，确认最终方案。" },
      { type: "text", text: "要我安排一下吗？" },
    ],
    buttons: [{ label: "安排会议", action: "schedule" }, { label: "我自己来", action: "skip_schedule" }],
    onAction: {
      schedule: { type: "reply", replyContent: [{ type: "text", text: "已添加到日历：下周二 14:00-15:00，TechVision Follow-up Call，参会人 Tom、Lisa、Sarah ✓" }] },
      skip_schedule: { type: "reply", replyContent: [{ type: "text", text: "好的，我把日程信息发给你参考：下周二下午，参会人 Tom 和 Lisa。" }] },
    },
  },
  {
    id: "msg6",
    role: "alex",
    content: [
      { type: "text", text: "最后一件——Tom 提到：" },
      { type: "quote", speaker: "Tom", text: "今天聊的那些竞品对比数据，能发一份给我们技术团队看看吗？" },
      { type: "text", text: "我拟好了邮件，你看看内容再发？" },
      {
        type: "email_preview",
        to: "tech-team@techvision.com",
        cc: "tom@techvision.com",
        subject: "竞品分析数据 - 来自今天的需求访谈",
        body: "Hi Team,\n附件是我们今天讨论的竞品对比分析...",
      },
    ],
    buttons: [{ label: "确认发送", action: "send_email" }, { label: "编辑后发送", action: "edit_email" }, { label: "先不发", action: "skip_email" }],
    onAction: {
      send_email: { type: "reply", replyContent: [{ type: "text", text: "邮件已发送 ✓" }] },
      edit_email: { type: "reply", replyContent: [{ type: "text", text: "邮件已按你的修改发送 ✓" }] },
      skip_email: { type: "reply", replyContent: [{ type: "text", text: "好的，邮件草稿我先保存着，需要时随时告诉我。" }] },
    },
  },
  {
    id: "msg7",
    role: "alex",
    content: [
      {
        type: "text",
        text: "今天 TechVision 的会后工作都处理完了。总结一下：\n✅ 会议纪要已生成\n✅ CRM 已更新\n✅ 产品定位 Slides 初稿已生成（待你编辑）\n✅ Proposal 定价方案已更新\n✅ Follow-up Call 已安排\n✅ 竞品分析邮件已发送\n\n还有什么需要我做的吗？",
      },
    ],
  },
];
