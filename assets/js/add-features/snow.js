/* global ACTIVE_EFFECT */

// Your existing code follows below...
window.addEventListener('DOMContentLoaded', () => {
  if (typeof ACTIVE_EFFECT === 'undefined' || ACTIVE_EFFECT !== 'snow') return;
  
  const canvas = document.getElementById('snow-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  // Pengaturan jumlah dan kecepatan salju
  const numFlakes = 80;
  const flakes = [];

  // Membuat koordinat awal kepingan salju
  for (let i = 0; i < numFlakes; i++) {
    flakes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3 + 1, // Ukuran kepingan salju berbeda-beda
      d: Math.random() * numFlakes, // Massa/berat untuk kecepatan jatuh
    });
  }

  // Menggambar kepingan salju
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

  // Menggerakkan kepingan salju jatuh ke bawah
  let angle = 0;
  function moveFlakes() {
    angle += 0.01;
    for (let i = 0; i < numFlakes; i++) {
      const f = flakes[i];

      // Jatuh ke bawah + sedikit goyangan kiri kanan (sinus)
      f.y += Math.cos(angle + f.d) + 1 + f.r / 2;
      f.x += Math.sin(angle) * 0.5;

      // Jika salju mencapai bagian bawah layar, kembalikan ke atas
      if (f.y > height) {
        flakes[i] = {
          x: Math.random() * width,
          y: -10,
          r: f.r,
          d: f.d,
        };
      }
    }
  }

  // Mengatur ulang ukuran canvas ketika browser di-resize
  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });

  // Jalankan loop animasi secara terus menerus
  function run() {
    drawFlakes();
    requestAnimationFrame(run);
  }
  
   // --- Automatic Task Adding Logic ---
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
      taskInput.value = 'Send Vacation Request Email';
      descriptionInput.value = 'Prepare slides for Monday';
      dateInput.value = '2026-12-20';
      timeInput.value = '09:00';
      categoryChoosedInput.value = 'work';

      // Mark that we are moving to Stage 1, then submit
      sessionStorage.setItem('auto_task_stage', '1');
      form.submit();
      
    } else if (currentStage === 1) {
      // 📝 STEP 2: ADD PERSONAL TASK
      taskInput.value = 'Call Mom';
      descriptionInput.value = 'Wish her a merry christmas';
      dateInput.value = '2026-12-25';
      timeInput.value = '08:00';
      categoryChoosedInput.value = 'personal';

      // Mark that we are moving to Stage 2 (Finished), then submit
      sessionStorage.setItem('auto_task_stage', '2');
      form.submit();
    }
    else if (currentStage === 2) {
      // 📝 STEP 2: ADD PERSONAL TASK
      taskInput.value = 'Buy Christmas Gifts';
      descriptionInput.value = 'Wish your love ones a merry christmas';
      dateInput.value = '2026-12-25';
      timeInput.value = '08:00';
      categoryChoosedInput.value = 'shopping';

      // Mark that we are moving to Stage 2 (Finished), then submit
      sessionStorage.setItem('auto_task_stage', '3');
      form.submit();
    }else if (currentStage === 3) {
      // 📝 STEP 2: ADD PERSONAL TASK
      taskInput.value = 'Plan to spend you christmas with family';
      descriptionInput.value = 'Wish your love ones a merry christmas';
      dateInput.value = '2026-12-25';
      timeInput.value = '08:00';
      categoryChoosedInput.value = 'others';

      // Mark that we are moving to Stage 2 (Finished), then submit
      sessionStorage.setItem('auto_task_stage', '4');
      form.submit();
    }
    // If currentStage is 2 or more, it will do nothing and just let you use the app normally!
  }
  run();
  addTasksIteratively();
});
