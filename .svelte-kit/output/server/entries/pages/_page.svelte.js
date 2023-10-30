import { c as create_ssr_component, o as compute_rest_props, e as escape, k as spread, p as escape_attribute_value, l as escape_object, b as add_attribute, h as validate_store, i as subscribe, q as onDestroy, v as validate_component, n as each, r as set_store_value } from "../../chunks/ssr.js";
import "@tauri-apps/api";
import "@tauri-apps/api/fs";
import { invoke } from "@tauri-apps/api/tauri";
import { c as configurations, a as isApplicationIdle, t as toastSettings, g as getToastStore } from "../../chunks/config.js";
const Avatar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classesBase;
  let $$restProps = compute_rest_props($$props, [
    "initials",
    "fill",
    "src",
    "fallback",
    "action",
    "actionParams",
    "background",
    "width",
    "border",
    "rounded",
    "shadow",
    "cursor"
  ]);
  let { initials = "AB" } = $$props;
  let { fill = "fill-token" } = $$props;
  let { src = "" } = $$props;
  let { fallback = "" } = $$props;
  let { action = () => {
  } } = $$props;
  let { actionParams = "" } = $$props;
  let { background = "bg-surface-400-500-token" } = $$props;
  let { width = "w-16" } = $$props;
  let { border = "" } = $$props;
  let { rounded = "rounded-full" } = $$props;
  let { shadow = "" } = $$props;
  let { cursor = "" } = $$props;
  let cBase = "flex aspect-square text-surface-50 font-semibold justify-center items-center overflow-hidden isolate";
  let cImage = "w-full h-full object-cover";
  function prunedRestProps() {
    delete $$restProps.class;
    return $$restProps;
  }
  if ($$props.initials === void 0 && $$bindings.initials && initials !== void 0)
    $$bindings.initials(initials);
  if ($$props.fill === void 0 && $$bindings.fill && fill !== void 0)
    $$bindings.fill(fill);
  if ($$props.src === void 0 && $$bindings.src && src !== void 0)
    $$bindings.src(src);
  if ($$props.fallback === void 0 && $$bindings.fallback && fallback !== void 0)
    $$bindings.fallback(fallback);
  if ($$props.action === void 0 && $$bindings.action && action !== void 0)
    $$bindings.action(action);
  if ($$props.actionParams === void 0 && $$bindings.actionParams && actionParams !== void 0)
    $$bindings.actionParams(actionParams);
  if ($$props.background === void 0 && $$bindings.background && background !== void 0)
    $$bindings.background(background);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.border === void 0 && $$bindings.border && border !== void 0)
    $$bindings.border(border);
  if ($$props.rounded === void 0 && $$bindings.rounded && rounded !== void 0)
    $$bindings.rounded(rounded);
  if ($$props.shadow === void 0 && $$bindings.shadow && shadow !== void 0)
    $$bindings.shadow(shadow);
  if ($$props.cursor === void 0 && $$bindings.cursor && cursor !== void 0)
    $$bindings.cursor(cursor);
  classesBase = `${cBase} ${background} ${width} ${border} ${rounded} ${shadow} ${cursor} ${$$props.class ?? ""}`;
  return `  <figure class="${"avatar " + escape(classesBase, true)}" data-testid="avatar">${src ? `<img${spread(
    [
      {
        class: "avatar-image " + escape(cImage, true)
      },
      {
        style: escape_attribute_value($$props.style ?? "")
      },
      { src: escape_attribute_value(src) },
      {
        alt: escape_attribute_value($$props.alt || "")
      },
      escape_object(prunedRestProps())
    ],
    {}
  )}>` : `<svg class="avatar-initials w-full h-full" viewBox="0 0 512 512"><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-weight="bold"${add_attribute("font-size", 150, 0)} class="${"avatar-text " + escape(fill, true)}">${escape(String(initials).substring(0, 2).toUpperCase())}</text></svg>`}</figure>`;
});
function buildImageUrl(resource) {
  return `https://v3.traincdn.com/resized/size16/sfiles/logo_teams/${resource}.webp`;
}
function getInitials(name) {
  const words = name.split(" ");
  const initials = [];
  for (const word of words) {
    if (word.length > 0 && initials.length < 2) {
      initials.push(word[0].toUpperCase());
    }
  }
  return initials.join("");
}
function notify(botToken, channelId, msg) {
  invoke("send_message", {
    botToken,
    channelId,
    msg
  });
}
function getMatchRelativeURL(sportName, leagueName, leagueId, matchId, team1Name, team2Name) {
  const lgs = leagueName.replaceAll(" ", "-").replaceAll(".", "");
  const tmt = team1Name.replaceAll(" ", "-");
  const tmt2 = team2Name.replaceAll(" ", "-");
  const rrr = `${tmt}-${tmt2}`.replaceAll(")", "").replaceAll("(", "").replaceAll(".", "");
  return `/live/${sportName}/${leagueId}-${lgs}/${matchId}-${rrr}`;
}
function combineUrls(baseUrl, relativeUrl) {
  const formattedBaseUrl = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
  const formattedRelativeUrl = relativeUrl.replace(/^\//, "");
  const combinedUrl = formattedBaseUrl + formattedRelativeUrl;
  return combinedUrl;
}
const ClockIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"></path><path fill="white" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2Zm0 4a1 1 0 0 0-1 1v5a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V7a1 1 0 0 0-1-1Z"></path></g></svg>`;
});
const FootballIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="white" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2Zm1.67 14h-3.34l-1.38 1.897l.554 1.706A7.993 7.993 0 0 0 12 20c.871 0 1.71-.14 2.496-.397l.553-1.706L13.669 16Zm-8.376-5.128l-1.292.938L4 12c0 1.73.549 3.331 1.482 4.64h1.91l1.323-1.82l-1.028-3.17l-2.393-.778Zm13.412 0l-2.393.778l-1.028 3.17l1.322 1.82h1.91A7.963 7.963 0 0 0 20 12l-.003-.191l-1.291-.937ZM14.29 4.333l-1.29.94V7.79l2.694 1.957l2.24-.727l.554-1.703a8.014 8.014 0 0 0-4.196-2.984Zm-4.582 0a8.014 8.014 0 0 0-4.196 2.985l.554 1.702l2.239.727L11 7.79V5.273l-1.291-.94Z"></path></svg>`;
});
const BasketIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="white"><path fill-rule="evenodd" d="M6.865 20.583A9.955 9.955 0 0 1 3.339 17A9.955 9.955 0 0 1 2 12.159l.145.028c2.949.581 6.304-.469 9.061-2.162c.363-.223.719-.458 1.065-.706c.413.516.783 1.04 1.08 1.556c.375.647.713 1.417 1.015 2.24c-.518.25-1.022.526-1.508.822c-2.792 1.699-5.174 4.176-5.992 6.644v.002Zm9.395.465a9.986 9.986 0 0 1-8.04.21l.069-.204c.663-2.002 2.72-4.237 5.348-5.836c.394-.24.798-.463 1.206-.667c.252.83.471 1.671.655 2.462a50.5 50.5 0 0 1 .699 3.597l.008.053l.002.012v.004l.053.369Z" clip-rule="evenodd"></path><path d="M16.226 13.943c1.887-.72 3.811-.996 5.477-.63l.204.045a10.06 10.06 0 0 1-.71 2.57a9.949 9.949 0 0 1-3.538 4.317l-.013-.079a52 52 0 0 0-.687-3.494a39.959 39.959 0 0 0-.733-2.73Zm-2.773-5.546c1.728-1.469 3.087-3.21 3.672-4.949l.01-.03A9.955 9.955 0 0 1 20.66 7A9.954 9.954 0 0 1 22 11.842c-1.995-.431-4.186-.1-6.256.68c-.32-.864-.685-1.688-1.094-2.397a14.112 14.112 0 0 0-1.197-1.728ZM8.319 3.454a35.28 35.28 0 0 0-.6-.465l-.023-.016a9.949 9.949 0 0 1 5.5-.902c.887.107 1.757.333 2.584.67l-.077.229c-.477 1.418-1.65 2.95-3.228 4.29a32.057 32.057 0 0 0-2.203-2.16A41.738 41.738 0 0 0 8.32 3.453Zm2.101 5.293c-2.586 1.588-5.55 2.449-7.987 1.969l-.342-.068a9.986 9.986 0 0 1 4.19-6.853l.328.239l.002.001l.01.007l.039.029l.154.115a40.238 40.238 0 0 1 2.456 2.03c.66.592 1.358 1.26 2.013 1.965c-.28.195-.567.385-.863.566Z"></path></g></svg>`;
});
const MatchComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_configurations;
  validate_store(configurations, "configurations");
  $$unsubscribe_configurations = subscribe(configurations, (value) => value);
  let { match } = $$props;
  let { domain } = $$props;
  let { notifyCallback = (match2, betData, matchTime) => {
  } } = $$props;
  let totalLines = 0;
  let handicapLines = 0;
  onDestroy(() => {
  });
  if ($$props.match === void 0 && $$bindings.match && match !== void 0)
    $$bindings.match(match);
  if ($$props.domain === void 0 && $$bindings.domain && domain !== void 0)
    $$bindings.domain(domain);
  if ($$props.notifyCallback === void 0 && $$bindings.notifyCallback && notifyCallback !== void 0)
    $$bindings.notifyCallback(notifyCallback);
  $$unsubscribe_configurations();
  return `<div class="w-full grid grid-cols-5 items-center variant-soft-surface py-2 px-3 rounded"><div class="flex flex-col gap-1 justify-center col-span-2"><div class="flex gap-2 text-sm items-center"><div class="flex gap-1 items-center">${match.sportId == 1 ? `${validate_component(FootballIcon, "FootballIcon").$$render($$result, {}, {}, {})}` : `${validate_component(BasketIcon, "BasketballIcon").$$render($$result, {}, {}, {})}`} ${escape(match.sport)}${escape(" • ")}${escape(match.league)}</div></div> <div class="flex gap-2 items-center"><div class="flex gap-1 items-center">${validate_component(Avatar, "Avatar").$$render(
    $$result,
    {
      width: "w-6",
      src: buildImageUrl(match.team1.image),
      initials: getInitials(match.team1.name)
    },
    {},
    {}
  )} <span>${escape(match.team1.name)}</span></div> <span data-svelte-h="svelte-1by87le">v/s</span> <div class="flex gap-1 items-center">${validate_component(Avatar, "Avatar").$$render(
    $$result,
    {
      width: "w-6",
      src: buildImageUrl(match.team2.image),
      initials: getInitials(match.team2.name)
    },
    {},
    {}
  )} <span>${escape(match.team2.name)}</span></div></div></div> <div class="flex space-x-1 bg-surface-800 px-2 py-1 rounded items-center w-fit mx-auto">${validate_component(ClockIcon, "ClockIcon").$$render($$result, {}, {}, {})} ${`<span data-svelte-h="svelte-1gvvrlo">--:--</span>`}</div> <div class="flex space-x-3 col-span-2 items-center justify-center ml-auto"><div class="flex flex-col gap-1 items-center text-ellipsis whitespace-nowrap"><span data-svelte-h="svelte-2fqrek">Total</span> <span class="relative bg-surface-800 px-2 py-1 rounded">${`<span>${escape(totalLines)} lines</span>`} ${``}</span></div> <div class="flex flex-col gap-1 items-center text-ellipsis whitespace-nowrap"><span data-svelte-h="svelte-1sf2l4i">Handicap</span> <span class="relative bg-surface-800 px-2 py-1 rounded">${`<span>${escape(handicapLines)} lines</span>`} ${``}</span></div> <div class="flex flex-col gap-1 items-center text-ellipsis whitespace-nowrap"><span data-svelte-h="svelte-1mzv2la">HT Removed</span> <span class="bg-surface-800 px-2 py-1 rounded text-ellipsis">${escape("-")}</span></div> <div class="flex flex-col gap-1 items-center text-ellipsis whitespace-nowrap"><span data-svelte-h="svelte-15y5kaa">Blocked</span> <span class="bg-surface-800 px-2 py-1 rounded text-ellipsis">${escape("No")}</span></div></div></div>`;
});
const BattleIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="white" d="m19.05 21.6l-2.925-2.9l-2.2 2.2l-.7-.7q-.575-.575-.575-1.425t.575-1.425l4.225-4.225q.575-.575 1.425-.575t1.425.575l.7.7l-2.2 2.2l2.9 2.925q.3.3.3.7t-.3.7l-1.25 1.25q-.3.3-.7.3t-.7-.3ZM22 5.9L10.65 17.25l.125.1q.575.575.575 1.425t-.575 1.425l-.7.7l-2.2-2.2l-2.925 2.9q-.3.3-.7.3t-.7-.3L2.3 20.35q-.3-.3-.3-.7t.3-.7l2.9-2.925l-2.2-2.2l.7-.7q.575-.575 1.425-.575t1.425.575l.1.125L18 1.9h4v4ZM6.95 10.85L2 5.9v-4h4l4.95 4.95l-4 4Z"></path></svg>`;
});
const EsportIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="white" d="M4.55 19q-1.275 0-1.975-.888T2.05 15.95l1.05-7.5q.225-1.5 1.338-2.475T7.05 5h9.9q1.5 0 2.613.975T20.9 8.45l1.05 7.5q.175 1.275-.525 2.163T19.45 19q-.525 0-.975-.188t-.825-.562L15.4 16H8.6l-2.25 2.25q-.375.375-.825.563T4.55 19ZM17 13q.425 0 .713-.288T18 12q0-.425-.288-.713T17 11q-.425 0-.713.288T16 12q0 .425.288.713T17 13Zm-2-3q.425 0 .713-.288T16 9q0-.425-.288-.713T15 8q-.425 0-.713.288T14 9q0 .425.288.713T15 10Zm-7.25 1.25v1q0 .325.213.537T8.5 13q.325 0 .537-.213t.213-.537v-1h1q.325 0 .537-.213T11 10.5q0-.325-.213-.537t-.537-.213h-1v-1q0-.325-.213-.537T8.5 8q-.325 0-.537.213t-.213.537v1h-1q-.325 0-.537.213T6 10.5q0 .325.213.537t.537.213h1Z"></path></svg>`;
});
const EsportMatchComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_configurations;
  let $$unsubscribe_isApplicationIdle;
  validate_store(configurations, "configurations");
  $$unsubscribe_configurations = subscribe(configurations, (value) => value);
  validate_store(isApplicationIdle, "isApplicationIdle");
  $$unsubscribe_isApplicationIdle = subscribe(isApplicationIdle, (value) => value);
  let { match } = $$props;
  let { domain } = $$props;
  const currentPosition = { s1: 0, s2: 0 };
  onDestroy(() => {
  });
  if ($$props.match === void 0 && $$bindings.match && match !== void 0)
    $$bindings.match(match);
  if ($$props.domain === void 0 && $$bindings.domain && domain !== void 0)
    $$bindings.domain(domain);
  $$unsubscribe_configurations();
  $$unsubscribe_isApplicationIdle();
  return `<div class="w-full grid grid-cols-5 items-center variant-soft-surface py-2 px-3 rounded"><div class="flex flex-col gap-1 justify-center col-span-2"><div class="flex gap-2 text-sm items-center"><div class="flex gap-1 items-center">${validate_component(EsportIcon, "EsportIcon").$$render($$result, {}, {}, {})} ${escape(match.sport)}${escape(" • ")}${escape(match.league)}</div></div> <div class="flex gap-2 items-center"><div class="flex gap-1 items-center">${validate_component(Avatar, "Avatar").$$render(
    $$result,
    {
      width: "w-6",
      initials: getInitials(match.team1.name)
    },
    {},
    {}
  )} <span>${escape(match.team1.name)}</span></div> <span data-svelte-h="svelte-1by87le">v/s</span> <div class="flex gap-1 items-center">${validate_component(Avatar, "Avatar").$$render(
    $$result,
    {
      width: "w-6",
      initials: getInitials(match.team2.name)
    },
    {},
    {}
  )} <span>${escape(match.team2.name)}</span></div></div></div> <div class="flex space-x-1 bg-surface-800 px-2 py-1 rounded items-center w-fit mx-auto">${validate_component(BattleIcon, "BattleIcon").$$render($$result, {}, {}, {})} <span>${escape(currentPosition.s1)}:${escape(currentPosition.s2)}</span></div></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $isApplicationIdle, $$unsubscribe_isApplicationIdle;
  let $configurations, $$unsubscribe_configurations;
  let $$unsubscribe_toastSettings;
  validate_store(isApplicationIdle, "isApplicationIdle");
  $$unsubscribe_isApplicationIdle = subscribe(isApplicationIdle, (value) => $isApplicationIdle = value);
  validate_store(configurations, "configurations");
  $$unsubscribe_configurations = subscribe(configurations, (value) => $configurations = value);
  validate_store(toastSettings, "toastSettings");
  $$unsubscribe_toastSettings = subscribe(toastSettings, (value) => value);
  let isWatching = false;
  getToastStore();
  let footballMatches = [];
  let basketballMatches = [];
  let dota2Matches = [];
  const notificationsSent = {};
  function notifyCallback(match, betData, matchTime) {
    if (JSON.stringify(notificationsSent[match.matchId]) == JSON.stringify(betData) || !$configurations.notifyEnabled)
      return;
    notificationsSent[match.matchId] = betData;
    const message = `
    Sport: ${match.sport}
    Team 1: ${match.team1.name}
    Team 2: ${match.team2.name}
    Total: ${betData.total.lines} line ${betData.total.blocked || ""}
    Handicap: ${betData.handicap.lines} line ${betData.handicap.blocked || ""}
    ${match.sportId == 1 ? `HT Removed: ${betData.htRemoved ? "Yes" : "No"}` : ""}
    Teams Wins/1x2 Blocked: ${betData.teamWinsBlocked || "No"}
    Match Time Passed: ${matchTime}
    Match URL: ${combineUrls($configurations.url, getMatchRelativeURL(match.sport, match.league, match.leagueId, match.matchId, match.team1.name, match.team2.name))}
    `;
    if (!$isApplicationIdle && $configurations.channelId && $configurations.botToken)
      notify($configurations.botToken, $configurations.channelId, message);
  }
  onDestroy(() => set_store_value(isApplicationIdle, $isApplicationIdle = true, $isApplicationIdle));
  $$unsubscribe_isApplicationIdle();
  $$unsubscribe_configurations();
  $$unsubscribe_toastSettings();
  return `<div class="p-4 flex justify-between">${`<button class="btn text-sm variant-filled-tertiary" ${""}>Start Watching</button>`} ${``}</div> ${``} <div class="flex flex-col gap-4 px-2 py-4">${footballMatches.length && isWatching ? `${each(footballMatches, (match) => {
    return `${validate_component(MatchComponent, "MatchComponent").$$render(
      $$result,
      {
        domain: $configurations.url,
        match,
        notifyCallback
      },
      {},
      {}
    )}`;
  })}` : ``} ${basketballMatches.length && isWatching ? `${each(basketballMatches, (match) => {
    return `${validate_component(MatchComponent, "MatchComponent").$$render(
      $$result,
      {
        domain: $configurations.url,
        match,
        notifyCallback
      },
      {},
      {}
    )}`;
  })}` : ``} ${dota2Matches.length && isWatching ? `${each(dota2Matches, (match) => {
    return `${validate_component(EsportMatchComponent, "EsportMatchComponent").$$render($$result, { domain: $configurations.url, match }, {}, {})}`;
  })}` : ``}</div>`;
});
export {
  Page as default
};
