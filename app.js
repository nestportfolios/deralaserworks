/**
 * DERA LASER WORKS (DLW) - 3D SIGN BOARDS & ACP CLADDING
 * Clean & Production-Ready Interactive Application Engine
 * Includes Service-Based Preloader & Dynamic Theme Switcher
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------------------------------------
     0. Services-Based Preloader Screen
     ------------------------------------------------------------------------ */
  const preloader = document.getElementById('preloader');
  const preloaderServiceText = document.getElementById('preloader-service-text');
  const preloaderProgressBar = document.getElementById('preloader-progress-bar');
  const preloaderCount = document.getElementById('preloader-count');

  const servicesList = [
    '3D Illuminated Sign Boards',
    'Architectural ACP Cladding',
    'CNC Fiber Laser Cutting',
    'Commercial Channel Letters'
  ];

  let currentServiceIndex = 0;
  let progressPercent = 0;

  // Cycle Service Pills
  const serviceInterval = setInterval(() => {
    currentServiceIndex = (currentServiceIndex + 1) % servicesList.length;
    if (preloaderServiceText) {
      preloaderServiceText.style.opacity = '0';
      preloaderServiceText.style.transform = 'translateY(5px)';
      setTimeout(() => {
        preloaderServiceText.textContent = servicesList[currentServiceIndex];
        preloaderServiceText.style.opacity = '1';
        preloaderServiceText.style.transform = 'translateY(0)';
      }, 150);
    }
  }, 400);

  // Smooth Percentage Counter (0 to 100%)
  const progressInterval = setInterval(() => {
    progressPercent += Math.floor(Math.random() * 8) + 4;
    if (progressPercent > 100) progressPercent = 100;

    if (preloaderProgressBar) preloaderProgressBar.style.width = `${progressPercent}%`;
    if (preloaderCount) preloaderCount.textContent = progressPercent;

    if (progressPercent >= 100) {
      clearInterval(progressInterval);
      clearInterval(serviceInterval);

      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('loaded');
          preloader.setAttribute('aria-hidden', 'true');
        }
      }, 300);
    }
  }, 40);

  // Fallback safety timeout (ensures preloader never gets stuck)
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('loaded')) {
      clearInterval(progressInterval);
      clearInterval(serviceInterval);
      preloader.classList.add('loaded');
      preloader.setAttribute('aria-hidden', 'true');
    }
  }, 2200);

  /* ------------------------------------------------------------------------
     1. Light / Dark Theme Switcher (Persistent via LocalStorage)
     ------------------------------------------------------------------------ */
  const themeToggle = document.getElementById('theme-toggle');
  const drawerThemeToggle = document.getElementById('drawer-theme-toggle');
  const rootElement = document.documentElement;

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem('dlw_theme') || 'dark';
  rootElement.setAttribute('data-theme', savedTheme);

  const toggleTheme = () => {
    const currentTheme = rootElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    rootElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('dlw_theme', newTheme);
  };

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (drawerThemeToggle) drawerThemeToggle.addEventListener('click', toggleTheme);

  /* ------------------------------------------------------------------------
     2. Sticky Header & Mobile Drawer
     ------------------------------------------------------------------------ */
  const header = document.getElementById('global-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    const closeDrawer = () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    };

    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));
  }

  /* ------------------------------------------------------------------------
     3. Video Playback Observer (Performance Optimization)
     ------------------------------------------------------------------------ */
  const bgVideos = document.querySelectorAll('.hero-bg-video');

  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.15 });

    bgVideos.forEach(v => videoObserver.observe(v));
  }

  /* ------------------------------------------------------------------------
     4. Animated Metric Counters (500+, 50,000+, 5+)
     ------------------------------------------------------------------------ */
  const metricCounters = document.querySelectorAll('.metric-counter');
  let countersDone = false;

  const runCounterAnimation = () => {
    metricCounters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target')) || 0;
      const duration = 1800;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = progress * (2 - progress);
        const currentVal = Math.floor(easeOut * target);

        counter.textContent = currentVal.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const metricsBar = document.querySelector('.hero-metrics-bar');
  if (metricsBar && 'IntersectionObserver' in window) {
    const metricsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersDone) {
          countersDone = true;
          runCounterAnimation();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    metricsObserver.observe(metricsBar);
  } else {
    runCounterAnimation();
  }

  /* ------------------------------------------------------------------------
     5. Filterable Project Gallery (assets/more_projects)
     ------------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('#gallery-filters .filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 15);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });


  /* ------------------------------------------------------------------------
     6. Fullscreen Lightbox Modal (Images & Videos)
     ------------------------------------------------------------------------ */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxMediaBox = document.getElementById('lightbox-media-box');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const mediaTriggers = document.querySelectorAll('.media-trigger');

  const openLightbox = (type, src, caption) => {
    if (!lightboxModal || !lightboxMediaBox) return;

    lightboxMediaBox.innerHTML = '';

    if (type === 'video') {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.style.maxWidth = '90vw';
      video.style.maxHeight = '75vh';
      lightboxMediaBox.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.alt = caption || 'Dera Laser Works';
      img.style.maxWidth = '90vw';
      img.style.maxHeight = '75vh';
      lightboxMediaBox.appendChild(img);
    }

    if (lightboxCaption) {
      lightboxCaption.textContent = caption || '';
    }

    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    if (lightboxMediaBox) lightboxMediaBox.innerHTML = '';
    document.body.style.overflow = '';
  };

  mediaTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const type = trigger.getAttribute('data-type') || 'image';
      const src = trigger.getAttribute('data-src');
      const caption = trigger.getAttribute('data-caption');
      if (src) openLightbox(type, src, caption);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });

  /* ------------------------------------------------------------------------
     8. Contact Form Submission
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact-form');
  const formToast = document.getElementById('form-toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const orig = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Sending...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = orig;
        contactForm.reset();

        if (formToast) {
          formToast.classList.remove('hidden');
          setTimeout(() => formToast.classList.add('hidden'), 7000);
        }
      }, 1000);
    });
  }

  /* ------------------------------------------------------------------------
     9. Interactive Laser Cursor Trail & Line Drawing Engine
     Draws a glowing neon laser beam that follows cursor movement with sparks
     ------------------------------------------------------------------------ */
  const laserCanvas = document.getElementById('laser-cursor-canvas');
  if (laserCanvas && window.matchMedia('(pointer: fine)').matches) {
    const ctx = laserCanvas.getContext('2d');
    let width = laserCanvas.width = window.innerWidth;
    let height = laserCanvas.height = window.innerHeight;

    let trailPoints = [];
    let laserSparks = [];
    let isLoopActive = false;
    let prevX = null;
    let prevY = null;

    const onResize = () => {
      width = laserCanvas.width = window.innerWidth;
      height = laserCanvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize, { passive: true });

    // Track cursor movement
    window.addEventListener('mousemove', (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const now = performance.now();

      if (prevX === null || prevY === null) {
        prevX = x;
        prevY = y;
      }

      const dist = Math.hypot(x - prevX, y - prevY);

      // Slim precision laser line sizing
      trailPoints.push({
        x,
        y,
        time: now,
        size: Math.min(dist * 0.04 + 1.2, 2.5)
      });

      // Emit fine laser cutting spark particles on faster cursor movement
      if (dist > 3) {
        const sparkCount = Math.min(Math.floor(dist / 8), 2);
        for (let i = 0; i < sparkCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 2.5 + 0.8;
          laserSparks.push({
            x,
            y,
            vx: Math.cos(angle) * speed + (x - prevX) * 0.05,
            vy: Math.sin(angle) * speed + (y - prevY) * 0.05,
            size: Math.random() * 1.4 + 0.6,
            life: 1.0,
            decay: Math.random() * 0.05 + 0.03,
            color: Math.random() > 0.4 ? '#FFB800' : (Math.random() > 0.5 ? '#FF2B00' : '#00F0FF')
          });
        }
      }

      prevX = x;
      prevY = y;

      if (!isLoopActive) {
        isLoopActive = true;
        requestAnimationFrame(renderLaserTrail);
      }
    }, { passive: true });

    const maxTrailLifetime = 480; // Sleek, responsive trail persistence (ms)

    function renderLaserTrail() {
      const now = performance.now();
      ctx.clearRect(0, 0, width, height);

      // Clean aged points
      trailPoints = trailPoints.filter(p => now - p.time < maxTrailLifetime);

      // 1. Draw Slim Laser Trail Beam
      if (trailPoints.length > 1) {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';

        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Outer Focused Neon Plasma Aura
        for (let i = 1; i < trailPoints.length; i++) {
          const p1 = trailPoints[i - 1];
          const p2 = trailPoints[i];
          const age = now - p2.time;
          const progress = Math.max(0, 1 - age / maxTrailLifetime);

          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);

          ctx.strokeStyle = isLight 
            ? `rgba(217, 34, 0, ${progress * 0.7})` 
            : `rgba(255, 43, 0, ${progress * 0.8})`;
          ctx.lineWidth = p2.size * 1.4;
          ctx.shadowBlur = isLight ? 5 : 9;
          ctx.shadowColor = isLight ? 'rgba(217, 34, 0, 0.4)' : 'rgba(255, 43, 0, 0.8)';
          ctx.stroke();

          // Core Hot Precision Filament
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
          ctx.strokeStyle = isLight 
            ? `rgba(255, 184, 0, ${progress * 0.9})` 
            : `rgba(255, 245, 220, ${progress * 0.95})`;
          ctx.lineWidth = Math.max(0.75, p2.size * 0.65);
          ctx.shadowBlur = 3;
          ctx.shadowColor = '#FFB800';
          ctx.stroke();
        }
        ctx.restore();
      }

      // 2. Draw CNC Laser Cutting Sparks
      if (laserSparks.length > 0) {
        for (let i = laserSparks.length - 1; i >= 0; i--) {
          const s = laserSparks[i];
          s.x += s.vx;
          s.y += s.vy;
          s.vy += 0.08; // Gravity drift
          s.life -= s.decay;

          if (s.life <= 0) {
            laserSparks.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.fillStyle = s.color;
          ctx.globalAlpha = Math.max(0, s.life);
          ctx.shadowBlur = 8;
          ctx.shadowColor = s.color;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Continue animation loop or sleep when idle
      if (trailPoints.length > 0 || laserSparks.length > 0) {
        requestAnimationFrame(renderLaserTrail);
      } else {
        isLoopActive = false;
        ctx.clearRect(0, 0, width, height);
      }
    }
  }

});
