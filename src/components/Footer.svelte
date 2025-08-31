<script lang="ts">
  import { fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  let email = '';
  let isSubmitting = false;
  let submitMessage = '';
  
  const currentYear = new Date().getFullYear();
  
  const companyLinks = [
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
    { name: 'Blog', href: '/blog' }
  ];
  
  const productLinks = [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Integrations', href: '/integrations' },
    { name: 'API', href: '/api' }
  ];
  
  const supportLinks = [
    { name: 'Help Center', href: '/help' },
    { name: 'Documentation', href: '/docs' },
    { name: 'Community', href: '/community' },
    { name: 'Status', href: '/status' }
  ];
  
  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' }
  ];
  
  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com', icon: '🐦' },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: '💼' },
    { name: 'GitHub', href: 'https://github.com', icon: '💻' },
    { name: 'Discord', href: 'https://discord.com', icon: '💬' }
  ];
  
  async function handleNewsletterSubmit(event: Event) {
    event.preventDefault();
    
    if (!email || isSubmitting) return;
    
    isSubmitting = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      submitMessage = 'Thank you for subscribing!';
      email = '';
    } catch (error) {
      submitMessage = 'Something went wrong. Please try again.';
    } finally {
      isSubmitting = false;
      setTimeout(() => {
        submitMessage = '';
      }, 3000);
    }
  }
</script>

<footer class="footer">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
      <!-- Company Info & Newsletter -->
      <div class="lg:col-span-2 space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gradient-rose mb-4">FocusFlow</h2>
          <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-md">
            Streamline your productivity with intelligent task management, seamless calendar integration, 
            and smart reminders that keep you focused on what matters most.
          </p>
        </div>
        
        <!-- Newsletter Signup -->
        <div>
          <h3 class="footer-heading">Stay Updated</h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
            Get the latest features and productivity tips delivered to your inbox.
          </p>
          
          <form on:submit={handleNewsletterSubmit} class="flex gap-3">
            <input
              type="email"
              bind:value={email}
              placeholder="Enter your email"
              class="newsletter-input"
              required
              disabled={isSubmitting}
            />
            <button
              type="submit"
              class="newsletter-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          
          {#if submitMessage}
            <p 
              class="text-sm mt-2 {submitMessage.includes('Thank you') ? 'text-green-600' : 'text-red-600'}"
              transition:fly={{ y: -10, duration: 300, easing: quintOut }}
            >
              {submitMessage}
            </p>
          {/if}
        </div>
      </div>
      
      <!-- Company Links -->
      <div>
        <h3 class="footer-heading">Company</h3>
        <ul class="space-y-3">
          {#each companyLinks as link}
            <li>
              <a href={link.href} class="footer-link">
                {link.name}
              </a>
            </li>
          {/each}
        </ul>
      </div>
      
      <!-- Product Links -->
      <div>
        <h3 class="footer-heading">Product</h3>
        <ul class="space-y-3">
          {#each productLinks as link}
            <li>
              <a href={link.href} class="footer-link">
                {link.name}
              </a>
            </li>
          {/each}
        </ul>
      </div>
      
      <!-- Support Links -->
      <div>
        <h3 class="footer-heading">Support</h3>
        <ul class="space-y-3">
          {#each supportLinks as link}
            <li>
              <a href={link.href} class="footer-link">
                {link.name}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    </div>
    
    <!-- Bottom Section -->
    <div class="mt-12 pt-8 border-t border-rose-200/20 dark:border-rose-800/20">
      <div class="flex flex-col lg:flex-row justify-between items-center gap-6">
        <!-- Legal Links & Copyright -->
        <div class="flex flex-col sm:flex-row items-center gap-4 text-sm">
          <div class="flex items-center gap-4">
            {#each legalLinks as link}
              <a href={link.href} class="footer-link">
                {link.name}
              </a>
            {/each}
          </div>
          <div class="text-gray-500 dark:text-gray-400">
            © {currentYear} FocusFlow. All rights reserved.
          </div>
        </div>
        
        <!-- Social Links -->
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600 dark:text-gray-300 mr-2">Follow us:</span>
          {#each socialLinks as social}
            <a
              href={social.href}
              class="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
            >
              <span class="text-lg">{social.icon}</span>
            </a>
          {/each}
        </div>
      </div>
    </div>
  </div>
</footer>