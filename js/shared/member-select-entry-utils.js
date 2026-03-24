export function renderMemberSelectContentEntryFlow(
  documentObj,
  members,
  escapeHtmlFn,
  renderMemberSelectContentUtilFn,
  options = {}
){
  renderMemberSelectContentUtilFn(documentObj, members, escapeHtmlFn, options);
}

export function openMemberSelectEntryFlow(
  documentObj,
  openMemberSelectFlowFn,
  openMemberSelectSheetFn,
  renderMemberSelectContentFn,
  options = {}
){
  openMemberSelectFlowFn(documentObj, openMemberSelectSheetFn, renderMemberSelectContentFn, options);
}

export function closeMemberSelectEntryFlow(
  documentObj,
  closeMemberSelectFlowFn,
  closeMemberSelectSheetFn
){
  closeMemberSelectFlowFn(documentObj, closeMemberSelectSheetFn);
}
