window.addEventListener('DOMContentLoaded', () => {
    if (typeof ACTIVE_EFFECT === 'undefined' || ACTIVE_EFFECT !== 'summer') return;

    const canvas = document.createElement('canvas');
    canvas.id = 'summer-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const NUM_FIREFLY = 20;
    const fireflies = [];

    function makeFirefly() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 3 + 2,
            speedX: (Math.random() - 0.5) * 0.6,
            speedY: (Math.random() - 0.5) * 0.6,
            alpha: Math.random(),
            alphaDir: (Math.random() > 0.5 ? 1 : -1) * 0.015,
            flicker: 0,
            flickerSpeed: Math.random() * 0.05 + 0.02
        };
    }

    for (let i = 0; i < NUM_FIREFLY; i++) fireflies.push(makeFirefly());

    const NUM_PETAL = 15;
    const petals = [];

    const PETAL_COLORS = [
        'hsla(350, 90%, 75%, 0.8)',
        'hsla(10, 90%, 72%, 0.8)',
        'hsla(330, 85%, 78%, 0.8)',
        'hsla(0, 80%, 80%, 0.8)'
    ];

    function makePetal() {
        return {
            x: Math.random() * width,
            y: height + Math.random() * 50,
            w: Math.random() * 12 + 6,
            h: Math.random() * 18 + 10,
            speedX: (Math.random() - 0.5) * 1.2,
            speedY: -(Math.random() * 1.5 + 0.5),
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.06,
            color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
            drift: Math.random() * Math.PI * 2,
            driftSpeed: Math.random() * 0.02 + 0.01
        };
    }

    for (let i = 0; i < NUM_PETAL; i++) {
        const p = makePetal();
        p.y = Math.random() * height;
        petals.push(p);
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        for (const f of fireflies) {
            f.flicker += f.flickerSpeed;
            f.alpha += f.alphaDir;
            if (f.alpha <= 0.05 || f.alpha >= 0.95) f.alphaDir *= -1;

            const glow = f.r * 4 + Math.sin(f.flicker) * 2;
            const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, glow);
            grd.addColorStop(0, `rgba(255, 230, 80, ${f.alpha})`);
            grd.addColorStop(0.4, `rgba(255, 200, 40, ${f.alpha * 0.6})`);
            grd.addColorStop(1, `rgba(255, 180, 0, 0)`);

            ctx.beginPath();
            ctx.fillStyle = grd;
            ctx.arc(f.x, f.y, glow, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 180, ${f.alpha})`;
            ctx.arc(f.x, f.y, f.r * 0.5, 0, Math.PI * 2);
            ctx.fill();

            f.x += f.speedX;
            f.y += f.speedY;
            f.speedX += (Math.random() - 0.5) * 0.05;
            f.speedY += (Math.random() - 0.5) * 0.05;

            if (f.x < 0 || f.x > width) f.speedX *= -1;
            if (f.y < 0 || f.y > height) f.speedY *= -1;
        }

        for (const p of petals) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);

            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(0, -p.h / 2);
            ctx.lineTo(0, p.h / 2);
            ctx.stroke();

            ctx.restore();

            p.drift += p.driftSpeed;
            p.x += p.speedX + Math.sin(p.drift) * 0.8;
            p.y += p.speedY;
            p.rotation += p.rotSpeed;

            if (p.y < -30) {
                Object.assign(p, makePetal());
            }
        }

        requestAnimationFrame(draw);
    }

    draw();
});