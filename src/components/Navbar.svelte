<!-- src/lib/components/Navbar.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  // Svelte animations
  import { fly, slide, fade, scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { spring } from 'svelte/motion';
  import { elasticOut, quartOut, backOut, bounceOut } from 'svelte/easing';
  
  // Icons
  import { 
    Menu, 
    X, 
    LogIn, 
    Sparkles, 
    Sun, 
    Moon 
  } from 'lucide-svelte';
  
  let mounted = false;
  let mobileMenuOpen = false;
  let hoveredLink = '';
  let isDarkMode = false;
  
  // Spring animations for logo
  const logoScale = spring(1, { stiffness: 0.2, damping: 0.4 });
  const logoRotation = spring(0, { stiffness: 0.1, damping: 0.8 });
  
  onMount(() => {
    mounted = true;
    // Check current theme
    isDarkMode = document.documentElement.classList.contains('dark');
  });
  
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
  
  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }
  
  function handleLogoHover() {
    logoScale.set(1.1);
    logoRotation.set(10);
  }
  
  function handleLogoLeave() {
    logoScale.set(1);
    logoRotation.set(0);
  }
  
  function handleGetStarted() {
    goto('/auth/signup');
  }
  
  // Navigation links
  const navLinks = [
    { href: '/#features', label: 'Features', id: 'features' },
    { href: '/#pricing', label: 'Pricing', id: 'pricing' },
    { href: '/about', label: 'About', id: 'about' },
    { href: '/contact', label: 'Contact', id: 'contact' }
  ];
</script>

