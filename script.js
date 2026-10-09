/* ==========================================================
   ISABELA - XV AÑOS INTERACTIVE SCRIPTS
   ========================================================== */

let globalParticles = [];
let spawnParticleBurst = null;

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initEntrancePortal();
  initCountdown();
  initMusicPlayer();
  initCalendarLink();
  initButtonParticleEffects();
});

// 1. ENTRANCE SCREEN PORTAL & AUTO MUSIC TRIGGER
function initEntrancePortal() {
  const entranceOverlay = document.getElementById('entranceOverlay');
  const entranceRoseBtn = document.getElementById('entranceRoseBtn');
  const audio = document.getElementById('bgAudio');
  const musicBtn = document.getElementById('musicBtn');
  const disc = musicBtn ? musicBtn.querySelector('.music-disc') : null;

  if (!entranceRoseBtn || !entranceOverlay) return;

  entranceRoseBtn.addEventListener('click', (e) => {
    // Spawn celebratory sparkles burst at click position
    const rect = entranceRoseBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    if (spawnParticleBurst) {
      spawnParticleBurst(centerX, centerY, 50);
    }

    // Play Music
    if (audio) {
      audio.play().then(() => {
        if (disc) disc.classList.add('playing');
      }).catch(err => {
        console.log("Audio play allowed on user action:", err);
      });
    }

    // Smoothly dissolve entrance cover
    setTimeout(() => {
      entranceOverlay.classList.add('opened');
      document.body.style.overflow = 'auto';
    }, 250);
  });
}

// 2. COUNTDOWN TIMER
function initCountdown() {
  const now = new Date();
  let currentYear = now.getFullYear();
  let targetDate = new Date(`November 13, ${currentYear} 19:00:00`);

  if (now > targetDate) {
    targetDate = new Date(`November 13, ${currentYear + 1} 19:00:00`);
  }

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateTimer() {
    const currentTime = new Date().getTime();
    const difference = targetDate.getTime() - currentTime;

    if (difference <= 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minutesEl) minutesEl.innerText = '00';
      if (secondsEl) secondsEl.innerText = '00';
      return;
    }

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((difference % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = d < 10 ? '0' + d : d;
    if (hoursEl) hoursEl.innerText = h < 10 ? '0' + h : h;
    if (minutesEl) minutesEl.innerText = m < 10 ? '0' + m : m;
    if (secondsEl) secondsEl.innerText = s < 10 ? '0' + s : s;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// 3. BACKGROUND MUSIC CONTROLLER
function initMusicPlayer() {
  const musicBtn = document.getElementById('musicBtn');
  const disc = musicBtn ? musicBtn.querySelector('.music-disc') : null;
  const audio = document.getElementById('bgAudio');

  if (!musicBtn || !audio) return;

  musicBtn.addEventListener('click', (e) => {
    const rect = musicBtn.getBoundingClientRect();
    if (spawnParticleBurst) {
      spawnParticleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
    }

    if (audio.paused) {
      audio.play().then(() => {
        disc.classList.add('playing');
      }).catch(err => {
        console.log("Audio play error:", err);
      });
    } else {
      audio.pause();
      disc.classList.remove('playing');
    }
  });
}

// 4. SPARKLE & SILVER DUST PARTICLES (Background + Interactive Bursts)
function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const baseCount = Math.min(window.innerWidth < 600 ? 30 : 60, 70);
  const particles = [];

  for (let i = 0; i < baseCount; i++) {
    const isGold = Math.random() < 0.25;
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.6 - 0.2,
      opacity: Math.random() * 0.7 + 0.3,
      fadeSpeed: Math.random() * 0.01 + 0.005,
      growing: Math.random() > 0.5,
      isGold: isGold,
      isBurst: false
    });
  }

  // Function to spawn dynamic particle burst at coordinates
  spawnParticleBurst = function(x, y, count = 35) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 5 + 2;
      const isGold = Math.random() < 0.35;
      particles.push({
        x: x,
        y: y,
        radius: Math.random() * 3 + 1.2,
        speedX: Math.cos(angle) * velocity,
        speedY: Math.sin(angle) * velocity,
        opacity: 1,
        fadeSpeed: Math.random() * 0.02 + 0.015,
        growing: false,
        isGold: isGold,
        isBurst: true,
        friction: 0.94,
        gravity: 0.05
      });
    }
  };

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      if (p.isBurst) {
        p.speedX *= p.friction;
        p.speedY *= p.friction;
        p.speedY += p.gravity;
        p.opacity -= p.fadeSpeed;

        if (p.opacity <= 0) {
          particles.splice(i, 1);
          continue;
        }
      } else {
        if (p.growing) {
          p.opacity += p.fadeSpeed;
          if (p.opacity >= 0.9) p.growing = false;
        } else {
          p.opacity -= p.fadeSpeed;
          if (p.opacity <= 0.15) p.growing = true;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      
      if (p.isGold) {
        ctx.fillStyle = `rgba(254, 240, 138, ${Math.max(0, p.opacity)})`;
        ctx.shadowBlur = p.isBurst ? 14 : 10;
        ctx.shadowColor = 'rgba(234, 179, 8, 0.95)';
      } else {
        ctx.fillStyle = `rgba(240, 245, 255, ${Math.max(0, p.opacity)})`;
        ctx.shadowBlur = p.isBurst ? 14 : 8;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.95)';
      }
      
      ctx.fill();

      p.x += p.speedX;
      p.y += p.speedY;

      if (!p.isBurst) {
        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
      }
    }

    requestAnimationFrame(drawParticles);
  }

  drawParticles();
}

