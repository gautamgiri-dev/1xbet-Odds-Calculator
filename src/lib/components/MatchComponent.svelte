<script>
  import { buildImageUrl, combineUrls, getInitials, getRequest } from "$lib";
  import { Avatar } from "@skeletonlabs/skeleton";
  import { onDestroy, onMount } from "svelte";
  import ClockIcon from "$lib/icons/ClockIcon.svelte";
  import LockIcon from "$lib/icons/LockIcon.svelte";
  import FootballIcon from "$lib/icons/FootballIcon.svelte";
  import BasketballIcon from "$lib/icons/BasketIcon.svelte";
  import { configurations } from "$lib/stores/config";

  /**
   * @type {import("../../app").LiveMatches}
   */
  export let match;

  /**
   * @type {string}
   */
  export let domain;

  /**
   * @function
   * @param {import("../../app").LiveMatches} match
   * @param {import("../../app").BetData} betData
   * @param {string} matchTime
   */
  export let notifyCallback = (match, betData, matchTime) => {};

  let totalLines = 0;
  let handicapLines = 0;

  /**
   * @type {boolean | undefined}
   */
  let isHTLineRemoved;
  let timePassed = 0;

  let blocked = {
    totalLines: undefined,
    handicapLines: undefined,
    teamWins: undefined,
  };

  /**
   * @type {number | undefined}
   */
  let interval;

  /**
   * @param {any[]?} arr1
   * @param {any[]?} arr2
   * @param {any} cond
   * @param {any | undefined} cb
   */
  function checkBlocked(arr1, arr2, cond, cb = undefined) {
    const cond1 = (arr1 || []).some(cond);
    const cond2 = (arr2 || []).some(cond);

    if (cb) return cb(cond1, cond2);
    else return cond1 !== cond2;
  }

  async function getCurrentUpdates() {
    const url = combineUrls(
      domain,
      `/service-api/LiveFeed/GetGameZip?id=${match.matchId}&lng=en&isSubGames=true&GroupEvents=true&countevents=250&grMode=4&partner=71&topGroups=&marketType=1`
    );

    const jsonData = await getRequest(url);
    const valueObj = jsonData.Value;

    const geObj = valueObj["GE"];

    const totalBets = geObj.find((/** @type {any} */ x) => x["G"] == 17);

    const blockCondition = (/** @type {any} */ x) => x["B"];

    if (totalBets)
      if (totalBets["E"].length) {
        totalLines = totalBets["E"][0].length;
        if ($configurations.notifyTotalOneSideBlocked)
          blocked.totalLines = checkBlocked(
            totalBets["E"][0] || [],
            totalBets["E"][1] || [],
            blockCondition,
            (/** @type {any} */ c1, /** @type {any} */ c2) =>
              !!c1 != !!c2
                ? c1
                  ? "(Home Side Blocked)"
                  : c2
                  ? "(Away Side Blocked)"
                  : undefined
                : undefined
          );
      }

    // G = 101 represents Team Wins line
    const teamWinsBets = geObj.find(
      (/** @type {{ [x: string]: number; }} */ x) =>
        x["G"] == (match.sportId == 1 ? 1 : 101)
    );

    if (teamWinsBets) {
      if (teamWinsBets["E"].length > 1)
        blocked.teamWins = checkBlocked(
          teamWinsBets["E"][0],
          teamWinsBets["E"][teamWinsBets.length - 1],
          (/** @type {{ [x: string]: number; }} */ x) =>
            blockCondition(x) && x["C"] > 1.1,
          (/** @type {any} */ c1, /** @type {any} */ c2) =>
            !!c1 != !!c2 ? (c1 ? "Home" : c2 ? "Away" : undefined) : undefined
        );
    }

    const handicapBets = geObj.find((/** @type {any} */ x) => x["G"] == 2);

    if (handicapBets)
      if (handicapBets["E"].length) {
        handicapLines = handicapBets["E"][0].length;
        if ($configurations.notifyHandicapOneSideBlocked)
          blocked.handicapLines = checkBlocked(
            handicapBets["E"][0] || [],
            handicapBets["E"][1] || [],
            blockCondition,
            (/** @type {any} */ c1, /** @type {any} */ c2) =>
              !!c1 != !!c2
                ? c1
                  ? "(Home Side Blocked)"
                  : c2
                  ? "(Away Side Blocked)"
                  : undefined
                : undefined
          );
      }

    if (valueObj["SC"]) timePassed = valueObj["SC"]["TS"];

    if (timePassed >= 40 * 60) isHTLineRemoved = undefined;
    else
      isHTLineRemoved = !valueObj["SG"]?.some(
        (/** @type {{ [x: string]: any; }} */ x) => x["P"] == 1 && !x["TG"]
      );

    if (match.sportId != 1) isHTLineRemoved = undefined;

    checkNotifyCondition();
  }

  function checkNotifyCondition() {
    let shouldNotify = false;

    // Total Single Lines
    shouldNotify =
      shouldNotify || ($configurations.notifyTotalLines && totalLines == 1);

    // Handicap Single Lines
    shouldNotify =
      shouldNotify ||
      ($configurations.notifyHandicapLines && handicapLines == 1);

    // Half Time Line Removed (Football only)
    shouldNotify =
      shouldNotify ||
      ($configurations.notifyHalfTimeRemoved &&
        match.sportId == 1 &&
        !!isHTLineRemoved);

    // Total Single Line one side blocked
    shouldNotify =
      shouldNotify ||
      ($configurations.notifyTotalOneSideBlocked && !!blocked.totalLines);

    // Handicap Single Line one side blocked
    shouldNotify =
      shouldNotify ||
      ($configurations.notifyHandicapOneSideBlocked && !!blocked.handicapLines);

    // Team Wins or 1x2 line one side blocked
    shouldNotify =
      shouldNotify || ($configurations.notifyTeamWins && !!blocked.teamWins);

    // Match time passed
    shouldNotify =
      shouldNotify &&
      (match.sportId == 1 ? timePassed <= 80 * 60 : timePassed <= 37 * 60);

    // Match notifications are enabled
    shouldNotify =
      shouldNotify &&
      (match.sportId == 1
        ? $configurations.notifyFootball
        : $configurations.notifyBasketball);

    if (shouldNotify)
      notifyCallback(
        match,
        {
          total: {
            lines: totalLines,
            blocked: blocked.totalLines,
          },
          handicap: {
            lines: handicapLines,
            blocked: blocked.handicapLines,
          },
          teamWinsBlocked: blocked.teamWins,
          htRemoved: isHTLineRemoved,
        },
        `${Math.floor(timePassed / 60)
          .toString()
          .padStart(2, "0")}:${(timePassed % 60).toString().padStart(2, "0")}`
      );
  }

  onMount(async () => {
    await getCurrentUpdates();
    interval = setInterval(getCurrentUpdates, 5e3);
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<div
  class="w-full grid grid-cols-5 items-center variant-soft-surface py-2 px-3 rounded"
>
  <div class="flex flex-col gap-1 justify-center col-span-2">
    <div class="flex gap-2 text-sm items-center">
      <div class="flex gap-1 items-center">
        {#if match.sportId == 1}
          <FootballIcon />
        {:else}
          <BasketballIcon />
        {/if}
        {match.sport}{" \u2022 "}{match.league}
      </div>
    </div>
    <div class="flex gap-2 items-center">
      <div class="flex gap-1 items-center">
        <Avatar
          width="w-6"
          src={buildImageUrl(match.team1.image)}
          initials={getInitials(match.team1.name)}
        />
        <span>{match.team1.name}</span>
      </div>
      <span>v/s</span>
      <div class="flex gap-1 items-center">
        <Avatar
          width="w-6"
          src={buildImageUrl(match.team2.image)}
          initials={getInitials(match.team2.name)}
        />
        <span>{match.team2.name}</span>
      </div>
    </div>
  </div>

  <div
    class="flex space-x-1 bg-surface-800 px-2 py-1 rounded items-center w-fit mx-auto"
  >
    <ClockIcon />
    {#if timePassed}
      <span>
        {Math.floor(timePassed / 60)
          .toString()
          .padStart(2, "0")}:{(timePassed % 60).toString().padStart(2, "0")}
      </span>
    {:else}
      <span>--:--</span>
    {/if}
  </div>

  <div class="flex space-x-3 col-span-2 items-center justify-center ml-auto">
    <div
      class="flex flex-col gap-1 items-center text-ellipsis whitespace-nowrap"
    >
      <span>Total</span>

      <span class="relative bg-surface-800 px-2 py-1 rounded">
        {#if totalLines == 1}
          <span class="text-green-600">{totalLines} line</span>
        {:else}
          <span>{totalLines} lines</span>
        {/if}

        {#if blocked.totalLines}
          <div class="absolute top-0 right-0">
            <LockIcon />
          </div>
        {/if}
      </span>
    </div>

    <div
      class="flex flex-col gap-1 items-center text-ellipsis whitespace-nowrap"
    >
      <span>Handicap</span>
      <span class="relative bg-surface-800 px-2 py-1 rounded">
        {#if handicapLines == 1}
          <span class="text-green-600">{handicapLines} line</span>
        {:else}
          <span>{handicapLines} lines</span>
        {/if}

        {#if blocked.handicapLines}
          <div class="absolute top-0 right-0">
            <LockIcon />
          </div>
        {/if}
      </span>
    </div>
    <div
      class="flex flex-col gap-1 items-center text-ellipsis whitespace-nowrap"
    >
      <span>HT Removed</span>
      <span class="bg-surface-800 px-2 py-1 rounded text-ellipsis"
        >{isHTLineRemoved == true
          ? "Yes"
          : isHTLineRemoved == false
          ? "No"
          : "-"}</span
      >
    </div>
    <div
      class="flex flex-col gap-1 items-center text-ellipsis whitespace-nowrap"
    >
      <span>Blocked</span>
      <span class="bg-surface-800 px-2 py-1 rounded text-ellipsis"
        >{blocked.teamWins || "No"}</span
      >
    </div>
  </div>
</div>