<nav class="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      
      <!-- Logo Section -->
      <div class="flex items-center">
        <a 
          href="/"
          class="flex items-center space-x-3"
          on:mouseenter={handleLogoHover}
          on:mouseleave={handleLogoLeave}
        >
          <div 
            class="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg transition-shadow duration-300 hover:shadow-xl"
            style="transform: scale({$logoScale}) rotate({$logoRotation}deg)"
          >
            <Sparkles class="w-6 h-6 text-white drop-shadow-sm" strokeWidth={2.5} />
          </div>
          <div class="hidden sm:block">
            <h1 class="text-xl font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent">
              FocusFlow
            </h1>
            <p class="text-xs text-gray-500 dark:text-gray-400 -mt-1">Productivity Suite</p>
          </div>
        </a>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:block">
        <div class="ml-10 flex items-baseline space-x-4">
          {#each navLinks as link, i (link.id)}
            <div animate:flip={{ duration: 300, easing: quartOut }}>
              <a 
                href={link.href}
                class="nav-link relative group"
                on:mouseenter={() => hoveredLink = link.id}
                on:mouseleave={() => hoveredLink = ''}
                in:fly={{ x: -20, duration: 300, delay: mounted ? i * 100 : 0, easing: backOut }}
              >
                <span 
                  class="relative z-10 transition-all duration-200"
                  class:scale-105={hoveredLink === link.id}
                >
                  {link.label}
                </span>
                
                <!-- Animated underline -->
                {#if hoveredLink === link.id}
                  <div 
                    class="absolute bottom-0 left-1/2 w-6 h-0.5 bg-rose-500 rounded-full transform -translate-x-1/2"
                    in:scale={{ duration: 200, easing: elasticOut }}
                  />
                {/if}
              </a>
            </div>
          {/each}
        </div>
      </div>

      <!-- Desktop Actions -->
      <div class="hidden md:flex items-center space-x-4">
        <!-- Theme Toggle -->
        <button
          on:click={toggleDarkMode}
          class="theme-toggle"
          in:fly={{ y: -10, duration: 300, delay: 400, easing: bounceOut }}
        >
          {#if isDarkMode}
            <div in:scale={{ duration: 200 }} out:scale={{ duration: 200 }}>
              <Sun class="w-5 h-5" />
            </div>
          {:else}
            <div in:scale={{ duration: 200 }} out:scale={{ duration: 200 }}>
              <Moon class="w-5 h-5" />
            </div>
          {/if}
        </button>

        <!-- Sign In Link -->
        <a 
          href="/auth/login"
          class="sign-in-link"
          in:fly={{ y: -10, duration: 300, delay: 500, easing: bounceOut }}
        >
          Sign In
        </a>

        <!-- Get Started Button -->
        <button
          on:click={handleGetStarted}
          class="get-started-btn group"
          in:fly={{ y: -10, duration: 300, delay: 600, easing: bounceOut }}
        >
          <LogIn class="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-200" />
          Get Started
        </button>
      </div>

      <!-- Mobile Actions -->
      <div class="md:hidden flex items-center space-x-2">
        <!-- Mobile Theme Toggle -->
        <button
          on:click={toggleDarkMode}
          class="mobile-theme-toggle"
          in:scale={{ duration: 300, delay: 200 }}
        >
          {#if isDarkMode}
            <Sun class="w-5 h-5" />
          {:else}
            <Moon class="w-5 h-5" />
          {/if}
        </button>

        <!-- Mobile Menu Toggle -->
        <button
          on:click={toggleMobileMenu}
          class="mobile-menu-toggle"
          class:rotate-90={mobileMenuOpen}
          in:scale={{ duration: 300, delay: 300, easing: elasticOut }}
        >
          {#if mobileMenuOpen}
            <div in:scale={{ duration: 200 }} out:scale={{ duration: 200 }}>
              <X class="w-6 h-6" />
            </div>
          {:else}
            <div in:scale={{ duration: 200 }} out:scale={{ duration: 200 }}>
              <Menu class="w-6 h-6" />
            </div>
          {/if}
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if mobileMenuOpen}
    <div 
      class="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
      in:slide={{ duration: 300, easing: quartOut }}
      out:slide={{ duration: 250 }}
    >
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        
        <!-- Mobile Navigation Links -->
        {#each navLinks as link, i}
          <a
            href={link.href}
            class="mobile-nav-link"
            on:click={toggleMobileMenu}
            in:fly={{ x: -50, duration: 300, delay: i * 100, easing: quartOut }}
          >
            {link.label}
          </a>
        {/each}

        <!-- Mobile Auth Section -->
        <div 
          class="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2"
          in:fade={{ duration: 400, delay: 400 }}
        >
          <a
            href="/auth/login"
            class="mobile-auth-link"
            on:click={toggleMobileMenu}
          >
            Sign In
          </a>
          <button
            on:click={() => { toggleMobileMenu(); handleGetStarted(); }}
            class="mobile-get-started-btn"
          >
            <LogIn class="w-4 h-4" />
            <span>Get Started</span>
          </button>
        </div>
      </div>
    </div>
  {/if}
</nav>

<style>
  /* Navigation Links */
  .nav-link {
    @apply px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200;
    @apply text-gray-600 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-400;
    @apply hover:bg-rose-50 dark:hover:bg-rose-900/20;
  }

  /* Theme Toggle */
  .theme-toggle {
    @apply p-2 rounded-lg transition-all duration-200 hover:scale-110;
    @apply text-gray-600 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-400;
    @apply hover:bg-gray-100 dark:hover:bg-gray-800;
  }

  /* Sign In Link */
  .sign-in-link {
    @apply text-sm font-medium transition-colors duration-200;
    @apply text-gray-600 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-400;
  }

  /* Get Started Button */
  .get-started-btn {
    @apply inline-flex items-center px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200;
    @apply text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700;
    @apply shadow-lg hover:shadow-xl transform hover:scale-105;
  }

  /* Mobile Theme Toggle */
  .mobile-theme-toggle {
    @apply p-2 rounded-lg transition-colors duration-200;
    @apply text-gray-600 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-400;
  }

  /* Mobile Menu Toggle */
  .mobile-menu-toggle {
    @apply p-2 rounded-lg transition-all duration-200;
    @apply text-gray-600 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-400;
    @apply hover:bg-gray-100 dark:hover:bg-gray-800;
  }

  /* Mobile Navigation Links */
  .mobile-nav-link {
    @apply block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200;
    @apply text-gray-700 hover:text-rose-600 dark:text-gray-200 dark:hover:text-rose-400;
    @apply hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:translate-x-1;
  }

  /* Mobile Auth Link */
  .mobile-auth-link {
    @apply block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200;
    @apply text-gray-700 hover:text-rose-600 dark:text-gray-200 dark:hover:text-rose-400;
    @apply hover:bg-gray-100 dark:hover:bg-gray-800;
  }

  /* Mobile Get Started Button */
  .mobile-get-started-btn {
    @apply w-full flex items-center justify-start space-x-2 px-3 py-2 rounded-lg text-base font-medium;
    @apply text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700;
    @apply shadow-lg transition-all duration-200;
  }

  /* Gradient text */
  .bg-clip-text {
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* Smooth transitions */
  nav a,
  nav button {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Hover effects */
  nav a:hover,
  nav button:hover {
    transform: translateY(-1px);
  }

  /* Focus styles */
  nav a:focus-visible,
  nav button:focus-visible {
    outline: 2px solid rgb(244 63 94);
    outline-offset: 2px;
    border-radius: 6px;
  }
</style>