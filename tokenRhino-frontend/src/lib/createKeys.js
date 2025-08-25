// src/lib/createKeys.js
export const LS_TOKEN = "createDraftToken";
export const LS_CFG   = "createDraftCfg";

export function clearCreateDraft() {
  localStorage.removeItem(LS_TOKEN);
  localStorage.removeItem(LS_CFG);
}