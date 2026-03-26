// ===== Nick's Door Company - Interactive JS =====
document.addEventListener('DOMContentLoaded', () => {

  // === Mobile Menu ===
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // === Navbar Scroll Effect ===
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // === Scroll Animations (Intersection Observer) ===
  const animatedEls = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    animatedEls.forEach(el => observer.observe(el));
  } else {
    animatedEls.forEach(el => el.classList.add('visible'));
  }

  // === Counter Animation ===
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        let current = 0;
        const increment = Math.max(1, Math.floor(target / 60));
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = prefix + current.toLocaleString() + suffix;
        }, 30);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  // === Service Card Expand/Collapse ===
  document.querySelectorAll('.service-card .learn-more').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.service-card');
      card.classList.toggle('expanded');
      btn.innerHTML = card.classList.contains('expanded')
        ? 'Show Less <i class="fas fa-chevron-up"></i>'
        : 'Learn More <i class="fas fa-chevron-right"></i>';
    });
  });

  // === Gallery Filter ===
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeIn 0.4s ease';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // === Testimonial Slider ===
  const track = document.querySelector('.testimonial-track');
  const dots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  const totalSlides = dots.length;

  function goToSlide(index) {
    currentSlide = index;
    if (track) track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });
  // Auto-rotate every 5s
  setInterval(() => {
    goToSlide((currentSlide + 1) % totalSlides);
  }, 5000);

  // === Multi-Step Form ===
  const formSteps = document.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  const progressLines = document.querySelectorAll('.progress-line');
  let currentFormStep = 0;

  function showFormStep(step) {
    formSteps.forEach((s, i) => s.classList.toggle('active', i === step));
    progressSteps.forEach((s, i) => {
      s.classList.remove('active', 'completed');
      if (i === step) s.classList.add('active');
      if (i < step) s.classList.add('completed');
    });
    progressLines.forEach((l, i) => l.classList.toggle('active', i < step));
    currentFormStep = step;
  }

  document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(currentFormStep)) {
        showFormStep(currentFormStep + 1);
      }
    });
  });
  document.querySelectorAll('.btn-prev').forEach(btn => {
    btn.addEventListener('click', () => showFormStep(currentFormStep - 1));
  });

  function validateStep(step) {
    let valid = true;
    const currentStepEl = formSteps[step];
    if (!currentStepEl) return true;
    const required = currentStepEl.querySelectorAll('[required]');
    required.forEach(field => {
      const group = field.closest('.form-group');
      if (!field.value.trim()) {
        if (group) group.classList.add('error');
        valid = false;
      } else {
        if (group) group.classList.remove('error');
      }
    });
    return valid;
  }

  // Form submit
  const form = document.getElementById('serviceForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateStep(currentFormStep)) {
        alert('Thank you! Your service request has been submitted. We will contact you within 24 hours.');
        form.reset();
        showFormStep(0);
      }
    });
  }

  // Contact method selection
  document.querySelectorAll('.method-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.method-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const input = document.getElementById('contactMethod');
      if (input) input.value = opt.getAttribute('data-method');
    });
  });

  // Upload area
  const uploadArea = document.querySelector('.upload-area');
  const fileInput = document.getElementById('photoUpload');
  if (uploadArea && fileInput) {
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        uploadArea.innerHTML = `<i class="fas fa-check-circle" style="color: #4CAF50;"></i><p>${fileInput.files.length} file(s) selected</p>`;
      }
    });
  }

  // === FAQ Accordion ===
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // === Back to Top ===
  const backBtn = document.querySelector('.back-to-top');
  window.addEventListener('scroll', () => {
    if (backBtn) backBtn.classList.toggle('visible', window.scrollY > 500);
  });
  if (backBtn) {
    backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // === Smooth scroll for anchor links ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

});
