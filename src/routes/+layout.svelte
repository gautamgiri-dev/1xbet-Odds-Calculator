<script>
  import "../app.postcss";
  import {
    AppShell,
    AppBar,
    Modal,
    Toast,
    getToastStore,
  } from "@skeletonlabs/skeleton";
  import ConfigurationModal from "$lib/modals/ConfigurationModal.svelte";
  import { getModalStore } from "@skeletonlabs/skeleton";
  import { initializeStores } from "@skeletonlabs/skeleton";
  import { isApplicationIdle, toastSettings } from "$lib/stores/config";

  initializeStores();

  const toastStore = getToastStore();
  const modalStore = getModalStore();

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
          timeout: $toastSettings.timeout,
          hideDismiss: $toastSettings.hideDismiss,
        };
    toastStore.trigger(t);
  }

  function OpenConfigurationModal() {
    if (!$isApplicationIdle)
      return createToast(
        "Can't access configurations while application is running"
      );

    /**
     * @type {import("@skeletonlabs/skeleton").ModalSettings}
     */
    const modal = {
      type: "component",
      component: {
        ref: ConfigurationModal,
      },
    };

    modalStore.trigger(modal);
  }
</script>

<Modal />
<Toast background={$toastSettings.background} />
<!-- App Shell -->
<AppShell>
  <slot name="header">
    <!-- App Bar -->
    <AppBar>
      <svelte:fragment slot="lead">
        <strong class="text-xl">1xBet Watcher v1.0</strong>
      </svelte:fragment>
      <svelte:fragment slot="trail">
        <button
          class="btn btn-sm variant-ghost-surface"
          on:click={OpenConfigurationModal}
        >
          Configurations
        </button>
      </svelte:fragment>
    </AppBar>
  </slot>
  <!-- Page Route Content -->
  <slot />
</AppShell>
