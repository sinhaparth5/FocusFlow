<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { onMount } from 'svelte';
  import { slide, fly, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  let isMenuOpen = false;
  let isUserMenuOpen = false;
  let scrollY = 0;
  let isScrolled = false;
  
  $: if (scrollY > 50) {
    isScrolled = true;
  } else {
    isScrolled = false;
  }
  
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/tasks', label: 'Tasks', icon: '✅' },
    { href: '/calendar', label: 'Calendar', icon: '📅' },
    { href: '/meetings', label: 'Meetings', icon: '🤝' },
    { href: '/reminders', label: 'Reminders', icon: '🔔' }
  ];
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  function toggleUserMenu() {
    isUserMenuOpen = !isUserMenuOpen;
  }
  
  function closeMenus() {
    isMenuOpen = false;
    isUserMenuOpen = false;
  }
  
  async function handleLogout() {
    await authStore.logout();
    await goto('/');
    closeMenus();
  }
  
  function isActive(href: string) {
    return $page.url.pathname === href;
  }
  
  onMount(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu') && !target.closest('.mobile-menu-toggle')) {
        closeMenus();
      }
    }
    
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  });
</script>

<svelte:window bind:scrollY />

<nav class="navbar {isScrolled ? 'navbar-scrolled' : ''}">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <!-- Logo -->
      <div class="flex items-center space-x-4">
        <a href="/" class="logo" in:fly={{ x: -20, duration: 300, easing: quintOut }}>
          FocusFlow
        </a>
      </div>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-1">
        {#each navItems as item, i}
          <a
            href={item.href}
            class="nav-link {isActive(item.href) ? 'active' : ''}"
            in:fly={{ x: 20, delay: i * 100, duration: 300, easing: quintOut }}
          >
            <span class="mr-2">{item.icon}</span>
            {item.label}
          </a>
        {/each}
      </div>
      
      <!-- User Menu & Mobile Toggle -->
      <div class="flex items-center space-x-4">
        {#if $authStore.isAuthenticated && $authStore.user}
          <!-- User Menu -->
          <div class="user-menu relative">
            <button
              on:click={toggleUserMenu}
              class="user-avatar"
              in:scale={{ duration: 300, easing: quintOut }}
            >
              {#if $authStore.user.avatar}
                <img
                  src={$authStore.user.avatar}
                  alt={$authStore.user.name}
                  class="w-full h-full object-cover rounded-full"
                />
              {:else}
                <div class="w-full h-full bg-gradient-rose rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {$authStore.user.name.charAt(0).toUpperCase()}
                </div>
              {/if}
            </button>
            
            {#if isUserMenuOpen}
              <div 
                class="dropdown-menu"
                transition:fly={{ y: -10, duration: 200, easing: quintOut }}
              >
                <div class="px-4 py-3 border-b border-rose-200/20">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {$authStore.user.name}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {$authStore.user.email}
                  </p>
                </div>
                
                <a href="/profile" class="dropdown-item">
                  <span>👤</span>
                  Profile
                </a>
                <a href="/settings" class="dropdown-item">
                  <span>⚙️</span>
                  Settings
                </a>
                <a href="/help" class="dropdown-item">
                  <span>❓</span>
                  Help
                </a>
                
                <div class="dropdown-divider"></div>
                
                <button on:click={handleLogout} class="dropdown-item">
                  <span>🚪</span>
                  Sign Out
                </button>
              </div>
            {/if}
          </div>
        {:else}
          <!-- Login/Register buttons for non-authenticated users -->
          <div class="hidden md:flex items-center space-x-3">
            <a href="/login" class="btn btn-sm variant-ghost-surface">
              Sign In
            </a>
            <a href="/register" class="btn btn-sm bg-gradient-rose text-white">
              Get Started
            </a>
          </div>
        {/if}
        
        <!-- Mobile menu toggle -->
        <button
          on:click={toggleMenu}
          class="mobile-menu-toggle md:hidden"
          aria-label="Toggle menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {#if isMenuOpen}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M6 18L18 6M6 6l12 12" />
            {:else}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M4 6h16M4 12h16M4 18h16" />
            {/if}
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Mobile Menu -->
    {#if isMenuOpen}
      <div 
        class="mobile-menu md:hidden"
        transition:slide={{ duration: 300, easing: quintOut }}
      >
        <div class="px-4 py-3 space-y-2">
          {#each navItems as item}
            <a
              href={item.href}
              class="nav-link block {isActive(item.href) ? 'active' : ''}"
              on:click={closeMenus}
            >
              <span class="mr-3">{item.icon}</span>
              {item.label}
            </a>
          {/each}
          
          {#if !$authStore.isAuthenticated}
            <div class="pt-4 mt-4 border-t border-rose-200/20 space-y-2">
              <a href="/login" class="btn btn-sm variant-ghost-surface w-full" on:click={closeMenus}>
                Sign In
              </a>
              <a href="/register" class="btn btn-sm bg-gradient-rose text-white w-full" on:click={closeMenus}>
                Get Started
              </a>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</nav>