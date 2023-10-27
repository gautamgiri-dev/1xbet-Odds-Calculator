<script>
  import {
    buildImageUrl,
    combineUrls,
    getInitials,
    getMatchRelativeURL,
    getRequest,
    notify,
  } from "$lib";
  import BattleIcon from "$lib/icons/BattleIcon.svelte";
  import EsportIcon from "$lib/icons/EsportIcon.svelte";
  import { configurations, isApplicationIdle } from "$lib/stores/config";
  import { Avatar } from "@skeletonlabs/skeleton";
  import { onDestroy, onMount } from "svelte";
  /**
   * @type {import("../../app").LiveMatches}
   */
  export let match;
  /**
   * @type {string}
   */
  export let domain;

  const blocked = {
    total: undefined,
    handicap: undefined,
    teamWins: undefined,
    all: undefined,
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
    const cond1 = (arr1 || []).find(cond);
    const cond2 = (arr2 || []).find(cond);

    if (cb) return cb(cond1, cond2);
    else return !!cond1 !== !!cond2;
  }

  const DEFAULT_SCAN_VALUE = {
    droppingOdds: {
      w1: {
        currentValue: 0,
        maxValue: 0,
        shouldNotify: false,
      },
      w2: {
        currentValue: 0,
        maxValue: 0,
        shouldNotify: false,
      },
    },
    handicapBlocked: undefined,
    teamWinsBlocked: undefined,
    totalBlocked: undefined,
    allBlocked: false,
  };

  const DEFAULT_REGULAR_VALUE = {
    map: 0,
    mapName: "Regular Time",
    ...DEFAULT_SCAN_VALUE,
  };

  const DEFAULT_MAP_VALUE = {
    map: -1,
    mapName: undefined,
    ...DEFAULT_SCAN_VALUE,
  };

  /**
   * @type {import("../../app").EsportsScan}
   */
  const esportsScan = {
    regular: DEFAULT_REGULAR_VALUE,
    currentMap: DEFAULT_MAP_VALUE,
  };

  const currentPosition = {
    s1: 0,
    s2: 0,
  };

  async function getCurrentUpdates() {
    // Check Regular Time Odds
    const url = combineUrls(
      domain,
      `/service-api/LiveFeed/GetGameZip?id=${match.matchId}&lng=en&isSubGames=true&GroupEvents=true&countevents=250&grMode=4&partner=71&topGroups=&marketType=1`
    );

    const jsonData = await getRequest(url);
    const valueObj = jsonData.Value;

    if (!valueObj) return;

    const geObj = valueObj["GE"];

    currentPosition.s1 = valueObj["SC"]["FS"]["S1"] || 0;
    currentPosition.s2 = valueObj["SC"]["FS"]["S2"] || 0;

    const totalBets = geObj.find((/** @type {any} */ x) => x["G"] == 17);

    const blockCondition = (/** @type {any} */ x) => x["B"];

    esportsScan.regular.allBlocked = geObj
      .map((/** @type {{ [x: string]: any[]; }} */ x) =>
        x["E"].reduce((a, b) => [...a, ...b], [])
      )
      .reduce((/** @type {any} */ a, /** @type {any} */ b) => [...a, ...b], [])
      .every(blockCondition);

    if (
      $configurations.esports.notifyTotal &&
      totalBets &&
      totalBets["E"].length
    )
      esportsScan.regular.totalBlocked = checkBlocked(
        totalBets["E"][0] || [],
        totalBets["E"][1] || [],
        blockCondition,
        (/** @type {any} */ c1, /** @type {any} */ c2) =>
          !!c1 != !!c2
            ? c1
              ? "- Over Blocked " + `1(${c1["P"]})`
              : c2
              ? "- Under Blocked " + `2(${c2["P"]})`
              : undefined
            : undefined
      );

    const teamWinsBets = geObj.find(
      (/** @type {{ [x: string]: number; }} */ x) => x["G"] == 1
    );

    if (
      $configurations.esports.notifyTeamWins &&
      teamWinsBets &&
      teamWinsBets["E"]?.length > 1
    )
      esportsScan.regular.teamWinsBlocked = checkBlocked(
        teamWinsBets["E"][0],
        teamWinsBets["E"][teamWinsBets.length - 1],
        (/** @type {{ [x: string]: number; }} */ x) =>
          blockCondition(x) && x["C"] > 1.1,
        (/** @type {any} */ c1, /** @type {any} */ c2) =>
          !!c1 != !!c2
            ? c1
              ? "Team 1 Blocked"
              : c2
              ? "Team 2 Blocked"
              : undefined
            : undefined
      );

    // regular time should scan if no maps have been won and odds are dropping

    const regularDroppingOddsCondition =
      currentPosition.s1 == 0 && currentPosition.s2 == 0;

    if (!regularDroppingOddsCondition)
      esportsScan.regular.droppingOdds = DEFAULT_REGULAR_VALUE.droppingOdds;

    if (
      regularDroppingOddsCondition &&
      $configurations.esports.notifyDroppingOdds &&
      teamWinsBets &&
      teamWinsBets["E"]?.length > 1
    ) {
      const currentBets = {
        w1: teamWinsBets["E"][0]["C"],
        w2: teamWinsBets["E"][1]["C"],
      };

      esportsScan.regular.droppingOdds.w1.maxValue = Math.max(
        esportsScan.regular.droppingOdds.w1.maxValue,
        currentBets.w1
      );
      esportsScan.regular.droppingOdds.w2.maxValue = Math.max(
        esportsScan.regular.droppingOdds.w2.maxValue,
        currentBets.w2
      );

      // W1 odds dropping
      if (
        currentBets.w1 < esportsScan.regular.droppingOdds.w1.maxValue &&
        Math.abs(
          currentBets.w1 - esportsScan.regular.droppingOdds.w1.maxValue
        ) /
          esportsScan.regular.droppingOdds.w1.maxValue >=
          esportsScan.regular.droppingOdds.w1.maxValue / 10
      ) {
        esportsScan.regular.droppingOdds.w1 = {
          currentValue: currentBets.w1,
          maxValue: esportsScan.regular.droppingOdds.w1.maxValue,
          shouldNotify: true,
        };
        esportsScan.regular.droppingOdds.w1.maxValue = currentBets.w1;
      }

      // W2 odds dropping
      if (
        currentBets.w2 < esportsScan.regular.droppingOdds.w2.maxValue &&
        Math.abs(
          currentBets.w2 - esportsScan.regular.droppingOdds.w2.maxValue
        ) /
          esportsScan.regular.droppingOdds.w2.maxValue >=
          esportsScan.regular.droppingOdds.w2.maxValue / 20
      ) {
        esportsScan.regular.droppingOdds.w2 = {
          currentValue: currentBets.w2,
          maxValue: esportsScan.regular.droppingOdds.w2.maxValue,
          shouldNotify: true,
        };
        esportsScan.regular.droppingOdds.w2.maxValue = currentBets.w2;
      }
    }

    const handicapBets = geObj.find((/** @type {any} */ x) => x["G"] == 2);

    if (
      $configurations.esports.notifyHandicap &&
      handicapBets &&
      handicapBets["E"].length
    )
      esportsScan.regular.handicapBlocked = checkBlocked(
        handicapBets["E"][0] || [],
        handicapBets["E"][1] || [],
        blockCondition,
        (/** @type {any} */ c1, /** @type {any} */ c2) =>
          !!c1 != !!c2
            ? c1
              ? "- Team 1 Blocked " + `1(${c1["P"]})`
              : c2
              ? "- Team 2 Blocked " + `2(${c2["P"]})`
              : undefined
            : undefined
      );

    // Get current map
    const cp = valueObj["SC"]["CP"];

    if (!cp || cp > 2) esportsScan.currentMap = DEFAULT_MAP_VALUE;

    if (cp < 3) {
      // Extract map specific data

      esportsScan.currentMap.mapName = valueObj["SC"]["CPS"];
      const oneMapUrl = combineUrls(
        domain,
        `/service-api/LiveFeed/GetGameZip?id=${
          match.matchId + cp
        }&lng=en&isSubGames=true&GroupEvents=true&countevents=250&grMode=4&partner=71&topGroups=&marketType=1`
      );

      const oneMapJsonData = await getRequest(oneMapUrl);
      const oneMapValueObj = oneMapJsonData.Value;

      if (!oneMapValueObj) return;

      const oneMapGeObj = oneMapValueObj["GE"];

      esportsScan.currentMap.allBlocked = oneMapGeObj
        .map((/** @type {{ [x: string]: any[]; }} */ x) =>
          x["E"].reduce((a, b) => [...a, ...b], [])
        )
        .reduce(
          (/** @type {any} */ a, /** @type {any} */ b) => [...a, ...b],
          []
        )
        .every(blockCondition);

      const oneMapTotalBets = oneMapGeObj.find(
        (/** @type {any} */ x) => x["G"] == 17
      );

      if (
        $configurations.esports.notifyTotal &&
        oneMapTotalBets &&
        oneMapTotalBets["E"].length
      )
        esportsScan.currentMap.totalBlocked = checkBlocked(
          oneMapTotalBets["E"][0] || [],
          oneMapTotalBets["E"][1] || [],
          blockCondition,
          (/** @type {any} */ c1, /** @type {any} */ c2) =>
            !!c1 != !!c2
              ? c1
                ? "- Over Blocked " + `1(${c1["P"]})`
                : c2
                ? "- Under Blocked " + `2(${c2["P"]})`
                : undefined
              : undefined
        );

      const mapTeamWinsBets = oneMapGeObj.find(
        (/** @type {{ [x: string]: number; }} */ x) => x["G"] == 1
      );

      if (
        $configurations.esports.notifyTeamWins &&
        mapTeamWinsBets &&
        mapTeamWinsBets["E"]?.length > 1
      )
        esportsScan.regular.teamWinsBlocked = checkBlocked(
          mapTeamWinsBets["E"][0],
          mapTeamWinsBets["E"][mapTeamWinsBets.length - 1],
          (/** @type {{ [x: string]: number; }} */ x) =>
            blockCondition(x) && x["C"] > 1.1,
          (/** @type {any} */ c1, /** @type {any} */ c2) =>
            !!c1 != !!c2
              ? c1
                ? "Team 1 Blocked"
                : c2
                ? "Team 2 Blocked"
                : undefined
              : undefined
        );

      const psObject = valueObj["SC"]["PS"][cp - 1];
      const mapCurrentPosition = {
        s1: psObject["Value"]["S1"],
        s2: psObject["Value"]["S2"],
      };

      const shouldNotifyMapDroppingOdds =
        mapCurrentPosition.s1 == 0 && mapCurrentPosition.s2 == 0;

      if (!shouldNotifyMapDroppingOdds)
        esportsScan.currentMap.droppingOdds = DEFAULT_MAP_VALUE.droppingOdds;

      if (
        shouldNotifyMapDroppingOdds &&
        $configurations.esports.notifyDroppingOdds &&
        mapTeamWinsBets &&
        mapTeamWinsBets["E"]?.length > 1
      ) {
        const mapCurrentBets = {
          w1: mapTeamWinsBets["E"][0]["C"],
          w2: mapTeamWinsBets["E"][1]["C"],
        };

        esportsScan.currentMap.droppingOdds.w1.maxValue = Math.max(
          esportsScan.currentMap.droppingOdds.w1.maxValue,
          mapCurrentBets.w1
        );
        esportsScan.currentMap.droppingOdds.w2.maxValue = Math.max(
          esportsScan.currentMap.droppingOdds.w2.maxValue,
          mapCurrentBets.w2
        );

        // W1 odds dropping
        if (
          mapCurrentBets.w1 < esportsScan.currentMap.droppingOdds.w1.maxValue &&
          Math.abs(
            mapCurrentBets.w1 - esportsScan.currentMap.droppingOdds.w1.maxValue
          ) /
            esportsScan.currentMap.droppingOdds.w1.maxValue >=
            esportsScan.currentMap.droppingOdds.w1.maxValue / 10
        ) {
          esportsScan.currentMap.droppingOdds.w1 = {
            currentValue: mapCurrentBets.w1,
            maxValue: esportsScan.currentMap.droppingOdds.w1.maxValue,
            shouldNotify: true,
          };
          esportsScan.currentMap.droppingOdds.w1.maxValue = mapCurrentBets.w1;
        }

        // W2 odds dropping
        if (
          mapCurrentBets.w2 < esportsScan.currentMap.droppingOdds.w2.maxValue &&
          Math.abs(
            mapCurrentBets.w2 - esportsScan.currentMap.droppingOdds.w2.maxValue
          ) /
            esportsScan.currentMap.droppingOdds.w2.maxValue >=
            esportsScan.currentMap.droppingOdds.w2.maxValue / 20
        ) {
          esportsScan.currentMap.droppingOdds.w2 = {
            currentValue: mapCurrentBets.w2,
            maxValue: esportsScan.currentMap.droppingOdds.w2.maxValue,
            shouldNotify: true,
          };
          esportsScan.currentMap.droppingOdds.w2.maxValue = mapCurrentBets.w2;
        }
      }

      const mapHandicapBets = geObj.find((/** @type {any} */ x) => x["G"] == 2);

      if (
        $configurations.esports.notifyHandicap &&
        mapHandicapBets &&
        mapHandicapBets["E"].length
      )
        esportsScan.regular.handicapBlocked = checkBlocked(
          mapHandicapBets["E"][0] || [],
          mapHandicapBets["E"][1] || [],
          blockCondition,
          (/** @type {any} */ c1, /** @type {any} */ c2) =>
            !!c1 != !!c2
              ? c1
                ? "- Team 1 Blocked " + `1(${c1["P"]})`
                : c2
                ? "- Team 2 Blocked " + `2(${c2["P"]})`
                : undefined
              : undefined
        );
    }
    checkNotifyCondition();
  }

  /**
   * @type {string[]}
   */
  const notificationsSent = [];

  function checkNotifyCondition() {
    let shouldNotify = false;
    let payloadMessage = `
    Sport: Esports (Dota2)
    Team 1: ${match.team1.name}
    Team 2: ${match.team2.name}
    Current Score: ${currentPosition.s1}:${currentPosition.s2}
    Match URL: ${combineUrls(
      $configurations.url,
      getMatchRelativeURL(
        match.sport,
        match.league,
        match.leagueId,
        match.matchId,
        match.team1.name,
        match.team2.name
      )
    )}`;

    // Total Lines Blocked
    if ($configurations.esports.notifyTotal) {
      if (esportsScan.regular.totalBlocked && !esportsScan.regular.allBlocked) {
        shouldNotify ||= true;
        payloadMessage += `\nTotal (Regular Time): ${esportsScan.regular.totalBlocked}`;
      }

      if (
        esportsScan.currentMap.totalBlocked &&
        !esportsScan.currentMap.allBlocked
      ) {
        shouldNotify ||= true;
        payloadMessage += `\nTotal (${esportsScan.currentMap.mapName}): ${esportsScan.currentMap.totalBlocked}`;
      }
    }

    // Handicap Lines Blocked
    if ($configurations.esports.notifyHandicap) {
      if (
        esportsScan.regular.handicapBlocked &&
        !esportsScan.regular.allBlocked
      ) {
        shouldNotify ||= true;
        payloadMessage += `\nHandicap (Regular Time): ${esportsScan.regular.handicapBlocked}`;
      }

      if (
        esportsScan.currentMap.handicapBlocked &&
        !esportsScan.currentMap.allBlocked
      ) {
        shouldNotify ||= true;
        payloadMessage += `\nHandicap (${esportsScan.currentMap.mapName}): ${esportsScan.currentMap.handicapBlocked}`;
      }
    }

    // Team Wins Lines Blocked
    if ($configurations.esports.notifyTeamWins) {
      if (
        esportsScan.regular.teamWinsBlocked &&
        !esportsScan.regular.allBlocked
      ) {
        shouldNotify ||= true;
        payloadMessage += `\nTeam Wins (Regular Time): ${esportsScan.regular.teamWinsBlocked}`;
      }

      if (
        esportsScan.currentMap.teamWinsBlocked &&
        !esportsScan.currentMap.allBlocked
      ) {
        shouldNotify ||= true;
        payloadMessage += `\nTeam Wins (${esportsScan.currentMap.mapName}): ${esportsScan.regular.teamWinsBlocked}`;
      }
    }

    let change, percentage;
    // Dropping Odds
    if ($configurations.esports.notifyDroppingOdds) {
      // Regular Dropping Odds
      if (esportsScan.regular.droppingOdds.w1.shouldNotify) {
        change =
          esportsScan.regular.droppingOdds.w1.maxValue -
          esportsScan.regular.droppingOdds.w1.currentValue;
        percentage =
          ((esportsScan.regular.droppingOdds.w1.currentValue -
            esportsScan.regular.droppingOdds.w1.maxValue) *
            100) /
          esportsScan.regular.droppingOdds.w1.maxValue;

        shouldNotify ||= true;
        payloadMessage += `\nRegular Time Odds Dropped (w1): ${change} (${percentage})`;
      }

      if (esportsScan.regular.droppingOdds.w2.shouldNotify) {
        change =
          esportsScan.regular.droppingOdds.w2.maxValue -
          esportsScan.regular.droppingOdds.w2.currentValue;
        percentage =
          ((esportsScan.regular.droppingOdds.w2.currentValue -
            esportsScan.regular.droppingOdds.w2.maxValue) *
            100) /
          esportsScan.regular.droppingOdds.w2.maxValue;

        shouldNotify ||= true;
        payloadMessage += `\nRegular Time Odds Dropped (w2): ${change} (${percentage})`;
      }

      // Map Dropping Odds
      if (esportsScan.currentMap.droppingOdds.w1.shouldNotify) {
        change =
          esportsScan.currentMap.droppingOdds.w1.maxValue -
          esportsScan.currentMap.droppingOdds.w1.currentValue;
        percentage =
          ((esportsScan.currentMap.droppingOdds.w1.currentValue -
            esportsScan.currentMap.droppingOdds.w1.maxValue) *
            100) /
          esportsScan.currentMap.droppingOdds.w1.maxValue;

        shouldNotify ||= true;
        payloadMessage += `\n${esportsScan.currentMap.mapName} Odds Dropped (w1): ${change} (${percentage})`;
      }

      if (esportsScan.currentMap.droppingOdds.w2.shouldNotify) {
        change =
          esportsScan.currentMap.droppingOdds.w2.maxValue -
          esportsScan.currentMap.droppingOdds.w2.currentValue;
        percentage =
          ((esportsScan.currentMap.droppingOdds.w2.currentValue -
            esportsScan.currentMap.droppingOdds.w2.maxValue) *
            100) /
          esportsScan.currentMap.droppingOdds.w2.maxValue;

        shouldNotify ||= true;
        payloadMessage += `\n${esportsScan.currentMap.mapName} Odds Dropped (w2): ${change} (${percentage})`;
      }
    }

    if (
      notificationsSent.includes(payloadMessage) ||
      !$configurations.notifyEnabled
    )
      return;

    if (
      !$isApplicationIdle &&
      $configurations.channelId &&
      $configurations.botToken &&
      shouldNotify
    ) {
      notify(
        $configurations.botToken,
        $configurations.channelId,
        payloadMessage
      );
      notificationsSent.push(payloadMessage);
    }
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
        <EsportIcon />
        {match.sport}{" \u2022 "}{match.league}
      </div>
    </div>
    <div class="flex gap-2 items-center">
      <div class="flex gap-1 items-center">
        <Avatar width="w-6" initials={getInitials(match.team1.name)} />
        <span>{match.team1.name}</span>
      </div>
      <span>v/s</span>
      <div class="flex gap-1 items-center">
        <Avatar width="w-6" initials={getInitials(match.team2.name)} />
        <span>{match.team2.name}</span>
      </div>
    </div>
  </div>

  <div
    class="flex space-x-1 bg-surface-800 px-2 py-1 rounded items-center w-fit mx-auto"
  >
    <BattleIcon />
    <span>{currentPosition.s1}:{currentPosition.s2}</span>
  </div>
</div>
