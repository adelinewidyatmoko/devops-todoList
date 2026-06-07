window.addEventListener('DOMContentLoaded', () => {
    if (typeof ACTIVE_EFFECT === 'undefined' || ACTIVE_EFFECT !== 'autumn') return;

    const canvas = document.createElement('canvas');
    canvas.id = 'autumn-canvas';
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

    const NUM = 60;
    const particles = [];

    function makeLeaf() {
        return {
            x: Math.random() * width,
            y: Math.random() * -height,
            r: Math.random() * 8 + 5,
            speedY: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 2,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.08,
            swing: Math.random() * Math.PI * 2,
            swingSpeed: Math.random() * 0.03 + 0.01,
            hue: Math.floor(Math.random() * 50 + 10)
        };
    }

    for (let i = 0; i < NUM; i++) {
        const leaf = makeLeaf();
        leaf.y = Math.random() * height;
        particles.push(leaf);
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        for (const p of particles) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);

            ctx.fillStyle = `hsla(${p.hue}, 85%, 50%, 0.8)`;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.r * 0.5, p.r, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = `hsla(${p.hue}, 60%, 35%, 0.5)`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(0, -p.r);
            ctx.lineTo(0, p.r);
            ctx.stroke();

            ctx.restore();

            p.swing += p.swingSpeed;
            p.x += p.speedX + Math.sin(p.swing) * 1.5;
            p.y += p.speedY;
            p.rotation += p.rotSpeed;

            if (p.y > height + 20) {
                Object.assign(p, makeLeaf(), { x: Math.random() * width });
            }
        }

        requestAnimationFrame(draw);
    }

    draw();
});