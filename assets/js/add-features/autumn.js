/* global ACTIVE_EFFECT */

// Your existing code follows below...
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
    function addTasksIteratively() {
    // 1. Read current stage from sessionStorage (Defaults to 0)
    // 0 = Needs to add Work
    // 1 = Needs to add Personal
    // >= 2 = Done!
    const currentStage = parseInt(sessionStorage.getItem('auto_task_stage') || '0', 10);

    const taskInput = document.querySelector('.input-task');
    const descriptionInput = document.querySelector('#description');
    const dateInput = document.querySelector('.input-date');
    const timeInput = document.querySelector('.input-time');
    const categoryChoosedInput = document.querySelector('#category-choosed');

    // Return if the form inputs aren't rendered on this page
    if (!taskInput || !descriptionInput || !dateInput || !timeInput || !categoryChoosedInput) {
      return; 
    }
    
    const form = taskInput.closest('form');
    if (!form) return;

    if (currentStage === 0) {
      // 📝 STEP 1: ADD WORK TASK
      taskInput.value = 'Go outside and plan fo Apple picking';
      descriptionInput.value = 'Prepare a basket and enjoy the autumn vibes';
      dateInput.value = '2026-07-20';
      timeInput.value = '09:00';
      categoryChoosedInput.value = 'work';

      // Mark that we are moving to Stage 1, then submit
      sessionStorage.setItem('auto_task_stage', '1');
      form.submit();
      
    } else if (currentStage === 1) {
      // 📝 STEP 2: ADD PERSONAL TASK
      taskInput.value = 'Go for a walk and enjoy the autumn leaves';
      descriptionInput.value = 'Bring a camera to capture the beautiful scenery';
      dateInput.value = '2026-07-25';
      timeInput.value = '08:00';
      categoryChoosedInput.value = 'personal';

      // Mark that we are moving to Stage 2 (Finished), then submit
      sessionStorage.setItem('auto_task_stage', '2');
      form.submit();
    }
    else if (currentStage === 2) {
      // 📝 STEP 2: ADD SHOPPING TASK
      taskInput.value = 'Buy pumpkin spice latte ingredients';
      descriptionInput.value = 'Enjoy the cozy autumn flavors at home';
      dateInput.value = '2026-07-25';
      timeInput.value = '08:00';
      categoryChoosedInput.value = 'shopping';

      // Mark that we are moving to Stage 2 (Finished), then submit
      sessionStorage.setItem('auto_task_stage', '3');
      form.submit();
    }else if (currentStage === 3) {
      // 📝 STEP 2: ADD OTHERS TASK
      taskInput.value = 'Plan a cozy autumn picnic with friends';
      descriptionInput.value = 'Choose a scenic spot and enjoy the crisp autumn air';
      dateInput.value = '2026-07-25';
      timeInput.value = '08:00';
      categoryChoosedInput.value = 'others';

      // Mark that we are moving to Stage 2 (Finished), then submit
      sessionStorage.setItem('auto_task_stage', '4');
      form.submit();
    }
    // If currentStage is 2 or more, it will do nothing and just let you use the app normally!
  }
    addTasksIteratively();
    draw();
});