/* ==========================================================
   ISABELA - XV AÑOS INTERACTIVE SCRIPTS
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initMusicPlayer();
  initParticles();
  initCalendarLink();
});

// 1. COUNTDOWN TIMER
function initCountdown() {
  // Target: November 13, 19:00:00 (7 PM)
  // Let's determine the target year: if Nov 13 has passed this year, take current or next
  const now = new Date();
  let currentYear = now.getFullYear();
  let targetDate = new Date(`November 13, ${currentYear} 19:00:00`);

  if (now > targetDate) {
    // If it already passed this year, set for next year or keep current
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

// 2. BACKGROUND MUSIC CONTROLLER
function initMusicPlayer() {
  const musicBtn = document.getElementById('musicBtn');
  const disc = musicBtn ? musicBtn.querySelector('.music-disc') : null;
  const audio = document.getElementById('bgAudio');

  if (!musicBtn || !audio) return;

  let isPlaying = false;

  musicBtn.addEventListener('click', () => {
    if (!isPlaying) {
      audio.play().then(() => {
        isPlaying = true;
        disc.classList.add('playing');
      }).catch(err => {
        console.log("Audio play error:", err);
      });
    } else {
      audio.pause();
      isPlaying = false;
      disc.classList.remove('playing');
    }
  });

  // Try auto play on first user interaction with the page
  const startAudioOnFirstClick = () => {
    if (!isPlaying) {
      audio.play().then(() => {
        isPlaying = true;
        if (disc) disc.classList.add('playing');
      }).catch(() => {});
    }
    document.removeEventListener('click', startAudioOnFirstClick);
  };
  document.addEventListener('click', startAudioOnFirstClick, { once: true });
}

// 3. SPARKLE & SILVER DUST PARTICLES
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

  const particlesCount = Math.min(window.innerWidth < 600 ? 30 : 60, 70);
  const particles = [];

  for (let i = 0; i < particlesCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.6 - 0.2, // Float upwards
      opacity: Math.random() * 0.7 + 0.3,
      fadeSpeed: Math.random() * 0.01 + 0.005,
      growing: Math.random() > 0.5
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    for (let p of particles) {
      // Glow and fade
      if (p.growing) {
        p.opacity += p.fadeSpeed;
        if (p.opacity >= 0.9) p.growing = false;
      } else {
        p.opacity -= p.fadeSpeed;
        if (p.opacity <= 0.15) p.growing = true;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230, 235, 245, ${p.opacity})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();

      // Move particle
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around screen
      if (p.y < 0) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
    }

    requestAnimationFrame(drawParticles);
  }

  drawParticles();
}

// 4. GOOGLE CALENDAR LINK GENERATOR
function initCalendarLink() {
  const calBtn = document.getElementById('addToCalendarBtn');
  if (!calBtn) return;

  const title = encodeURIComponent("Mis XV Años - Isabela 👑");
  const details = encodeURIComponent("Celebración de los XV Años de Isabela. ¡Te esperamos para compartir esta noche mágica!");
  const location = encodeURIComponent("Carrera 81 #33-84, Laureles, Medellín");
  
  // Format dates: YYYYMMDDTHHMMSSZ (UTC or local)
  const currentYear = new Date().getFullYear();
  const dates = `${currentYear}1113T190000/${currentYear}1114T030000`;

  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  calBtn.href = googleCalUrl;
}

// 5. RSVP WHATSAPP HANDLER
function sendWhatsAppRSVP(event) {
  event.preventDefault();

  const phone = "573137519376"; // WhatsApp Number 3137519376 (Colombia +57)
  const name = document.getElementById('guestName').value.trim();
  const passes = document.getElementById('guestPasses').value;

  let text = `👑 *CONFIRMACIÓN DE ASISTENCIA - XV DE ISABELA* 👑\n\n`;
  text += `👤 *Invitado(s):* ${name}\n`;
  text += `🎟️ *Cupos confirmados:* ${passes}\n`;
  text += `✨ *Estado:* ¡Confirmado! Asistiremos a la celebración 🎉\n\n`;
  text += `📍 *Lugar:* Carrera 81 #33-84, Laureles`;

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, '_blank');
}
