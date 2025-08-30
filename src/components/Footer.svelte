<!-- src/lib/components/Footer.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth';
  
  // Svelte animations and transitions
  import { fly, fade, scale } from 'svelte/transition';
  import { quartOut, backOut, bounceOut } from 'svelte/easing';
  
  import { 
    Sparkles, 
    Mail, 
    Twitter, 
    Github, 
    Linkedin,
    ArrowUp,
    Heart,
    ExternalLink
  } from 'lucide-svelte';
  
  let mounted = false;
  let showScrollTop = false;
  
  $: isAuthenticated = $authStore.isAuthenticated;
  
  onMount(() => {
    mounted = true;
    
    // Show/hide scroll to top button
    const handleScroll = () => {
      showScrollTop = window.scrollY > 500;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
  
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  const footerLinks = {
    product: [
      { name: 'Features', href: '/#features' },
      { name: 'Pricing', href: '/#pricing' },
      { name: 'Integrations', href: '/integrations' },
      { name: 'API', href: '/api' }
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' }
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Documentation', href: '/docs' },
      { name: 'Status', href: '/status' },
      { name: 'Community', href: '/community' }
    ],
    legal: [
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
      { name: 'Security', href: '/security' },
      { name: 'Cookies', href: '/cookies' }
    ]
  };
  
  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/focusflow', color: 'hover:text-blue-400' },
    { name: 'GitHub', icon: Github, href: 'https://github.com/focusflow', color: 'hover:text-surface-900 dark:hover:text-white' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/focusflow', color: 'hover:text-blue-600' },
    { name: 'Email', icon: Mail, href: 'mailto:hello@focusflow.com', color: 'hover:text-rose-500' }
  ];
</script>

<!-- Scroll to Top Button -->
{#if showScrollTop}
  <button
    class="fixed bottom-6 right-6 z-50 btn variant-filled-rose w-12 h-12 !p-0 rounded-full shadow-elegant-lg hover:shadow-rose-glow group"
    on:click={scrollToTop}
    in:scale={{ duration: 300, easing: bounceOut }}
    out:scale={{ duration: 200 }}
  >
    <ArrowUp class="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
  </button>
{/if}

<!-- Main Footer -->
<footer class="bg-surface-100 dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700">
  {#if mounted}
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Main Footer Content -->
      <div class="py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          
          <!-- Brand Section -->
          <div 
            class="lg:col-span-2 space-y-6"
            in:fly={{ y: 30, duration: 600, delay: 100, easing: quartOut }}
          >
            <!-- Logo -->
            <div class="flex items-center space-x-3">
              <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-rose shadow-sm">
                <Sparkles class="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 class="text-xl font-display font-bold text-gradient-rose">FocusFlow</h3>
                <p class="text-xs text-surface-500 dark:text-surface-400 -mt-1">Productivity Suite</p>
              </div>
            </div>
            
            <!-- Description -->
            <p class="text-surface-600 dark:text-surface-300 leading-relaxed max-w-sm">
              The ultimate productivity suite that helps you manage tasks, schedule events, 
              and stay focused on what matters most.
            </p>
            
            <!-- Social Links -->
            <div class="flex items-center space-x-4">
              {#each socialLinks as social, i}
                <a 
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-2 rounded-lg bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-300 {social.color} transition-all duration-200 hover:scale-110 hover:shadow-sm"
                  in:scale={{ duration: 300, delay: 200 + (i * 100), easing: bounceOut }}
                >
                  <svelte:component this={social.icon} class="w-5 h-5" />
                  <span class="sr-only">{social.name}</span>
                </a>
              {/each}
            </div>
          </div>
          
          <!-- Product Links -->
          <div 
            class="space-y-4"
            in:fly={{ y: 30, duration: 600, delay: 200, easing: quartOut }}
          >
            <h4 class="text-sm font-semibold text-surface-900 dark:text-surface-50 uppercase tracking-wider">
              Product
            </h4>
            <ul class="space-y-3">
              {#each footerLinks.product as link, i}
                <li in:fly={{ x: -10, duration: 300, delay: 300 + (i * 50), easing: quartOut }}>
                  <a 
                    href={link.href}
                    class="text-surface-600 dark:text-surface-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block transition-transform"
                  >
                    {link.name}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
          
          <!-- Company Links -->
          <div 
            class="space-y-4"
            in:fly={{ y: 30, duration: 600, delay: 250, easing: quartOut }}
          >
            <h4 class="text-sm font-semibold text-surface-900 dark:text-surface-50 uppercase tracking-wider">
              Company
            </h4>
            <ul class="space-y-3">
              {#each footerLinks.company as link, i}
                <li in:fly={{ x: -10, duration: 300, delay: 350 + (i * 50), easing: quartOut }}>
                  <a 
                    href={link.href}
                    class="text-surface-600 dark:text-surface-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block transition-transform"
                  >
                    {link.name}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
          
          <!-- Support Links -->
          <div 
            class="space-y-4"
            in:fly={{ y: 30, duration: 600, delay: 300, easing: quartOut }}
          >
            <h4 class="text-sm font-semibold text-surface-900 dark:text-surface-50 uppercase tracking-wider">
              Support
            </h4>
            <ul class="space-y-3">
              {#each footerLinks.support as link, i}
                <li in:fly={{ x: -10, duration: 300, delay: 400 + (i * 50), easing: quartOut }}>
                  <a 
                    href={link.href}
                    class="text-surface-600 dark:text-surface-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block transition-transform flex items-center space-x-1"
                  >
                    <span>{link.name}</span>
                    {#if link.href.startsWith('http')}
                      <ExternalLink class="w-3 h-3 opacity-50" />
                    {/if}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
          
          <!-- Legal Links -->
          <div 
            class="space-y-4"
            in:fly={{ y: 30, duration: 600, delay: 350, easing: quartOut }}
          >
            <h4 class="text-sm font-semibold text-surface-900 dark:text-surface-50 uppercase tracking-wider">
              Legal
            </h4>
            <ul class="space-y-3">
              {#each footerLinks.legal as link, i}
                <li in:fly={{ x: -10, duration: 300, delay: 450 + (i * 50), easing: quartOut }}>
                  <a 
                    href={link.href}
                    class="text-surface-600 dark:text-surface-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block transition-transform"
                  >
                    {link.name}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Newsletter Section (only for anonymous users) -->
      {#if !isAuthenticated}
        <div 
          class="py-8 border-t border-surface-200 dark:border-surface-700"
          in:fade={{ duration: 600, delay: 600 }}
        >
          <div class="max-w-md mx-auto text-center space-y-4">
            <h4 class="text-lg font-semibold text-surface-900 dark:text-surface-50">
              Stay updated
            </h4>
            <p class="text-surface-600 dark:text-surface-300 text-sm">
              Get the latest productivity tips and product updates delivered to your inbox.
            </p>
            <div class="flex space-x-2">
              <input 
                type="email" 
                placeholder="Enter your email"
                class="flex-1 px-4 py-2 bg-surface-200 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
              />
              <button class="btn variant-filled-rose px-6 hover:scale-105 transition-transform duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      {/if}
      
      <!-- Bottom Bar -->
      <div 
        class="py-6 border-t border-surface-200 dark:border-surface-700"
        in:slide={{ duration: 600, delay: 700, easing: quartOut }}
      >
        <div class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div class="flex items-center space-x-2 text-sm text-surface-500 dark:text-surface-400">
            <span>© 2024 FocusFlow. All rights reserved.</span>
            <span class="hidden md:inline">•</span>
            <span class="hidden md:inline">Made with</span>
            <Heart class="hidden md:inline w-4 h-4 text-rose-500 fill-current animate-pulse-gentle" />
            <span class="hidden md:inline">for productivity enthusiasts</span>
          </div>
          
          <div class="flex items-center space-x-6 text-sm">
            <div class="flex items-center space-x-2 text-surface-500 dark:text-surface-400">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
            <div class="text-surface-500 dark:text-surface-400">
              Version 2.1.0
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</footer>

<style>
  /* Custom animations for footer elements */
  :global(.animate-pulse-gentle) {
    animation: pulseGentle 3s ease-in-out infinite;
  }
  
  @keyframes pulseGentle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  /* Hover effect for footer links */
  footer a:hover {
    transform: translateX(2px);
  }
  
  /* Smooth transitions for all interactive elements */
  footer button,
  footer input,
  footer a {
    transition: all 0.2s ease;
  }
</style>