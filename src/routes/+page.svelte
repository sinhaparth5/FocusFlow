<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { quintOut, cubicOut } from 'svelte/easing';
  import { authStore } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  
  let email = '';
  let isHeroVisible = false;
  
  onMount(() => {
    // Trigger hero animation after mount
    setTimeout(() => {
      isHeroVisible = true;
    }, 200);
  });
  
  async function handleGetStarted() {
    if ($authStore.isAuthenticated) {
      await goto('/dashboard');
    } else {
      await goto('/register');
    }
  }
  
  function handleLearnMore() {
    document.getElementById('features')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  }
</script>

<!-- Hero Section -->
<section class="hero-section">
  <!-- Animated Background Blobs -->
  <div class="gradient-blobs">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
    <div class="blob blob-4"></div>
    <div class="blob blob-5"></div>
    <div class="blob blob-6"></div>
  </div>
  
  <!-- Content -->
  <div class="hero-content">
    {#if isHeroVisible}
      <div class="hero-text" in:fly={{ y: 50, duration: 800, delay: 300, easing: quintOut }}>
        <h1 class="hero-title">
          <span class="title-line">FocusFlow</span>
          <span class="title-line">Task Manager</span>
        </h1>
        
        <p class="hero-description" in:fade={{ duration: 600, delay: 800 }}>
          Streamline your productivity with intelligent task management, 
          seamless calendar integration, and smart reminders that keep you focused.
        </p>
        
        <div class="hero-actions" in:fly={{ y: 30, duration: 600, delay: 1000, easing: quintOut }}>
          <div class="action-input">
            <input 
              type="email" 
              bind:value={email}
              placeholder="Enter your email to get started"
              class="email-input"
            />
            <button 
              on:click={handleGetStarted}
              class="get-started-btn"
            >
              <span>Get Started</span>
              <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="social-proof" in:fade={{ duration: 600, delay: 1200 }}>
          <div class="social-icons">
            <a href="#" class="social-icon" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.77 7.46H15.5v-1.9c0-.9.6-1.1 1-1.1h2.2V2.5L15.4 2.5c-3.6 0-4.4 2.7-4.4 4.4v1.52H9v2h2v10h4v-10h2.3l.47-2z"/>
              </svg>
            </a>
            <a href="#" class="social-icon" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.46 6c-.85.38-1.78.64-2.75.76 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.53-3.51-1.53-2.66 0-4.81 2.16-4.81 4.81 0 .38.04.75.13 1.1-4-.2-7.57-2.11-9.96-5.02-.42.72-.66 1.55-.66 2.44 0 1.67.85 3.14 2.14 4-.79-.03-1.53-.24-2.18-.6v.06c0 2.33 1.66 4.28 3.86 4.72-.4.11-.83.17-1.27.17-.31 0-.62-.03-.92-.08.62 1.94 2.42 3.35 4.55 3.39-1.67 1.31-3.77 2.09-6.05 2.09-.39 0-.78-.02-1.17-.07 2.18 1.4 4.77 2.21 7.55 2.21 9.06 0 14-7.5 14-14 0-.21 0-.42-.01-.63.96-.69 1.8-1.56 2.46-2.55z"/>
              </svg>
            </a>
            <a href="#" class="social-icon" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.45 2H3.55A1.55 1.55 0 002 3.55v16.9A1.55 1.55 0 003.55 22h16.9A1.55 1.55 0 0022 20.45V3.55A1.55 1.55 0 0020.45 2zM8.1 18.9H5.25V9.45H8.1v9.45zM6.675 8.2a1.65 1.65 0 110-3.3 1.65 1.65 0 010 3.3zM18.9 18.9h-2.85v-4.6c0-1.1-.02-2.5-1.525-2.5-1.525 0-1.76 1.19-1.76 2.42v4.68h-2.85V9.45h2.74v1.29h.04c.38-.72 1.31-1.48 2.7-1.48 2.89 0 3.42 1.9 3.42 4.37v5.27z"/>
              </svg>
            </a>
            <a href="#" class="social-icon" aria-label="Pinterest">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5-.1-.93-.18-2.37.04-3.39.2-.93 1.32-5.6 1.32-5.6s-.34-.67-.34-1.66c0-1.56.9-2.72 2.03-2.72.96 0 1.42.72 1.42 1.58 0 .96-.61 2.4-.93 3.74-.27 1.13.57 2.04 1.69 2.04 2.03 0 3.59-2.14 3.59-5.23 0-2.73-1.96-4.64-4.76-4.64-3.24 0-5.14 2.43-5.14 4.94 0 .98.38 2.03.85 2.6.09.11.11.21.08.32-.09.36-.29 1.13-.33 1.29-.05.21-.17.25-.39.15-1.39-.65-2.26-2.69-2.26-4.33 0-3.6 2.62-6.91 7.55-6.91 3.97 0 7.06 2.83 7.06 6.61 0 3.95-2.49 7.13-5.95 7.13-1.16 0-2.25-.6-2.62-1.32 0 0-.57 2.18-.71 2.72-.26.99-.96 2.23-1.43 2.99A9.99 9.99 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
            </a>
          </div>
          <p class="social-text">Join thousands of productive teams</p>
        </div>
      </div>
    {/if}
  </div>
</section>

<!-- Features Preview Section -->
<section id="features" class="features-preview">
  <div class="container mx-auto px-4 py-20">
    <div class="text-center mb-16">
      <h2 class="features-title">Everything you need to stay organized</h2>
      <p class="features-subtitle">Powerful features designed for modern productivity</p>
    </div>
    
    <div class="features-grid">
      <div class="feature-card" in:fly={{ y: 50, duration: 600, delay: 200 }}>
        <div class="feature-icon">📊</div>
        <h3>Smart Dashboard</h3>
        <p>Get insights into your productivity with beautiful analytics and progress tracking.</p>
      </div>
      
      <div class="feature-card" in:fly={{ y: 50, duration: 600, delay: 400 }}>
        <div class="feature-icon">📅</div>
        <h3>Calendar Integration</h3>
        <p>Seamlessly sync with Google Calendar and schedule meetings automatically.</p>
      </div>
      
      <div class="feature-card" in:fly={{ y: 50, duration: 600, delay: 600 }}>
        <div class="feature-icon">🔔</div>
        <h3>Smart Reminders</h3>
        <p>Never miss a deadline with intelligent notifications and reminder systems.</p>
      </div>
    </div>
  </div>
</section>

<style>
  .hero-section {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    overflow: hidden;
    background: linear-gradient(135deg, #fefefe 0%, #f8f9ff 50%, #faf7ff 100%);
  }
  
  .gradient-blobs {
    position: absolute;
    inset: 0;
    z-index: 1;
  }
  
  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.7;
    animation: float 20s ease-in-out infinite;
  }
  
  .blob-1 {
    width: 300px;
    height: 300px;
    background: linear-gradient(45deg, #F77FBE, #D7D0E1);
    top: 10%;
    right: 15%;
    animation-delay: 0s;
  }
  
  .blob-2 {
    width: 250px;
    height: 250px;
    background: linear-gradient(45deg, #4B61D1, #65318E);
    top: 60%;
    right: 5%;
    animation-delay: -5s;
  }
  
  .blob-3 {
    width: 200px;
    height: 200px;
    background: linear-gradient(45deg, #65318E, #F77FBE);
    bottom: 20%;
    left: 10%;
    animation-delay: -10s;
  }
  
  .blob-4 {
    width: 180px;
    height: 180px;
    background: linear-gradient(45deg, #D7D0E1, #4B61D1);
    top: 30%;
    right: 40%;
    animation-delay: -15s;
  }
  
  .blob-5 {
    width: 220px;
    height: 220px;
    background: linear-gradient(45deg, #FFE066, #F77FBE);
    bottom: 40%;
    right: 25%;
    animation-delay: -8s;
  }
  
  .blob-6 {
    width: 160px;
    height: 160px;
    background: linear-gradient(45deg, #87CEEB, #D7D0E1);
    top: 15%;
    left: 25%;
    animation-delay: -12s;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) translateX(0px) scale(1);
    }
    25% {
      transform: translateY(-20px) translateX(10px) scale(1.05);
    }
    50% {
      transform: translateY(-10px) translateX(-15px) scale(0.95);
    }
    75% {
      transform: translateY(-30px) translateX(5px) scale(1.02);
    }
  }
  
  .hero-content {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  .hero-text {
    max-width: 600px;
  }
  
  .hero-title {
    font-size: clamp(3rem, 8vw, 5rem);
    font-weight: 800;
    line-height: 1.1;
    color: #220088;
    margin-bottom: 1.5rem;
    letter-spacing: -0.02em;
  }
  
  .title-line {
    display: block;
  }
  
  .hero-description {
    font-size: 1.25rem;
    line-height: 1.6;
    color: #666;
    margin-bottom: 3rem;
    max-width: 500px;
  }
  
  .hero-actions {
    margin-bottom: 3rem;
  }
  
  .action-input {
    display: flex;
    gap: 0;
    max-width: 500px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 60px;
    padding: 8px;
    box-shadow: 0 10px 40px rgba(34, 0, 136, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .email-input {
    flex: 1;
    padding: 1rem 1.5rem;
    border: none;
    background: transparent;
    font-size: 1rem;
    color: #333;
    outline: none;
  }
  
  .email-input::placeholder {
    color: #999;
  }
  
  .get-started-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #65318E, #4B61D1);
    color: white;
    border: none;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(101, 49, 142, 0.3);
  }
  
  .get-started-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(101, 49, 142, 0.4);
  }
  
  .arrow-icon {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }
  
  .get-started-btn:hover .arrow-icon {
    transform: translateX(4px);
  }
  
  .social-proof {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .social-icons {
    display: flex;
    gap: 0.5rem;
  }
  
  .social-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    color: #666;
    text-decoration: none;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }
  
  .social-icon:hover {
    background: rgba(101, 49, 142, 0.1);
    color: #65318E;
    transform: translateY(-2px);
  }
  
  .social-icon svg {
    width: 18px;
    height: 18px;
  }
  
  .social-text {
    color: #999;
    font-size: 0.9rem;
  }
  
  .features-preview {
    background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  }
  
  .features-title {
    font-size: 3rem;
    font-weight: 700;
    color: #220088;
    margin-bottom: 1rem;
  }
  
  .features-subtitle {
    font-size: 1.25rem;
    color: #666;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 4rem;
  }
  
  .feature-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 24px;
    padding: 2.5rem;
    text-align: center;
    transition: all 0.3s ease;
    box-shadow: 0 8px 32px rgba(34, 0, 136, 0.08);
  }
  
  .feature-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(34, 0, 136, 0.12);
  }
  
  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1.5rem;
  }
  
  .feature-card h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #220088;
    margin-bottom: 1rem;
  }
  
  .feature-card p {
    color: #666;
    line-height: 1.6;
  }
  
  @media (max-width: 768px) {
    .hero-content {
      padding: 0 1rem;
    }
    
    .action-input {
      flex-direction: column;
      gap: 0.5rem;
      border-radius: 20px;
      padding: 1rem;
    }
    
    .get-started-btn {
      border-radius: 16px;
      justify-content: center;
    }
    
    .social-proof {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .features-title {
      font-size: 2rem;
    }
    
    .feature-card {
      padding: 2rem;
    }
  }
</style>