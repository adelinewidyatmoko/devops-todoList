window.addEventListener('DOMContentLoaded', () => {
    if (typeof ACTIVE_EFFECT === 'undefined' || ACTIVE_EFFECT !== 'snow') return;

    const canvas = document.getElementById('snow-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const numFlakes = 80; 
    const flakes = [];

    for (let i = 0; i < numFlakes; i++) {
        flakes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 3 + 1,
            d: Math.random() * numFlakes
        });
    }

    function drawFlakes() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        
        for (let i = 0; i < numFlakes; i++) {
            const f = flakes[i];
            ctx.moveTo(f.x, f.y);
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
        }
        ctx.fill();
        moveFlakes();
    }

    let angle = 0;
    function moveFlakes() {
        angle += 0.01;
        for (let i = 0; i < numFlakes; i++) {
            const f = flakes[i];
            f.y += Math.cos(angle + f.d) + 1 + f.r / 2;
            f.x += Math.sin(angle) * 0.5;

            if (f.y > height) {
                flakes[i] = {
                    x: Math.random() * width,
                    y: -10,
                    r: f.r,
                    d: f.d
                };
            }
        }
    }

    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });

    function run() {
        drawFlakes();
        requestAnimationFrame(run);
    }

    run();
});