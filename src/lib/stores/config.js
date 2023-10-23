import { readable, writable } from "svelte/store";

const EXCLUDED_LEAGUES = [
  "Short Football 3x3",
  "Short Football 4x4",
  "Student League",
  "BudnesLiga LFL 5x5",
  "USSR. Division 3x3",
  "ACL Indoor",
  "Division 4x4",
  "Short Football D1",
  "Short Football 2x2 L2",
  "Short Football 4x4 L2",
  "Subsoccer",
  "Short Football 2x2",
  "Short Football 3x3 L1",
  "FIFA 23. Amateur daily league",
  "FIFA 23. Volta daily league",
  "FIFA 22. GT Sports League",
  "FIFA 23. UEL. UEFA Champions League",
  "FC 24. eSports Battle. Champions League D",
  "FC 24. eSports Battle. Premier League",
  "FIFA 22. Cyber League",
  "IPBL. Pro Division",
  "IPBL. Space Division",
  "Rocket League",
  "Belarus. NBBL",
  "NBA 2K23. Cyber League",
  "Table Basketball League",
  "NBA 2K22. Cyber Euro League",
  "2K22. Euroleague",
  "2k23. NBA",
  "NBA. eSports Battle",
  "NBA. H2H GG League",
];

const DEV_BOT_TOKEN = "6393283721:AAHysCsxo2GS99hsIfmcylomP-MGo5TIQjc";
const DEV_CHANNEL_ID = -1001694628284;

export const DEFAULT_CONFIGURATIONS = {
  url: "https://1x-bet.in/",
  botToken: DEV_BOT_TOKEN,
  channelId: DEV_CHANNEL_ID,
  notifyEnabled: true,
  notifyTotalLines: true,
  notifyTotalOneSideBlocked: true,
  notifyHandicapLines: true,
  notifyHandicapOneSideBlocked: true,
  notifyHalfTimeRemoved: true,
  notifyTeamWins: true,
  excludedLeagues: EXCLUDED_LEAGUES,
  notifyFootball: true,
  notifyBasketball: true,
};

export const configurations = writable(DEFAULT_CONFIGURATIONS);

export const isApplicationIdle = writable(true);

export const toastSettings = readable({
  timeout: 2e3,
  background: "variant-filled-tertiary",
  hideDismiss: true,
});
