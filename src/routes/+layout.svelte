<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  
  // Svelte animations
  import { fly, fade } from 'svelte/transition';
  import { quartOut } from 'svelte/easing';
  
  // We'll import these components after we create them
  // import Navbar from '../components/Navbar.svelte';
  import Footer from '../components/Footer.svelte';
  
  let mounted = false;
  let pageTransition = false;
  
  // Reactive variables to control which components to show
  $: isAuthPage = $page.route.id?.startsWith('/auth');
  $: isDashboard = $page.route.id?.startsWith('/dashboard') || 
                   $page.route.id?.startsWith('/tasks') || 
                   $page.route.id?.startsWith('/calendar') || 
                   $page.route.id?.startsWith('/reminders');
  $: showFooter = !isAuthPage && !isDashboard;
  
  // Page transition trigger
  $: if (mounted && $page.url) {
    pageTransition = true;
    setTimeout(() => pageTransition = false, 100);
  }
  
  onMount(() => {
    if (browser) {
      mounted = true;
      
      // Initialize theme
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = savedTheme || (prefersDark ? 'dark' : 'light');
      
      document.documentElement.classList.toggle('dark', theme === 'dark');
      document.documentElement.style.scrollBehavior = 'smooth';
    }
  });
</script>

<!-- Main Layout Wrapper -->
<div class="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  
  <!-- Navbar Placeholder - We'll uncomment this after creating the component -->
 
  <!-- {#if !isAuthPage}
    <Navbar />
  {/if} -->

  
  
  <!-- Main Content with Page Transitions -->
  <main class="flex-1">
    {#key $page.url.pathname}
      <div 
        class="min-h-full"
        in:fly={{ 
          x: pageTransition ? 20 : 0, 
          duration: 400, 
          easing: quartOut 
        }}
        out:fly={{ 
          x: -20, 
          duration: 300, 
          easing: quartOut 
        }}
      >
        <slot />
      </div>
    {/key}
  </main>

  <!-- Footer Placeholder - We'll uncomment this after creating the component -->
  {#if showFooter}
    <Footer />
  {/if}
  
</div>

<!-- Background Pattern Animation (only on homepage) -->
{#if mounted && !isAuthPage && $page.route.id === '/'}
  <div class="fixed inset-0 pointer-events-none z-0 opacity-5 overflow-hidden">
    <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      {#each Array(20) as _, i}
        <circle 
          cx={Math.random() * 100} 
          cy={Math.random() * 100} 
          r={Math.random() * 0.5 + 0.1}
          fill="currentColor"
          class="text-rose-400 dark:text-rose-600"
          style="
            animation: float {2000 + Math.random() * 3000}ms ease-in-out infinite;
            animation-delay: {Math.random() * 5000}ms;
          "
          in:fade={{ duration: 2000, delay: i * 100 }}
        />
      {/each}
    </svg>
  </div>
{/if}

<style>
  /* Global styles */
  :global(html, body) {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    font-family: 'Nunito Sans', ui-sans-serif, system-ui, sans-serif;
  }
  
  :global(#svelte) {
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* Background animation */
  @keyframes float {
    0%, 100% { 
      transform: translateY(0px) rotate(0deg);
      opacity: 0.3;
    }
    50% { 
      transform: translateY(-20px) rotate(180deg);
      opacity: 0.8;
    }
  }

  /* Gradient text utility */
  .bg-clip-text {
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* Smooth transitions */
  :global(*) {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  }

  /* Custom scrollbar */
  :global(*::-webkit-scrollbar) {
    width: 6px;
  }

  :global(*::-webkit-scrollbar-track) {
    background: transparent;
  }

  :global(*::-webkit-scrollbar-thumb) {
    background: rgb(244 63 94 / 0.3);
    border-radius: 3px;
  }

  :global(*::-webkit-scrollbar-thumb:hover) {
    background: rgb(244 63 94 / 0.5);
  }

  /* Focus styles */
  :global(*:focus-visible) {
    outline: 2px solid rgb(244 63 94);
    outline-offset: 2px;
    border-radius: 6px;
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
</style>