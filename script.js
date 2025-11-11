(() => {
    const canvas = document.querySelector('canvas.particle-cursor');
    const ctx = canvas.getContext('2d', { alpha: true });
  
    // Handle high-DPI / Retina scaling
    function resizeCanvas() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
  
    // Cursor smoothing (slight lag)
    const cursor = { x: innerWidth / 2, y: innerHeight / 2, tx: innerWidth / 2, ty: innerHeight / 2 };
    window.addEventListener('mousemove', (e) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      spawnBurst(e.clientX, e.clientY);
    }, { passive: true });
  
    // Particle system setup
    const MAX_PARTICLES = 325;
    const particles = [];
  
    function makeParticle(x, y) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.6 + Math.random() * 1.4;
      const life = 25 + Math.random() * 26;
      return {
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.9,
        baseR: 1.4 + Math.random() * 3.2,
        r: 0.8,
        life, remaining: life,
        hue: 185 + (Math.random() * 20 - 10),
        sat: 85, light: 72,
        opacity: 1,
        grow: 0.16 + Math.random() * 0.36
      };
    }
  
    function spawnBurst(px, py) {
      const count = 6 + Math.floor(Math.random() * 6);
      for (let i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES) break;
        particles.push(makeParticle(px + (Math.random() * 6 - 3), py + (Math.random() * 6 - 3)));
      }
    }
  
    // Small tracer effect for subtle tail
    let lastMoveAt = performance.now();
    const tracerInterval = 35;
    setInterval(() => {
      const now = performance.now();
      if (Math.hypot(cursor.tx - cursor.x, cursor.ty - cursor.y) > 0.5 || (now - lastMoveAt) < 100) {
        spawnBurst(cursor.tx, cursor.ty);
      }
    }, tracerInterval);
  
    // Main animation loop
    function tick() {
      requestAnimationFrame(tick);
      cursor.tx += (cursor.x - cursor.tx) * 0.22;
      cursor.ty += (cursor.y - cursor.ty) * 0.22;
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(10,10,10,0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';
  
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.995;
        p.vy *= 0.995;
        p.remaining--;
        p.opacity = Math.max(0, p.remaining / p.life);
        p.r += p.grow;
  
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.2);
        const coreColor = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${0.95 * p.opacity})`;
        const midColor  = `hsla(${p.hue}, ${p.sat}%, ${Math.max(58, p.light - 12)}%, ${0.48 * p.opacity})`;
        g.addColorStop(0, coreColor);
        g.addColorStop(0.24, midColor);
        g.addColorStop(1, `hsla(${p.hue}, ${p.sat}%, ${p.light}%, 0)`);
  
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 1.6, 0, Math.PI * 2);
        ctx.fill();
  
        if (p.remaining <= 0 || p.opacity <= 0.01) {
          particles.splice(i, 1);
        }
      }
    }
  
    tick();
  
    // Disable on touch devices for performance
    function disableOnTouch() {
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        canvas.style.display = 'none';
      }
    }
    disableOnTouch();
  })();
  