// 5. BUTTON INTERACTIVE PARTICLES & ACTION DELAY
function initButtonParticleEffects() {
  const interactiveButtons = document.querySelectorAll('.btn-royal, .btn-silver-outline, .btn-silver-ghost');

  interactiveButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      const target = this.getAttribute('target') || '_self';

      if (href && href !== '#' && !href.startsWith('javascript:')) {
        e.preventDefault();

        // Spawn particles
        const rect = this.getBoundingClientRect();
        if (spawnParticleBurst) {
          spawnParticleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
        }

        // Delay action for 550ms so user can enjoy the sparkle burst animation
        setTimeout(() => {
          if (target === '_blank') {
            window.open(href, '_blank');
          } else {
            window.location.href = href;
          }
        }, 550);
      }
    });
  });
}

// 6. GOOGLE CALENDAR LINK GENERATOR
function initCalendarLink() {
  const calBtn = document.getElementById('addToCalendarBtn');
  if (!calBtn) return;

  const title = encodeURIComponent("Mis XV Años - Isabela 👑");
  const details = encodeURIComponent("Celebración de los XV Años de Isabela en Quarzo Eventos Premium. ¡Te esperamos para compartir esta noche mágica!");
  const location = encodeURIComponent("Quarzo Eventos Premium, Carrera 81 #33-84, Laureles, Medellín");
  
  const currentYear = new Date().getFullYear();
  const dates = `${currentYear}1113T190000/${currentYear}1114T030000`;

  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  calBtn.href = googleCalUrl;
}

// 7. RSVP WHATSAPP HANDLER WITH PARTICLES & DELAY
function sendWhatsAppRSVP(event) {
  event.preventDefault();

  const submitBtn = event.target.querySelector('button[type="submit"]');
  if (submitBtn && spawnParticleBurst) {
    const rect = submitBtn.getBoundingClientRect();
    spawnParticleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);
  }

  const phone = "573137519376";
  const name = document.getElementById('guestName').value.trim();

  let text = `👑 *CONFIRMACIÓN DE ASISTENCIA - XV DE ISABELA* 👑\n\n`;
  text += `👤 *Invitado(a):* ${name}\n`;
  text += `🎟️ *Cupo:* 1 Persona (Pase Personal)\n`;
  text += `✨ *Estado:* ¡Confirmado! Asistiré a la celebración 🎉\n\n`;
  text += `📍 *Lugar:* Quarzo Eventos Premium (Carrera 81 #33-84, Laureles)`;

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;

  // Slight delay to visualize the particles burst
  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
  }, 600);
}
