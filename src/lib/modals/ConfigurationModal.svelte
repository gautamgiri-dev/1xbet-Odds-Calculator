<script>
  import { getModalStore, getToastStore } from "@skeletonlabs/skeleton";
  import {
    DEFAULT_CONFIGURATIONS,
    configurations,
    toastSettings,
  } from "$lib/stores/config";
  import { SaveConfigurations } from "$lib";

  const toastStore = getToastStore();

  /**
   * Creates and displays a toast message with the provided message and settings, or uses default settings if none are provided.
   * Uses the existing toast store to trigger the toast.
   * @param {string} msg - The message to be displayed in the toast.
   * @param {import("@skeletonlabs/skeleton").ToastSettings} [settings] - (Optional) The settings for the toast message.
   * @returns {void}
   */
  export function createToast(msg, settings = undefined) {
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

  const modalStore = getModalStore();

  // We've created a custom submit function to pass the response and close the modal.
  async function onFormSubmit() {
    if ($modalStore[0].response) $modalStore[0].response($configurations);

    await SaveConfigurations();
    createToast("Configurations have been updated");
    modalStore.close();
  }

  function onResetDefault() {
    $configurations = DEFAULT_CONFIGURATIONS;
    createToast(
      "Configurations reset. Kindly click 'Save' to store for future use."
    );

    modalStore.close();
  }

  // Base Classes
  const cBase = "card p-4 w-modal shadow-xl space-y-4";
  const cHeader = "text-2xl font-bold";
  const cForm =
    "border border-surface-500 p-4 space-y-4 rounded-container-token";

  /**
   * @type any
   */
  export let parent;
</script>

{#if $modalStore[0]}
  <div class={cBase}>
    <header class={cHeader}>Configurations</header>
    <article>Choose the application specific configurations</article>
    <form class="modal-form {cForm}">
      <label class="label">
        <span>Website URL</span>
        <input
          class="input"
          type="text"
          bind:value={$configurations.url}
          placeholder="Enter 1xBet URL..."
          required
          disabled
        />
      </label>
      <label class="label">
        <span>Bot Token</span>
        <input
          class="input"
          type="text"
          bind:value={$configurations.botToken}
          placeholder="Enter telegram bot token..."
          required
        />
      </label>
      <label class="label">
        <span>Channel ID</span>
        <input
          class="input"
          type="number"
          bind:value={$configurations.channelId}
          placeholder="Enter telegram channel id..."
          required
        />
      </label>
      <label class="flex items-center space-x-2">
        <input
          class="checkbox"
          type="checkbox"
          bind:value={$configurations.notifyEnabled}
          bind:checked={$configurations.notifyEnabled}
        />
        <p>Enable Telegram Notifications</p>
      </label>

      <div>
        <span>Enable notifications for</span>
        <div class="grid grid-cols-2 items-center justify-center">
          <div class="flex items-center space-x-2 mt-2">
            <input
              class="checkbox"
              type="checkbox"
              id="chkNotifyFootball"
              bind:value={$configurations.notifyFootball}
              bind:checked={$configurations.notifyFootball}
            />
            <label for="chkNotifyFootball">Football Matches</label>
          </div>
          <div class="flex items-center space-x-2 mt-2">
            <input
              class="checkbox"
              type="checkbox"
              id="chkNotifyBasketball"
              bind:value={$configurations.notifyBasketball}
              bind:checked={$configurations.notifyBasketball}
            />
            <label for="chkNotifyBasketball">Basketball Matches</label>
          </div>
          <div class="flex items-center space-x-2 mt-2">
            <input
              class="checkbox"
              type="checkbox"
              id="chkNotifyTotalLines"
              bind:value={$configurations.notifyTotalLines}
              bind:checked={$configurations.notifyTotalLines}
            />
            <label for="chkNotifyTotalLines">Total Lines</label>
          </div>
          <div class="flex items-center space-x-2 mt-2">
            <input
              class="checkbox"
              type="checkbox"
              id="chkNotifyHandicapLines"
              bind:value={$configurations.notifyHandicapLines}
              bind:checked={$configurations.notifyHandicapLines}
            />
            <label for="chkNotifyHandicapLines">Handicap Lines</label>
          </div>
          <div class="flex items-center space-x-2 mt-2">
            <input
              class="checkbox"
              type="checkbox"
              id="chkNotifyTotalOneSideBlocked"
              bind:value={$configurations.notifyTotalOneSideBlocked}
              bind:checked={$configurations.notifyTotalOneSideBlocked}
            />
            <label for="chkNotifyTotalOneSideBlocked"
              >Total (One Side Blocked)</label
            >
          </div>
          <div class="flex items-center space-x-2 mt-2">
            <input
              class="checkbox"
              type="checkbox"
              id="chkNotifyHandicapOneSideBlocked"
              bind:value={$configurations.notifyHandicapOneSideBlocked}
              bind:checked={$configurations.notifyHandicapOneSideBlocked}
            />
            <label for="chkNotifyHandicapOneSideBlocked"
              >Handicap (One Side Blocked)</label
            >
          </div>
          <div class="flex items-center space-x-2 mt-2">
            <input
              class="checkbox"
              type="checkbox"
              id="chkNotifyHalfTimeRemoved"
              bind:value={$configurations.notifyHalfTimeRemoved}
              bind:checked={$configurations.notifyHalfTimeRemoved}
            />
            <label for="chkNotifyHalfTimeRemoved">Half Time Lines Removed</label
            >
          </div>
          <div class="flex items-center space-x-2 mt-2">
            <input
              class="checkbox"
              type="checkbox"
              id="chkNotifyTeamWins"
              bind:value={$configurations.notifyTeamWins}
              bind:checked={$configurations.notifyTeamWins}
            />
            <label for="chkNotifyTeamWins">Team Wins (1x2)</label>
          </div>
        </div>
      </div>

      <div>
        <span>Enable notifications for (Esports)</span>
        <div class="grid grid-cols-2 items-center justify-center">
          <div class="flex items-center space-x-2 mt-2">
            <input
              class="checkbox"
              type="checkbox"
              id="chkEnabled"
              bind:value={$configurations.esports.enabled}
              bind:checked={$configurations.esports.enabled}
            />
            <label for="chkEnabled">Send Notifications</label>
          </div>
          <div class="flex items-center space-x-2 mt-2">
            <input
              class="checkbox"
              type="checkbox"
              id="chkNotifyEsportsTotal"
              bind:value={$configurations.esports.notifyTotal}
              bind:checked={$configurations.esports.notifyTotal}
            />
            <label for="chkNotifyEsportsTotal">Total One Side Blocked</label>
          </div>
          <div class="flex items-center space-x-2 mt-2">
            <input
              class="checkbox"
              type="checkbox"
              id="chkNotifyEsportsHandicap"
              bind:value={$configurations.esports.notifyHandicap}
              bind:checked={$configurations.esports.notifyHandicap}
            />
            <label for="chkNotifyEsportsHandicap"
              >Handicap One Side Blocked</label
            >
          </div>
          <div class="flex items-center space-x-2 mt-2">
            <input
              class="checkbox"
              type="checkbox"
              id="chkNotifyEsportsTeamWins"
              bind:value={$configurations.esports.notifyTeamWins}
              bind:checked={$configurations.esports.notifyTeamWins}
            />
            <label for="chkNotifyEsportsTeamWins"
              >Team Wins One Side Blocked</label
            >
          </div>
          <div class="flex items-center space-x-2 mt-2">
            <input
              class="checkbox"
              type="checkbox"
              id="chkNotifyDroppingOdds"
              bind:value={$configurations.esports.notifyDroppingOdds}
              bind:checked={$configurations.esports.notifyDroppingOdds}
            />
            <label for="chkNotifyDroppingOdds">Dropping Odds</label>
          </div>
        </div>
      </div>
    </form>
    <!-- prettier-ignore -->
    <footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Close</button>
        <button class="btn {parent.buttonNeutral}" on:click={onResetDefault}>Reset To Defaults</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Save</button>
    </footer>
  </div>
{/if}
