import { w as writable, r as readable } from "./index.js";
import { g as getContext, s as setContext, t as get_store_value } from "./ssr.js";
const toastDefaults = { message: "Missing Toast Message", autohide: true, timeout: 5e3 };
const TOAST_STORE_KEY = "toastStore";
function getToastStore() {
  const toastStore = getContext(TOAST_STORE_KEY);
  if (!toastStore)
    throw new Error("toastStore is not initialized. Please ensure that `initializeStores()` is invoked in the root layout file of this app!");
  return toastStore;
}
function initializeToastStore() {
  const toastStore = toastService();
  return setContext(TOAST_STORE_KEY, toastStore);
}
function randomUUID() {
  const random = Math.random();
  return Number(random).toString(32);
}
function toastService() {
  const { subscribe, set, update } = writable([]);
  const close = (id) => update((tStore) => {
    if (tStore.length > 0) {
      const index = tStore.findIndex((t) => t.id === id);
      const selectedToast = tStore[index];
      if (selectedToast) {
        if (selectedToast.callback)
          selectedToast.callback({ id, status: "closed" });
        if (selectedToast.timeoutId)
          clearTimeout(selectedToast.timeoutId);
        tStore.splice(index, 1);
      }
    }
    return tStore;
  });
  function handleAutoHide(toast) {
    if (toast.autohide === true) {
      return setTimeout(() => {
        close(toast.id);
      }, toast.timeout);
    }
  }
  return {
    subscribe,
    close,
    /** Add a new toast to the queue. */
    trigger: (toast) => {
      const id = randomUUID();
      update((tStore) => {
        if (toast && toast.callback)
          toast.callback({ id, status: "queued" });
        if (toast.hideDismiss)
          toast.autohide = true;
        const tMerged = { ...toastDefaults, ...toast, id };
        tMerged.timeoutId = handleAutoHide(tMerged);
        tStore.push(tMerged);
        return tStore;
      });
      return id;
    },
    /** Remain visible on hover */
    freeze: (index) => update((tStore) => {
      if (tStore.length > 0)
        clearTimeout(tStore[index].timeoutId);
      return tStore;
    }),
    /** Cancel remain visible on leave */
    unfreeze: (index) => update((tStore) => {
      if (tStore.length > 0)
        tStore[index].timeoutId = handleAutoHide(tStore[index]);
      return tStore;
    }),
    /** Remove all toasts from queue */
    clear: () => set([])
  };
}
const stores = {};
function localStorageStore(key, initialValue, options) {
  options?.serializer ?? JSON;
  options?.storage ?? "local";
  if (!stores[key]) {
    const store = writable(initialValue, (set2) => {
    });
    const { subscribe, set } = store;
    stores[key] = {
      set(value) {
        set(value);
      },
      update(updater) {
        const value = updater(get_store_value(store));
        set(value);
      },
      subscribe
    };
  }
  return stores[key];
}
localStorageStore("modeOsPrefers", false);
localStorageStore("modeUserPrefers", void 0);
localStorageStore("modeCurrent", false);
function prefersReducedMotion() {
  return false;
}
const prefersReducedMotionStore = readable(prefersReducedMotion(), (set) => {
});
const ProgressBar_svelte_svelte_type_style_lang = "";
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
  "NBA. H2H GG League"
];
const DEFAULT_CONFIGURATIONS = {
  url: "https://1x-bet.in/",
  botToken: void 0,
  channelId: void 0,
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
  esports: {
    enabled: true,
    notifyTotal: true,
    notifyHandicap: true,
    notifyTeamWins: true,
    notifyDroppingOdds: true
  }
};
const configurations = writable(DEFAULT_CONFIGURATIONS);
const isApplicationIdle = writable(true);
const toastSettings = readable({
  timeout: 2e3,
  background: "variant-filled-tertiary",
  hideDismiss: true
});
export {
  isApplicationIdle as a,
  configurations as c,
  getToastStore as g,
  initializeToastStore as i,
  prefersReducedMotionStore as p,
  toastSettings as t
};
