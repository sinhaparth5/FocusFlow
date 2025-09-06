<script lang="ts">
  import { onMount } from 'svelte';
  import { slide, fade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { authStore } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  
  let isMobileMenuOpen = false;
  let isUserMenuOpen = false;
  
  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#features', label: 'Features' },
    { href: '#contact', label: 'Contact' },
    { href: '#adhd', label: 'ADHD' }
  ];
  
  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    isUserMenuOpen = false;
  }
  
  function toggleUserMenu() {
    isUserMenuOpen = !isUserMenuOpen;
    isMobileMenuOpen = false;
  }
  
  function closeMobileMenu() {
    isMobileMenuOpen = false;
  }
  
  function closeUserMenu() {
    isUserMenuOpen = false;
  }
  
  function closeAllMenus() {
    isMobileMenuOpen = false;
    isUserMenuOpen = false;
  }
  
  async function handleSignIn() {
    try {
      await authStore.loginWithGoogle();
    } catch (error) {
      console.error('Sign in failed:', error);
      // Fallback to login page
      await goto('/login');
    }
  }
  
  async function handleSignOut() {
    await authStore.logout();
    closeAllMenus();
  }
  
  onMount(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.mobile-menu-container') && !target.closest('.user-menu-container')) {
        closeAllMenus();
      }
    }
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });
</script>

