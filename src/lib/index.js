import { http } from "@tauri-apps/api";
import {
  writeTextFile,
  BaseDirectory,
  readTextFile,
  exists,
} from "@tauri-apps/api/fs";
import { invoke } from "@tauri-apps/api/tauri";
import { DEFAULT_CONFIGURATIONS, configurations } from "$lib/stores/config";
import { get } from "svelte/store";

/**
 * @param {any} sportId
 */
function getSportName(sportId) {
  switch (sportId) {
    case 1:
      return "Football";
    case 3:
      return "Basketball";
    case 40:
      return "Esports";
  }
}

/**
 * @param {string} domain
 * @param {number} sportId
 * @param {any | undefined} filter
 * @returns {Promise<import("../app").LiveMatches[]>}
 */
export async function fetchLiveMatches(domain, sportId, filter = undefined) {
  const url = combineUrls(
    domain,
    `/service-api/LiveFeed/Get1x2_VZip?sports=${sportId}&count=20000&lng=en&gr=413&mode=4&country=71&partner=71&getEmpty=true&virtualSports=true&noFilterBlockEvent=true`
  );

  const jsonData = await getRequest(url);

  return jsonData.Value.map((/** @type {any} */ x) => ({
    matchId: x["I"],
    league: x["L"],
    leagueId: x["LI"],
    team1: {
      name: x["O1"],
      image: x["O1I"],
    },
    team2: {
      name: x["O2"],
      image: x["O2I"],
    },
    sport: getSportName(sportId),
    sportId: sportId,
  })).filter(
    (/** @type {import("../app").LiveMatches} */ x) =>
      !get(configurations).excludedLeagues.includes(x.league) &&
      (typeof filter != "undefined" ? filter(x) : true)
  );
}

/**
 * @param {string} url
 * @returns {Promise<any>} response
 */
export async function getRequest(url) {
  const r = await http.fetch(url);
  return r.data;
}

/**
 * @param {any} resource
 * @returns {string} src
 */
export function buildImageUrl(resource) {
  return `https://v3.traincdn.com/resized/size16/sfiles/logo_teams/${resource}.webp`;
}

/**
 * Get the initials (up to two letters) of a name.
 *
 * @param {string} name - The full name from which to extract initials.
 * @returns {string} The initials (up to two letters) of the name.
 */
export function getInitials(name) {
  // Split the name into words
  const words = name.split(" ");

  // Initialize an array to store initials
  const initials = [];

  // Iterate through the words and get the first letter of each word
  for (const word of words) {
    if (word.length > 0 && initials.length < 2) {
      initials.push(word[0].toUpperCase());
    }
  }

  // Join the initials together and return as a string
  return initials.join("");
}

/**
 * Sends a notification message to a specific channel using a bot token.
 *
 * @param {string} botToken - The token for the bot that will send the message.
 * @param {number} channelId - The ID of the channel where the message will be sent.
 * @param {string} msg - The message text to send.
 */
export function notify(botToken, channelId, msg) {
  invoke("send_message", {
    botToken,
    channelId,
    msg,
  });
}

/**
 * Sends a notification message to a specific channel using a bot token.
 *
 * @param {string} sportName - The league name
 * @param {string} leagueName - The league name
 * @param {number | string} leagueId - The league id
 * @param {number | string} matchId - The league match
 * @param {string} team1Name - The name of team 1
 * @param {string} team2Name - The name of team 2
 */
export function getMatchRelativeURL(
  sportName,
  leagueName,
  leagueId,
  matchId,
  team1Name,
  team2Name
) {
  const lgs = leagueName.replaceAll(" ", "-").replaceAll(".", "");
  const tmt = team1Name.replaceAll(" ", "-");
  const tmt2 = team2Name.replaceAll(" ", "-");
  const rrr = `${tmt}-${tmt2}`
    .replaceAll(")", "")
    .replaceAll("(", "")
    .replaceAll(".", "");

  return `/live/${sportName}/${leagueId}-${lgs}/${matchId}-${rrr}`;
}

/**
 * Combines a base URL and a relative URL and returns the combined URL as a string.
 * @param {string} baseUrl The base URL.
 * @param {string} relativeUrl The relative URL to be combined with the base URL.
 * @returns {string} The combined URL.
 */
export function combineUrls(baseUrl, relativeUrl) {
  // Ensure the base URL ends with a trailing slash if it doesn't have one
  const formattedBaseUrl = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";

  // Remove any leading slashes from the relative URL
  const formattedRelativeUrl = relativeUrl.replace(/^\//, "");

  // Combine the base URL and relative URL
  const combinedUrl = formattedBaseUrl + formattedRelativeUrl;

  return combinedUrl;
}

/**
 * Saves the configurations to a file.
 * @returns {Promise<void>} A promise that resolves when the configurations are saved successfully.
 */
export async function SaveConfigurations() {
  const state = get(configurations);

  await writeTextFile("app.conf", JSON.stringify(state), {
    dir: BaseDirectory.AppLocalData,
  });
}

/**
 * Loads the configurations from a file.
 * @returns {Promise<void>} A promise that resolves when the configurations are loaded successfully.
 */
export async function LoadConfigurations() {
  if (!(await exists("app.conf", { dir: BaseDirectory.AppLocalData })))
    await SaveConfigurations();

  const stateRaw = await readTextFile("app.conf", {
    dir: BaseDirectory.AppLocalData,
  });
  const state = JSON.parse(stateRaw);

  configurations.set({
    ...DEFAULT_CONFIGURATIONS,
    ...state,
  });
}
