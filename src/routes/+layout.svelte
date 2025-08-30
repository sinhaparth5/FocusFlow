<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { 
    initializeStores, 
    Drawer, 
    getDrawerStore, 
    Toast, 
    getToastStore, 
    Modal, 
    getModalStore,
    storePopup
  } from '@skeletonlabs/skeleton-svelte';
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
  
  import Navbar from '../components/Navbar.svelte';
  import { authStore } from '$lib/stores/auth';
  
  // Initialize Skeleton stores
  initializeStores();
  
  // Configure popup
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
  
  const drawerStore = getDrawerStore();
  const toastStore = getToastStore();
  const modalStore = getModalStore();
  
  $: isAuthPage = $page.route.id?.startsWith('/auth');
  $: isDashboard = $page.route.id?.startsWith('/dashboard') || 
                   $page.route.id?.startsWith('/tasks') || 
                   $page.route.id?.startsWith('/calendar') || 
                   $page.route.id?.startsWith('/reminders');
  
  onMount(() => {
    if (browser) {
      // Initialize auth store
      authStore.init();
    }
  });
</script>

<!-- App Shell Structure -->
<Drawer>
  <div class="p-4">
    <h2 class="text-lg font-semibold mb-4">Quick Navigation</h2>
    <!-- Drawer content for mobile navigation -->
    <nav class="space-y-2">
      {#if $authStore.isAuthenticated}
        <a href="/dashboard" class="block p-2 rounded hover:bg-surface-hover-token">Dashboard</a>
        <a href="/tasks" class="block p-2 rounded hover:bg-surface-hover-token">Tasks</a>
        <a href="/calendar" class="block p-2 rounded hover:bg-surface-hover-token">Calendar</a>
        <a href="/reminders" class="block p-2 rounded hover:bg-surface-hover-token">Reminders</a>
      {:else}
        <a href="/" class="block p-2 rounded hover:bg-surface-hover-token">Home</a>
        <a href="/#features" class="block p-2 rounded hover:bg-surface-hover-token">Features</a>
        <a href="/#pricing" class="block p-2 rounded hover:bg-surface-hover-token">Pricing</a>
      {/if}
    </nav>
  </div>
</Drawer>

<Toast />
<Modal />

<!-- Main App Structure -->
<div class="h-screen flex flex-col bg-surface-50-900-token">
  <!-- Navbar - Only show if not on auth pages -->
  {#if !isAuthPage}
    <header class="flex-none z-50 sticky top-0">
      <Navbar />
    </header>
  {/if}
  
  <!-- Main Content Area -->
  <main class="flex-1 overflow-hidden">
    <slot />
  </main>
</div>

<style>
  /* Additional layout styles */
  :global(html, body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }
  
  :global(#svelte) {
    height: 100%;
  }
</style>