<script lang="ts">
  import '../app.css';
  import MainLayout from '../components/MainLayout.svelte';
  import { authStore } from '$lib/stores/auth';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  
  interface SEOData {
    title: string;
    description: string;
    keywords: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogUrl?: string;
    twitterCard?: string;
    canonicalUrl?: string;
    robots?: string;
    jsonLd?: object;
  }
  
  const DEFAULT_SEO: SEOData = {
    title: 'FocusFlow - Stay Focused, Get Things Done',
    description: 'FocusFlow helps you maintain focus and productivity with advanced ADHD-friendly tools and techniques. Boost your concentration and achieve your goals.',
    keywords: 'focus, productivity, ADHD, concentration, task management, mindfulness, workflow',
    ogTitle: 'FocusFlow - Stay Focused, Get Things Done',
    ogDescription: 'Advanced productivity tools designed for focus and concentration. Perfect for ADHD and anyone looking to boost their productivity.',
    ogImage: '/og-image.jpg',
    twitterCard: 'summary_large_image',
    robots: 'index, follow'
  };
  
  const ROUTE_SEO: Record<string, Partial<SEOData>> = {
    '/': {
      title: 'FocusFlow - Advanced Productivity & Focus Tools',
      description: 'Discover FocusFlow\'s suite of productivity tools designed to help you stay focused, manage tasks, and achieve your goals. Perfect for ADHD minds.',
      keywords: 'focus app, productivity tools, ADHD support, task management, concentration app',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'FocusFlow',
        'description': 'Advanced productivity and focus application',
        'applicationCategory': 'ProductivityApplication',
        'operatingSystem': 'Web Browser'
      }
    },
    '/dashboard': {
      title: 'Dashboard - FocusFlow',
      description: 'Your personal productivity dashboard. Track your progress, manage tasks, and stay focused with FocusFlow.',
      robots: 'noindex, nofollow'
    },
    '/profile': {
      title: 'Profile Settings - FocusFlow',
      description: 'Manage your FocusFlow profile and preferences.',
      robots: 'noindex, nofollow'
    },
    '/settings': {
      title: 'Settings - FocusFlow',
      description: 'Customize your FocusFlow experience with personalized settings.',
      robots: 'noindex, nofollow'
    },
    '/about': {
      title: 'About FocusFlow - Our Mission & Story',
      description: 'Learn about FocusFlow\'s mission to help people with ADHD and focus challenges achieve their full potential.',
      keywords: 'about focusflow, ADHD support, productivity mission, focus solutions'
    },
    '/contact': {
      title: 'Contact Us - FocusFlow Support',
      description: 'Get in touch with the FocusFlow team. We\'re here to help with questions, feedback, and support.',
      keywords: 'contact focusflow, support, help, feedback'
    }
  };
  
  $: currentRoute = $page.route?.id || '/';
  $: showScrollTop = currentRoute !== '/';
  $: seoData = { ...DEFAULT_SEO, ...ROUTE_SEO[currentRoute], ogUrl: $page.url.href, canonicalUrl: $page.url.href };
  
  onMount(() => {
    authStore.init();
    
    const isAppleDevice = /iPad|iPhone|iPod|Mac/.test(navigator.userAgent);
    if (isAppleDevice) {
      document.documentElement.style.setProperty('--webkit-appearance', 'none');
      document.documentElement.classList.add('apple-device');
      
      // Force style recalculation
      const styleSheets = document.styleSheets;
      for (let i = 0; i < styleSheets.length; i++) {
        try {
          const sheet = styleSheets[i] as CSSStyleSheet;
          if (sheet.href?.includes('app.css')) {
            sheet.disabled = true;
            setTimeout(() => { sheet.disabled = false; }, 50);
            break;
          }
        } catch (e) {
          // Ignore cross-origin errors
        }
      }
    }
  });
</script>

<svelte:head>
  <title>{seoData.title}</title>
  <meta name="description" content={seoData.description} />
  <meta name="keywords" content={seoData.keywords} />
  <meta name="robots" content={seoData.robots} />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content={seoData.ogTitle || seoData.title} />
  <meta property="og:description" content={seoData.ogDescription || seoData.description} />
  <meta property="og:url" content={seoData.ogUrl} />
  {#if seoData.ogImage}
    <meta property="og:image" content={seoData.ogImage} />
    <meta property="og:image:alt" content={seoData.title} />
  {/if}
  
  <!-- Twitter -->
  <meta name="twitter:card" content={seoData.twitterCard} />
  <meta name="twitter:title" content={seoData.ogTitle || seoData.title} />
  <meta name="twitter:description" content={seoData.ogDescription || seoData.description} />
  {#if seoData.ogImage}
    <meta name="twitter:image" content={seoData.ogImage} />
  {/if}
  
  <!-- Canonical URL -->
  {#if seoData.canonicalUrl}
    <link rel="canonical" href={seoData.canonicalUrl} />
  {/if}
  

  
  <!-- Apple-specific meta tags -->
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="FocusFlow" />
  
  <!-- Viewport optimization -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
  
  <!-- JSON-LD Structured Data -->
  {#if seoData.jsonLd}
    {@html `<script type="application/ld+json">${JSON.stringify(seoData.jsonLd)}</script>`}
  {/if}
</svelte:head>

<MainLayout {showScrollTop}>
  <slot />
</MainLayout>

<style>
  :global(.apple-device) {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  :global(.apple-device *) {
    -webkit-appearance: none !important;
    -webkit-transform: translate3d(0, 0, 0);
    -webkit-backface-visibility: hidden;
  }
  
  :global(.apple-device input, .apple-device button, .apple-device select, .apple-device textarea) {
    -webkit-appearance: none !important;
    border-radius: 0 !important;
  }
  
  :global(.apple-device input[type="checkbox"]) {
    -webkit-appearance: none !important;
    appearance: none !important;
  }
</style>