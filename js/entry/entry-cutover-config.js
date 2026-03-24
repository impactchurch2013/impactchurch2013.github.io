export const ENTRY_CUTOVER_READY = true;
export const ENTRY_FORCE_LEGACY_PARAM = "entryLegacy";

export function getEntryDefaultMode(){
  return ENTRY_CUTOVER_READY ? "standalone" : "legacy";
}
