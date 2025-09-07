
<script lang="ts">
  import '../app.css';
  import MainLayout from '../components/MainLayout.svelte';
  import { authStore } from '$lib/stores/auth';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  
  onMount(() => {
    authStore.init();
  });
  
  $: showScrollTop = $page.route?.id !== '/';
</script>

<MainLayout {showScrollTop}>
  <slot />
</MainLayout>