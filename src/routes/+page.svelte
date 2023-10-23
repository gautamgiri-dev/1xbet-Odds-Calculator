<script>
  import {
    LoadConfigurations,
    combineUrls,
    fetchLiveMatches,
    getMatchRelativeURL,
    notify,
  } from "$lib";
  import MatchComponent from "$lib/components/MatchComponent.svelte";
  import { ProgressRadial, getToastStore } from "@skeletonlabs/skeleton";

  import {
    configurations,
    isApplicationIdle,
    toastSettings,
  } from "$lib/stores/config";
  import { onDestroy, onMount } from "svelte";

  let isWatching = false;

  let loadingMessage = "Loading...";
  let isLoading = false;

  let sportsFilter = -1;

  const toastStore = getToastStore();

  /**
   * Creates and displays a toast message with the provided message and settings, or uses default settings if none are provided.
   * Uses the existing toast store to trigger the toast.
   * @param {string} msg - The message to be displayed in the toast.
   * @param {import("@skeletonlabs/skeleton").ToastSettings} [settings] - (Optional) The settings for the toast message.
   * @returns {void}
   */
  function createToast(msg, settings = undefined) {
    /**
     * @type {import("@skeletonlabs/skeleton").ToastSettings}
     * Represents the settings for the toast message. If settings are not provided, default values are used.
     */
    const t = settings
      ? { ...settings, message: msg }
      : {
          message: msg,
          hideDismiss: $toastSettings.hideDismiss,
          timeout: $toastSettings.timeout,
        };
    toastStore.trigger(t);
  }

  /**
   * @type {import("../app").LiveMatches[]}
   */
  let footballMatches = [];
  /**
   * @type {import("../app").LiveMatches[]}
   */
  let basketballMatches = [];

  /**
   * @type {number | undefined}
   */
  let watchInterval;

  async function loadMatches() {
    footballMatches = await fetchLiveMatches($configurations.url, 1);
    basketballMatches = await fetchLiveMatches($configurations.url, 3);
  }

  async function startWatching() {
    $isApplicationIdle = false;
    isLoading = true;
    createToast("Loading live matches...");
    await loadMatches();
    isLoading = false;
    isWatching = true;
    loadingMessage = "Watching...";
    watchInterval = setInterval(loadMatches, 5e3);

    createToast("Started watching live matches...");
  }

  function stopWatching() {
    clearInterval(watchInterval);
    isWatching = false;
    loadingMessage = "Loading...";
    $isApplicationIdle = true;

    createToast("Stopped watching live matches...");
  }

  /**
   * @type {Object.<number, import("../app").BetData>}
   */
  const notificationsSent = {};

  /**
   * @param {import("../app").LiveMatches} match
   * @param {import("../app").BetData} betData
   * @param {string} matchTime
   */
  function notifyCallback(match, betData, matchTime) {
    if (
      JSON.stringify(notificationsSent[match.matchId]) ==
        JSON.stringify(betData) ||
      !$configurations.notifyEnabled
    )
      return;

    notificationsSent[match.matchId] = betData;
    const message = `
    Sport: ${match.sport}
    Team 1: ${match.team1.name}
    Team 2: ${match.team2.name}
    Total: ${betData.total.lines} line ${betData.total.blocked || ""}
    Handicap: ${betData.handicap.lines} line ${betData.total.blocked || ""}
    ${
      match.sportId == 1
        ? `HT Removed: ${betData.htRemoved ? "Yes" : "No"}`
        : ""
    }
    Teams Wins/1x2 Blocked: ${betData.teamWinsBlocked || "No"}
    Match Time Passed: ${matchTime}
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
    )}
    `;

    if (
      !$isApplicationIdle &&
      $configurations.channelId &&
      $configurations.botToken
    )
      notify($configurations.botToken, $configurations.channelId, message);
  }

  onMount(async () => {
    $isApplicationIdle = true;
    await LoadConfigurations();
  });
  onDestroy(() => ($isApplicationIdle = true));
</script>

<div class="p-4 flex justify-between">
  {#if !isWatching}
    <button
      on:click={startWatching}
      class="btn text-sm variant-filled-tertiary"
      disabled={isLoading}>Start Watching</button
    >
  {:else}
    <button on:click={stopWatching} class="btn text-sm variant-filled-error"
      >Stop Watching</button
    >
  {/if}

  {#if isLoading || isWatching}
    <div class="flex gap-2 items-center">
      <ProgressRadial width="w-4" value={undefined} stroke={280} />
      <span class="select-none">{loadingMessage}</span>
    </div>
  {/if}
</div>

{#if isWatching}
  <!-- Render Sports filter element -->
  <div class="px-4">
    <button
      on:click={() => (sportsFilter = -1)}
      class={"btn" + (sportsFilter == -1 ? " variant-ghost-secondary" : "")}
      >All</button
    >
    <button
      on:click={() => (sportsFilter = 1)}
      class={"btn" + (sportsFilter == 1 ? " variant-ghost-secondary" : "")}
      >Football</button
    >
    <button
      on:click={() => (sportsFilter = 3)}
      class={"btn" + (sportsFilter == 3 ? " variant-ghost-secondary" : "")}
      >Basketball</button
    >
  </div>
{/if}

<div class="flex flex-col gap-4 px-2 py-4">
  {#if (sportsFilter == -1 || sportsFilter == 1) && footballMatches.length && isWatching}
    {#each footballMatches as match}
      <MatchComponent domain={$configurations.url} {match} {notifyCallback} />
    {/each}
  {/if}

  {#if (sportsFilter == -1 || sportsFilter == 3) && basketballMatches.length && isWatching}
    {#each basketballMatches as match}
      <MatchComponent domain={$configurations.url} {match} {notifyCallback} />
    {/each}
  {/if}
</div>
