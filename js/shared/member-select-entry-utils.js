export function renderMemberSelectContentEntryFlow(
  documentObj,
  members,
  escapeHtmlFn,
  renderMemberSelectContentUtilFn
){
  renderMemberSelectContentUtilFn(documentObj, members, escapeHtmlFn);
}

export function openMemberSelectEntryFlow(
  documentObj,
  openMemberSelectFlowFn,
  openMemberSelectSheetFn,
  renderMemberSelectContentFn
){
  openMemberSelectFlowFn(documentObj, openMemberSelectSheetFn, renderMemberSelectContentFn);
}

export function closeMemberSelectEntryFlow(
  documentObj,
  closeMemberSelectFlowFn,
  closeMemberSelectSheetFn
){
  closeMemberSelectFlowFn(documentObj, closeMemberSelectSheetFn);
}
