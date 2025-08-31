
<script lang="ts">
  import '../app.css';
  import MainLayout from '../components/MainLayout.svelte';
  import { authStore } from '$lib/stores/auth';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  
  // Initialize auth on app load
  onMount(() => {
    authStore.init();
  });
  
  // Determine if scroll-to-top button should show
  $: showScrollTop = $page.route?.id !== '/';
</script>

<MainLayout {showScrollTop}>
  <slot />
</MainLayout>