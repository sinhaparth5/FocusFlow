<script lang="ts">
  import { onMount } from 'svelte';
  import { slide, fade, fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { quintOut, elasticOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';
  import { authStore } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  
  let isMobileMenuOpen = false;
  let isUserMenuOpen = false;
  
  const arrowRotation = tweened(0, { duration: 200, easing: quintOut });
  $: arrowRotation.set(isUserMenuOpen ? 180 : 0);
  
  const navLinks = [
    { href: '#about', label: 'About', id: 'about' },
    { href: '#features', label: 'Features', id: 'features' },
    { href: '#contact', label: 'Contact', id: 'contact' },
    { href: '#adhd', label: 'ADHD', id: 'adhd' }
  ];
  
  const userMenuItems = [
    { href: '/dashboard', label: 'Dashboard', id: 'dashboard' },
    { href: '/profile', label: 'Profile', id: 'profile' },
    { href: '/settings', label: 'Settings', id: 'settings' }
  ];
  
  const menuControls = {
    toggleMobile: () => {
      isMobileMenuOpen = !isMobileMenuOpen;
      isUserMenuOpen = false;
    },
    toggleUser: () => {
      isUserMenuOpen = !isUserMenuOpen;
      isMobileMenuOpen = false;
    },
    closeAll: () => {
      isMobileMenuOpen = false;
      isUserMenuOpen = false;
    }
  };
  
  const authHandlers = {
    signIn: async () => {
      try {
        await authStore.loginWithGoogle();
      } catch (error) {
        console.error('Sign in failed:', error);
        await goto('/login');
      }
    },
    signOut: async () => {
      await authStore.logout();
      menuControls.closeAll();
    }
  };
  
  const handleMenuClick = (callback?: () => void) => {
    menuControls.closeAll();
    callback?.();
  };
  
  onMount(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.mobile-menu-container') && !target.closest('.user-menu-container')) {
        menuControls.closeAll();
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });
</script>

<nav class="bg-[#dbdbdb] relative">
  <div class="container mx-auto px-4 py-2 flex justify-between items-center">
    <div class="text-[2rem] text-[#303030] font-display">
      <a href="/" aria-label="Home page button and logo" class="font-bold">FocusFlow</a>
    </div>
    
    <div class="hidden md:flex gap-4">
      <div class="flex gap-4 text-[#303030] font-bold justify-center items-center">
        {#each navLinks as link (link.id)}
          <a 
            href={link.href} 
            class="hover:text-[#65318E] transition-colors duration-200"
            animate:flip={{ duration: 200 }}
          >
            {link.label}
          </a>
        {/each}
      </div>
      
      <div class="text-[#303030] font-bold">
        {#if $authStore.isAuthenticated && $authStore.user}
          <div class="user-menu-container relative">
            <button 
              on:click={menuControls.toggleUser}
              class="flex items-center gap-2 hover:text-[#65318E] transition-colors duration-200"
            >
              {#if $authStore.user.avatar}
                <img 
                  src={$authStore.user.avatar} 
                  alt={$authStore.user.name}
                  class="w-8 h-8 rounded-full border-2 border-[#303030]"
                  transition:fly={{ y: -10, duration: 300 }}
                />
              {:else}
                <div 
                  class="w-8 h-8 rounded-full bg-[#65318E] text-white flex items-center justify-center text-sm"
                  transition:fly={{ y: -10, duration: 300 }}
                >
                  {$authStore.user.name.charAt(0).toUpperCase()}
                </div>
              {/if}
              <span class="hidden lg:inline">{$authStore.user.name}</span>
              <svg 
                class="w-4 h-4 transition-transform duration-200" 
                style="transform: rotate({$arrowRotation}deg)"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {#if isUserMenuOpen}
              <div 
                class="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                transition:slide={{ duration: 200, easing: quintOut }}
              >
                {#each userMenuItems as item (item.id)}
                  <a 
                    href={item.href} 
                    class="block px-4 py-2 text-[#303030] hover:bg-gray-100" 
                    on:click={() => handleMenuClick()}
                    animate:flip={{ duration: 150 }}
                  >
                    {item.label}
                  </a>
                {/each}
                <hr class="my-2" />
                <button 
                  on:click={authHandlers.signOut}
                  class="block w-full text-left px-4 py-2 text-[#303030] hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            {/if}
          </div>
        {:else}
          <button 
            on:click={authHandlers.signIn}
            class="border-[3px] rounded-[100px] border-[#303030] px-4 py-2 hover:bg-[#303030] hover:text-white transition-all duration-200"
            transition:fly={{ x: 20, duration: 300 }}
          >
            Sign In
          </button>
        {/if}
      </div>
    </div>
    
    <button 
      on:click|stopPropagation={menuControls.toggleMobile}
      class="md:hidden text-[#303030] p-3 -m-1 flex items-center justify-center min-w-[44px] min-h-[44px] rounded-md hover:bg-[#d0d0d0] transition-colors duration-200 mobile-menu-container"
      aria-label="Toggle mobile menu"
    >
      {#if isMobileMenuOpen}
        <svg class="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" transition:fly={{ duration: 150, easing: elasticOut }}>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      {:else}
        <svg class="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" transition:fly={{ duration: 150, easing: elasticOut }}>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      {/if}
    </button>
  </div>
  
  {#if isMobileMenuOpen}
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      transition:fade={{ duration: 200 }}
      on:click={menuControls.closeAll}
    ></div>
  {/if}
  
  {#if isMobileMenuOpen}
    <div 
      class="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[#e8e8e8] z-50 shadow-2xl"
      transition:slide={{ duration: 300, easing: quintOut, axis: 'x' }}
    >
      <div class="flex justify-between items-center p-6 border-b border-[#d0d0d0]">
        {#if $authStore.isAuthenticated && $authStore.user}
          <div class="flex items-center gap-3" transition:fly={{ x: -20, duration: 400, delay: 100 }}>
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
          <div class="text-lg font-bold text-[#303030]" transition:fly={{ x: -20, duration: 400, delay: 100 }}>
            Menu
          </div>
        {/if}
        
        <button 
          on:click={menuControls.closeAll}
          class="text-[#303030] p-1"
          aria-label="Close menu"
          transition:fly={{ x: 20, duration: 400, delay: 100 }}
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="py-6">
        {#each navLinks as link, i (link.id)}
          <a 
            href={link.href} 
            class="block px-6 py-4 text-[#303030] font-bold text-lg hover:bg-[#d0d0d0] transition-colors duration-200"
            on:click={() => handleMenuClick()}
            transition:fly={{ x: 20, duration: 300, delay: i * 50 + 200 }}
            animate:flip={{ duration: 200 }}
          >
            {link.label}
          </a>
        {/each}
        
        {#if $authStore.isAuthenticated}
          <hr class="my-4 mx-6 border-[#d0d0d0]" />
          {#each userMenuItems as item, i (item.id)}
            <a 
              href={item.href} 
              class="block px-6 py-4 text-[#303030] font-bold text-lg hover:bg-[#d0d0d0] transition-colors duration-200"
              on:click={() => handleMenuClick()}
              transition:fly={{ x: 20, duration: 300, delay: (navLinks.length + i) * 50 + 200 }}
              animate:flip={{ duration: 200 }}
            >
              {item.label}
            </a>
          {/each}
        {:else}
          <hr class="my-4 mx-6 border-[#d0d0d0]" />
          <button 
            on:click={authHandlers.signIn}
            class="block w-full text-left px-6 py-4 text-[#303030] font-bold text-lg hover:bg-[#d0d0d0] transition-colors duration-200"
            transition:fly={{ x: 20, duration: 300, delay: navLinks.length * 50 + 200 }}
          >
            Sign In
          </button>
        {/if}
      </div>
      
      <div class="absolute bottom-0 left-0 right-0 p-6 border-t border-[#d0d0d0]">
        {#if $authStore.isAuthenticated}
          <button 
            on:click={authHandlers.signOut}
            class="w-full border-[3px] rounded-[100px] border-[#303030] px-4 py-3 text-[#303030] font-bold hover:bg-[#303030] hover:text-white transition-all duration-200"
            transition:fly={{ y: 20, duration: 400, delay: 300 }}
          >
            Sign Out
          </button>
        {:else}
          <button 
            on:click={authHandlers.signIn}
            class="w-full border-[3px] rounded-[100px] border-[#303030] px-4 py-3 text-[#303030] font-bold hover:bg-[#303030] hover:text-white transition-all duration-200"
            transition:fly={{ y: 20, duration: 400, delay: 300 }}
          >
            Sign In with Google
          </button>
        {/if}
      </div>
    </div>
  {/if}
</nav>