<script lang="ts">
  import { databases } from '$lib/appwrite';
  import { ID } from 'appwrite';
  import { fade, fly, scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { quintOut, elasticOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';
  
  let email = '';
  let subscribeToNewsletter = false;
  let isSubmitting = false;
  let submitMessage = '';
  let submitSuccess = false;
  let emailError = '';
  
  const submitProgress = tweened(0, { duration: 300, easing: quintOut });
  $: submitProgress.set(isSubmitting ? 100 : 0);
  
  const CONFIG = {
    database: 'focusflow-db',
    collection: 'newsletter_subscribers',
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    contactInfo: {
      email: 'sinhaparth555@gmail.com',
      website: { url: 'https://parthsinha.com', label: 'website' },
      address: ['Headington, Oxford', 'Oxfordshire, United Kingdom OX4 2DD']
    },
    socialLinks: [
      { 
        name: 'Facebook', 
        href: '#',
        path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
      },
      { 
        name: 'LinkedIn', 
        href: '#',
        path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
      },
      { 
        name: 'Twitter', 
        href: '#',
        path: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z'
      }
    ] as const
  };
  
  const validateEmail = (email: string) => CONFIG.emailRegex.test(email);
  
  const showEmailError = () => {
    if (!email) {
      emailError = 'Email is required';
      return false;
    }
    if (!validateEmail(email)) {
      emailError = 'Enter an email address like example@mysite.com';
      return false;
    }
    emailError = '';
    return true;
  };
  
  const clearMessage = () => {
    setTimeout(() => {
      submitMessage = '';
      submitSuccess = false;
    }, 5000);
  };
  
  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    
    if (!showEmailError() || isSubmitting) return;
    
    if (!subscribeToNewsletter) {
      submitMessage = 'Please confirm your subscription to the newsletter';
      submitSuccess = false;
      return;
    }
    
    isSubmitting = true;
    submitMessage = '';
    
    try {
      await databases.createDocument(
        CONFIG.database,
        CONFIG.collection,
        ID.unique(),
        {
          email: email.toLowerCase().trim(),
          subscribedAt: new Date().toISOString(),
          isActive: true,
          source: 'footer_signup'
        }
      );
      
      submitMessage = 'Thank you for subscribing to our newsletter!';
      submitSuccess = true;
      email = '';
      subscribeToNewsletter = false;
      
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      
      submitMessage = error.code === 409 
        ? 'This email is already subscribed to our newsletter.'
        : 'Something went wrong. Please try again later.';
      submitSuccess = false;
    } finally {
      isSubmitting = false;
      clearMessage();
    }
  };
  
  $: if (email) emailError = '';
</script>

<footer class="bg-[#81a0f7] font-display">
  <div class="container mx-auto px-4 py-12">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div class="flex flex-col gap-6">
        <div 
          class="text-[2rem] font-bold text-[#303030] font-display max-w-[30.25rem] leading-tight"
          transition:fly={{ x: -50, duration: 600, delay: 100 }}
        >
          Stay Ahead in a Rapidly Changing World
        </div>
        
        <div class="flex flex-col gap-4 max-w-[28.25rem]">
          <p 
            class="text-[#303030] text-[1.5rem] font-medium"
            transition:fly={{ x: -30, duration: 500, delay: 200 }}
          >
            Sign up for our newsletter
          </p>
          
          <form 
            on:submit={handleSubmit} 
            class="flex flex-col gap-4"
            transition:fly={{ y: 20, duration: 600, delay: 300 }}
          >
            <div class="flex flex-col gap-2">
              <label for="newsletter-email" class="text-[#303030] font-medium">
                Email <span class="text-red-600">*</span>
              </label>
              
              <input
                id="newsletter-email"
                type="email"
                bind:value={email}
                on:blur={showEmailError}
                placeholder="Enter your email address"
                class="px-4 py-3 border-3 border-[#303030] bg-transparent text-[#303030] placeholder-[#555] font-medium focus:outline-none focus:border-[#220088] transition-colors duration-200"
                class:border-red-500={emailError}
                disabled={isSubmitting}
                required
              />
              
              {#if emailError}
                <div 
                  class="flex items-center gap-2 text-red-600 text-sm"
                  transition:fly={{ y: -10, duration: 300, easing: elasticOut }}
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {emailError}
                </div>
              {/if}
            </div>
            
            <div class="flex items-start gap-3">
              <input
                id="newsletter-consent"
                type="checkbox"
                bind:checked={subscribeToNewsletter}
                class="mt-1 w-5 h-5 border-2 border-[#303030] bg-transparent focus:ring-[#220088] focus:ring-2"
                disabled={isSubmitting}
                required
              />
              <label for="newsletter-consent" class="text-[#303030] font-medium leading-relaxed">
                Yes, subscribe me to your newsletter. <span class="text-red-600">*</span>
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              class="relative px-8 py-3 border-3 border-[#303030] bg-transparent text-[#303030] font-bold text-lg hover:bg-[#303030] hover:text-[#81a0f7] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-fit overflow-hidden"
              aria-describedby={submitMessage ? 'submit-status' : undefined}
            >
              <span class:opacity-0={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </span>
              
              {#if isSubmitting}
                <div 
                  class="absolute inset-0 flex items-center justify-center"
                  transition:scale={{ duration: 200, easing: quintOut }}
                  aria-hidden="true"
                >
                  <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-[#303030]"></div>
                </div>
              {/if}
            </button>
            
            {#if submitMessage}
              <div 
                id="submit-status"
                class="flex items-center gap-2 text-sm font-medium" 
                class:text-green-700={submitSuccess} 
                class:text-red-600={!submitSuccess}
                transition:fly={{ y: -20, duration: 400, easing: elasticOut }}
                role="status"
                aria-live="polite"
              >
                <svg 
                  class="w-4 h-4" 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  transition:scale={{ duration: 300, delay: 100 }}
                  aria-hidden="true"
                >
                  {#if submitSuccess}
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  {:else}
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  {/if}
                </svg>
                <span transition:fade={{ duration: 300, delay: 200 }}>
                  {submitMessage}
                </span>
              </div>
            {/if}
          </form>
        </div>
      </div>
      
      <div class="flex flex-col gap-6">
        <h2 
          class="text-[2rem] font-bold text-[#303030] font-display"
          transition:fly={{ x: 50, duration: 600, delay: 100 }}
        >
          Contact Us
        </h2>
        
        <div 
          class="flex flex-col gap-4 text-[#303030]"
          transition:fly={{ y: 20, duration: 600, delay: 200 }}
        >
          <div class="flex flex-col gap-2">
            <p class="text-lg font-medium">Email us at:</p>
            <a 
              href="mailto:{CONFIG.contactInfo.email}" 
              class="text-lg underline hover:text-[#220088] transition-colors duration-200"
            >
              {CONFIG.contactInfo.email}
            </a>
          </div>
          
          <div class="flex flex-col gap-2">
            <p class="text-lg font-medium">
              Visit our 
              <a 
                href={CONFIG.contactInfo.website.url} 
                class="underline hover:text-[#220088] transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                {CONFIG.contactInfo.website.label}
              </a>
            </p>
          </div>
          
          <div class="flex flex-col gap-1">
            <p class="text-lg font-medium">Our Office:</p>
            {#each CONFIG.contactInfo.address as line}
              <p class="text-lg">{line}</p>
            {/each}
          </div>
          
          <div 
            class="flex gap-4 mt-4"
            transition:fly={{ y: 30, duration: 600, delay: 400 }}
          >
            {#each CONFIG.socialLinks as social, i (social.name)}
              <a 
                href={social.href} 
                class="text-[#303030] hover:text-[#220088] transition-colors duration-200" 
                aria-label={social.name}
                animate:flip={{ duration: 200 }}
                transition:scale={{ duration: 300, delay: i * 50 }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d={social.path} />
                </svg>
              </a>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</footer>

<style>
  input[type="checkbox"] {
    appearance: none;
    background-color: transparent;
    border: 2px solid #303030;
    border-radius: 2px;
    display: inline-block;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  input[type="checkbox"]:checked {
    background-color: #303030;
    border-color: #303030;
    transform: scale(1.1);
  }
  
  input[type="checkbox"]:checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    color: #81a0f7;
    font-size: 12px;
    font-weight: bold;
    animation: checkmark 0.3s ease forwards;
  }
  
  input[type="checkbox"]:focus {
    outline: 2px solid #220088;
    outline-offset: 2px;
  }
  
  @keyframes checkmark {
    to {
      transform: translate(-50%, -50%) scale(1);
    }
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
</style>