<nav class="bg-[#dbdbdb] relative">
  <div class="container mx-auto px-4 py-2 flex justify-between items-center">
    <!-- Logo -->
    <div class="text-[2rem] text-[#303030] font-display">
      <a href="/" aria-label="Home page button and logo" class="font-bold">FocusFlow</a>
    </div>
    
    <!-- Desktop Navigation -->
    <div class="hidden md:flex gap-4">
      <div class="flex gap-4 text-[#303030] font-bold">
        {#each navLinks as link}
          <a href={link.href} class="hover:text-[#65318E] transition-colors duration-200">
            {link.label}
          </a>
        {/each}
      </div>
      
      <!-- Desktop Auth -->
      <div class="text-[#303030] font-bold">
        {#if $authStore.isAuthenticated && $authStore.user}
          <div class="user-menu-container relative">
            <button 
              on:click={toggleUserMenu}
              class="flex items-center gap-2 hover:text-[#65318E] transition-colors duration-200"
            >
              {#if $authStore.user.avatar}
                <img 
                  src={$authStore.user.avatar} 
                  alt={$authStore.user.name}
                  class="w-8 h-8 rounded-full border-2 border-[#303030]"
                />
              {:else}
                <div class="w-8 h-8 rounded-full bg-[#65318E] text-white flex items-center justify-center text-sm">
                  {$authStore.user.name.charAt(0).toUpperCase()}
                </div>
              {/if}
              <span class="hidden lg:inline">{$authStore.user.name}</span>
              <svg class="w-4 h-4 transition-transform duration-200 {isUserMenuOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {#if isUserMenuOpen}
              <div 
                class="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                transition:slide={{ duration: 200, easing: quintOut }}
              >
                <a href="/dashboard" class="block px-4 py-2 text-[#303030] hover:bg-gray-100" on:click={closeUserMenu}>
                  Dashboard
                </a>
                <a href="/profile" class="block px-4 py-2 text-[#303030] hover:bg-gray-100" on:click={closeUserMenu}>
                  Profile
                </a>
                <a href="/settings" class="block px-4 py-2 text-[#303030] hover:bg-gray-100" on:click={closeUserMenu}>
                  Settings
                </a>
                <hr class="my-2" />
                <button 
                  on:click={handleSignOut}
                  class="block w-full text-left px-4 py-2 text-[#303030] hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            {/if}
          </div>
        {:else}
          <button 
            on:click={handleSignIn}
            class="border-[3px] rounded-[100px] border-[#303030] px-4 py-2 hover:bg-[#303030] hover:text-white transition-all duration-200"
          >
            Sign In
          </button>
        {/if}
      </div>
    </div>
    
    <!-- Mobile Menu Button -->
    <div class="md:hidden mobile-menu-container">
      <button 
        on:click={toggleMobileMenu}
        class="text-[#303030] p-2 flex items-center justify-center w-10 h-10 rounded-md hover:bg-[#d0d0d0] transition-colors duration-200"
        aria-label="Toggle mobile menu"
      >
        {#if isMobileMenuOpen}
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        {:else}
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        {/if}
      </button>
    </div>
  </div>
  
  <!-- Mobile Menu Overlay -->
  {#if isMobileMenuOpen}
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      transition:fade={{ duration: 200 }}
      on:click={closeMobileMenu}
    ></div>
  {/if}
  
  <!-- Mobile Menu -->
  {#if isMobileMenuOpen}
    <div 
      class="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[#e8e8e8] z-50 shadow-2xl"
      transition:slide={{ duration: 300, easing: quintOut, axis: 'x' }}
    >
      <!-- Mobile Menu Header -->
      <div class="flex justify-between items-center p-6 border-b border-[#d0d0d0]">
        {#if $authStore.isAuthenticated && $authStore.user}
          <div class="flex items-center gap-3">
            {#if $authStore.user.avatar}
              <img 
                src={$authStore.user.avatar} 
                alt={$authStore.user.name}
                class="w-10 h-10 rounded-full border-2 border-[#303030]"
              />
            {:else}
              <div class="w-10 h-10 rounded-full bg-[#65318E] text-white flex items-center justify-center font-bold">
                {$authStore.user.name.charAt(0).toUpperCase()}
              </div>
            {/if}
            <div>
              <div class="font-bold text-[#303030]">{$authStore.user.name}</div>
              <div class="text-sm text-[#606060]">{$authStore.user.email}</div>
            </div>
          </div>
        {:else}
          <div class="text-lg font-bold text-[#303030]">Menu</div>
        {/if}
        
        <button 
          on:click={closeMobileMenu}
          class="text-[#303030] p-1"
          aria-label="Close menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Mobile Menu Items -->
      <div class="py-6">
        {#each navLinks as link, i}
          <a 
            href={link.href} 
            class="block px-6 py-4 text-[#303030] font-bold text-lg hover:bg-[#d0d0d0] transition-colors duration-200"
            on:click={closeMobileMenu}
            style="animation-delay: {i * 50}ms"
          >
            {link.label}
          </a>
        {/each}
        
        {#if $authStore.isAuthenticated}
          <hr class="my-4 mx-6 border-[#d0d0d0]" />
          <a 
            href="/dashboard" 
            class="block px-6 py-4 text-[#303030] font-bold text-lg hover:bg-[#d0d0d0] transition-colors duration-200"
            on:click={closeMobileMenu}
          >
            Dashboard
          </a>
          <a 
            href="/profile" 
            class="block px-6 py-4 text-[#303030] font-bold text-lg hover:bg-[#d0d0d0] transition-colors duration-200"
            on:click={closeMobileMenu}
          >
            Profile
          </a>
          <a 
            href="/settings" 
            class="block px-6 py-4 text-[#303030] font-bold text-lg hover:bg-[#d0d0d0] transition-colors duration-200"
            on:click={closeMobileMenu}
          >
            Settings
          </a>
        {/if}
      </div>
      
      <!-- Mobile Menu Footer -->
      <div class="absolute bottom-0 left-0 right-0 p-6 border-t border-[#d0d0d0]">
        {#if $authStore.isAuthenticated}
          <button 
            on:click={handleSignOut}
            class="w-full border-[3px] rounded-[100px] border-[#303030] px-4 py-3 text-[#303030] font-bold hover:bg-[#303030] hover:text-white transition-all duration-200"
          >
            Sign Out
          </button>
        {:else}
          <button 
            on:click={handleSignIn}
            class="w-full border-[3px] rounded-[100px] border-[#303030] px-4 py-3 text-[#303030] font-bold hover:bg-[#303030] hover:text-white transition-all duration-200"
          >
            Sign In with Google
          </button>
        {/if}
      </div>
    </div>
  {/if}
</nav>

<style>
  /* Ensure mobile menu items animate in */
  .mobile-menu-container a {
    animation: slideInFromRight 0.3s ease-out forwards;
    opacity: 0;
    transform: translateX(20px);
  }
  
  @keyframes slideInFromRight {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>