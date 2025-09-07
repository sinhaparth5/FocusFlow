<script lang="ts">
  import Navbar from './Navbar.svelte';
  import Footer from './Footer.svelte';
  import Hero from './Sections/Hero.svelte';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  export let showScrollTop = false;
  export let fullWidth = false;
  
  let scrollY = 0;
  let showScrollButton = false;
  
  $: if (scrollY > 300) {
    showScrollButton = true;
  } else {
    showScrollButton = false;
  }
  
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  onMount(() => {
    // Add fade-in animation to main content
    const main = document.querySelector('main');
    if (main) {
      main.classList.add('animate-fade-in-up');
    }
  });
</script>

<svelte:window bind:scrollY />

<div class="min-h-screen flex flex-col bg-gradient-to-br from-rose-50/30 via-white to-rose-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
  <Navbar />
  
  <main class="bg-[#dbdbdb]">
    <div class="flex-1 bg-[#dbdbdb] {fullWidth ? '' : 'container mx-auto px-4 sm:px-6 lg:px-8 py-8'}">
      <Hero />
      <slot />
    </div>
  </main>
  
  <Footer />
  
  <!-- Scroll to Top Button -->
  {#if showScrollButton && showScrollTop}
    <button
      on:click={scrollToTop}
      class="scroll-top-btn"
      transition:fade={{ duration: 300, easing: quintOut }}
      aria-label="Scroll to top"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  {/if}
</div>