// -------- LOAD SAVED DATA OR USE DEFAULT --------
const defaultTitle = "⚡ Thomas Edison";
const defaultData = [
    { title: "Thomas Edison", titleSize: 2.5, lines: ["1847 – 1931", "Milan, Ohio", "Inventor & Innovator"], textSize: 2.8 },
    { title: "Key Inventions", titleSize: 2.5, lines: ["• Light Bulb (1879)", "• Phonograph (1877)", "• Motion Picture Camera", "• Electric Power Distribution"], textSize: 2.8 },
    { title: "Menlo Park", titleSize: 2.5, lines: ["The First Industrial Lab", "Innovation & Teamwork", "New Jersey, USA"], textSize: 2.8 },
    { title: "Famous Quotes", titleSize: 2.5, lines: ["• 'Genius is 1% inspiration…'", "• 'I have not failed…'", "• 'Just found 10,000 ways…'"], textSize: 2.8 },
    { title: "Legacy", titleSize: 2.5, lines: ["1,093 Patents", "Holder of Light", "Died 1931"], textSize: 2.8 }
];

let savedState = JSON.parse(localStorage.getItem('presentationState'));
let presentationTitle = (savedState && savedState.title) ? savedState.title : defaultTitle;
let slidesData = (savedState && savedState.slides) ? savedState.slides : defaultData;

// -------- DOM refs --------
const wrapper = document.getElementById('slide-wrapper');
const progressBar = document.getElementById('progress-bar');
const currentPageEl = document.getElementById('current-page');
const totalPagesEl = document.getElementById('total-pages');
const footerTextEl = document.getElementById('footer-text');

let currentIndex = 0;

// -------- SAVE TO LOCAL STORAGE --------
function saveToLocalStorage() {
    const state = {
        title: presentationTitle,
        slides: slidesData
    };
    localStorage.setItem('presentationState', JSON.stringify(state));
}

// -------- RENDER SLIDES --------
function renderSlides() {
    wrapper.innerHTML = '';
    slidesData.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.classList.add('slide');

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('slide-content');

        // Edit Icon
        const editIcon = document.createElement('div');
        editIcon.innerHTML = '✎';
        editIcon.classList.add('edit-icon');
        editIcon.title = "Edit Slide";
        editIcon.onclick = (e) => {
            e.stopPropagation();
            startEditMode(index);
        };
        contentDiv.appendChild(editIcon);

        // Content Display Wrapper
        const displayContent = document.createElement('div');
        displayContent.classList.add('display-content');
        displayContent.style.width = '100%';
        displayContent.style.display = 'flex';
        displayContent.style.flexDirection = 'column';
        displayContent.style.alignItems = 'center';

        if (slide.title) {
            const h3 = document.createElement('h3');
            h3.textContent = slide.title;
            h3.style.fontSize = `${slide.titleSize || 2.5}rem`; 
            displayContent.appendChild(h3);
        }

        slide.lines.forEach((line) => {
            const p = document.createElement('p');
            p.textContent = line;
            p.style.fontSize = `${slide.textSize || 2.8}rem`; 
            displayContent.appendChild(p);
        });

        contentDiv.appendChild(displayContent);

        // Edit Form (Hidden by default)
        const editForm = document.createElement('div');
        editForm.classList.add('edit-form');
        editForm.id = `edit-form-${index}`;

        editForm.innerHTML = `
            <div class="global-label">Footer Name (Applies to all pages):</div>
            <input type="text" class="edit-input" id="footer-input-${index}" value="${presentationTitle}" placeholder="Footer Title">
            
            <div class="global-label" style="margin-top: 0.5rem;">Slide Title:</div>
            <input type="text" class="edit-input" id="title-input-${index}" value="${slide.title || ''}" placeholder="Slide Title">
            
            <div class="size-control-wrapper">
                <div class="size-control">
                    <span class="size-label">Title Size</span>
                    <div class="size-input-group">
                        <button type="button" class="size-btn" onclick="adjustSize('title-size-input-${index}', -0.1)">-</button>
                        <input type="number" class="size-input" id="title-size-input-${index}" value="${slide.titleSize || 2.5}" min="0.5" max="10" step="0.1">
                        <button type="button" class="size-btn" onclick="adjustSize('title-size-input-${index}', 0.1)">+</button>
                        <span class="unit-label">rem</span>
                    </div>
                </div>
                
                <div class="size-control">
                    <span class="size-label">Text Size</span>
                    <div class="size-input-group">
                        <button type="button" class="size-btn" onclick="adjustSize('text-size-input-${index}', -0.1)">-</button>
                        <input type="number" class="size-input" id="text-size-input-${index}" value="${slide.textSize || 2.8}" min="0.5" max="10" step="0.1">
                        <button type="button" class="size-btn" onclick="adjustSize('text-size-input-${index}', 0.1)">+</button>
                        <span class="unit-label">rem</span>
                    </div>
                </div>
            </div>

            <div class="global-label">Slide Paragraphs:</div>
            <textarea class="edit-input edit-textarea" id="lines-input-${index}" placeholder="One line per paragraph">${slide.lines.join('\n')}</textarea>
            
            <div class="form-buttons">
                <div class="left-group">
                    <button class="btn btn-download" onclick="downloadHTML()">Download</button>
                    <button class="btn btn-add-page" onclick="addPage(${index})">+ Add Page</button>
                    <button class="btn btn-cancel" onclick="cancelEdit(${index})">Cancel</button>
                </div>
                <button class="btn btn-save" onclick="saveChanges(${index})">Save</button>
            </div>
        `;
        
        editForm.addEventListener('click', (e) => e.stopPropagation());

        contentDiv.appendChild(editForm);
        slideDiv.appendChild(contentDiv);
        wrapper.appendChild(slideDiv);
    });
}

function adjustSize(inputId, delta) {
    const input = document.getElementById(inputId);
    let newVal = parseFloat(input.value) + delta;
    newVal = Math.max(0.5, Math.min(newVal, 10));
    input.value = newVal.toFixed(1);
}

function startEditMode(index) {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((s, i) => {
        if (i === index) {
            const form = s.querySelector('.edit-form');
            const display = s.querySelector('.display-content');
            const icon = s.querySelector('.edit-icon');
            if (form) form.classList.add('active');
            if (display) display.style.display = 'none';
            if (icon) icon.style.display = 'none';
        }
    });
}

function saveChanges(index) {
    const footerInput = document.getElementById(`footer-input-${index}`);
    presentationTitle = footerInput.value.trim() || "⚡ Presentation";
    footerTextEl.textContent = presentationTitle;

    const titleInput = document.getElementById(`title-input-${index}`);
    const linesInput = document.getElementById(`lines-input-${index}`);
    const titleSizeInput = document.getElementById(`title-size-input-${index}`);
    const textSizeInput = document.getElementById(`text-size-input-${index}`);

    const newTitle = titleInput.value.trim();
    const newLines = linesInput.value.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const newTitleSize = parseFloat(titleSizeInput.value) || 2.5;
    const newTextSize = parseFloat(textSizeInput.value) || 2.8;

    slidesData[index] = {
        title: newTitle,
        titleSize: newTitleSize,
        lines: newLines,
        textSize: newTextSize
    };

    // Save to Local Storage
    saveToLocalStorage();

    renderSlides();
    updateSlide();
}

function cancelEdit(index) {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((s, i) => {
        if (i === index) {
            const form = s.querySelector('.edit-form');
            const display = s.querySelector('.display-content');
            const icon = s.querySelector('.edit-icon');
            if (form) form.classList.remove('active');
            if (display) display.style.display = 'flex';
            if (icon) icon.style.display = 'block';
        }
    });
}

function addPage(index) {
    slidesData.push({
        title: "New Slide",
        titleSize: 2.5,
        lines: ["Click edit to modify", "Add your content here"],
        textSize: 2.8
    });
    
    // Save newly added page to Local Storage
    saveToLocalStorage();

    renderSlides();
    currentIndex = slidesData.length - 1; 
    updateSlide();
    startEditMode(currentIndex);
}

// -------- DOWNLOAD STATIC HTML --------
function downloadHTML() {
    let slidesHTML = '';
    slidesData.forEach((slide, index) => {
        let activeClass = index === 0 ? ' active' : ''; 
        let titleHTML = slide.title ? `<h3 style="font-size: ${slide.titleSize}rem;">${slide.title}</h3>` : '';
        let linesHTML = slide.lines.map(line => `<p style="font-size: ${slide.textSize}rem;">${line}</p>`).join('');
        
        slidesHTML += `
        <div class="slide${activeClass}">
            <div class="slide-content">
                <div class="display-content">
                    ${titleHTML}
                    ${linesHTML}
                </div>
            </div>
        </div>`;
    });

    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${presentationTitle}</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; user-select: none; }
        body { background: #0a0a0a; color: #FFD700; font-family: 'Noto Sans Ethiopic', sans-serif; height: 100vh; width: 100vw; overflow: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center; }
        #bg-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
        .presentation-container { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 10; padding-bottom: 60px; }
        .slide-wrapper { position: relative; width: 95vw; height: 85vh; max-width: 1200px; display: flex; flex-direction: column; justify-content: center; align-items: center; pointer-events: none; margin-bottom: 10px; }
        .slide { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; height: 100%; opacity: 0; visibility: hidden; transition: opacity 0.6s ease, visibility 0.6s ease; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
        .slide.active { opacity: 1; visibility: visible; z-index: 2; }
        .slide-content { padding: 1.5rem 2rem; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; position: relative; }
        .display-content { width: 100%; display: flex; flex-direction: column; align-items: center; }
        h3 { font-weight: 900; color: #fff; padding: 0.5rem 1.2rem; border-left: 3px solid #FFD700; border-right: 3px solid #FFD700; text-shadow: 0 0 10px #FFD700; text-transform: uppercase; margin-bottom: 2rem; display: inline-block; letter-spacing: 1px; }
        p { margin: 0.6rem 0; line-height: 1.4; color: #FFD700; font-weight: 700; text-shadow: 0 0 8px rgba(0,0,0,0.9), 0 0 12px rgba(255, 215, 0, 0.3); opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .slide.active p { opacity: 1; transform: translateY(0); }
        .footer-recovered { position: absolute; bottom: 0; left: 0; width: 100%; height: 60px; background: rgba(0, 0, 0, 0.85); border-top: 1px solid rgba(255, 215, 0, 0.5); display: flex; justify-content: space-between; align-items: center; padding: 0 30px; backdrop-filter: blur(4px); flex-shrink: 0; z-index: 40; }
        .footer-info { color: rgba(255, 215, 0, 0.7); font-size: 0.9rem; font-family: sans-serif; font-weight: bold; letter-spacing: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 50%; }
        .controls-wrapper { display: flex; align-items: center; gap: 15px; }
        .controls { display: flex; justify-content: center; align-items: center; gap: 10px; background: rgba(0, 0, 0, 0.7); padding: 5px 16px; border-radius: 40px; border: 1px solid rgba(255, 215, 0, 0.4); box-shadow: 0 0 12px rgba(255, 215, 0, 0.1); }
        .page-num { font-family: sans-serif; font-size: 0.95rem; color: #FFD700; font-weight: 700; min-width: 22px; text-align: center; line-height: 1; }
        .progress-container { width: 120px; height: 4px; background: rgba(255, 255, 255, 0.15); border-radius: 4px; overflow: hidden; }
        .progress-bar { height: 100%; background: #FFD700; width: 0%; transition: width 0.3s ease; box-shadow: 0 0 10px #FFD700; }
        @media (max-width: 768px) { .slide-wrapper { height: 82vh; padding-bottom: 70px; } .footer-recovered { height: 54px; padding: 0 12px; } .progress-container { width: 80px; } }
        @media (max-width: 480px) { .progress-container { width: 60px; } .footer-info { font-size: 0.8rem; max-width: 40%; } }
    </style>
</head>
<body>
    <canvas id="bg-canvas"></canvas>
    <main class="presentation-container" id="main-container">
        <div class="slide-wrapper" id="slide-wrapper">
            ${slidesHTML}
        </div>
        <div class="footer-recovered">
            <div class="footer-info">${presentationTitle}</div>
            <div class="controls-wrapper">
                <nav class="controls">
                    <span class="page-num" id="current-page">1</span>
                    <div class="progress-container">
                        <div class="progress-bar" id="progress-bar"></div>
                    </div>
                    <span class="page-num" id="total-pages">${slidesData.length}</span>
                </nav>
            </div>
        </div>
    </main>

    <script>
        const slides = document.querySelectorAll('.slide');
        const progressBar = document.getElementById('progress-bar');
        const currentPageEl = document.getElementById('current-page');
        let currentIndex = 0;

        function updateSlide() {
            slides.forEach((slide, index) => {
                slide.classList.remove('active');
                if (index === currentIndex) slide.classList.add('active');
            });
            currentPageEl.textContent = currentIndex + 1;
            const progress = ((currentIndex + 1) / slides.length) * 100;
            progressBar.style.width = progress + '%';
        }

        function nextSlide() { if (currentIndex < slides.length - 1) { currentIndex++; updateSlide(); } }
        function prevSlide() { if (currentIndex > 0) { currentIndex--; updateSlide(); } }

        document.getElementById('main-container').addEventListener('click', (e) => {
            if (e.target.closest('.footer-recovered')) return;
            const width = window.innerWidth;
            const clickX = e.clientX;
            if (clickX < width * 0.3) prevSlide();
            else if (clickX > width - width * 0.3) nextSlide();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'n') nextSlide();
            if (e.key === 'ArrowLeft' || e.key === 'p') prevSlide();
        });

        updateSlide();

        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');
        let width, height, particles = [];
        function resizeCanvas() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; }
        class Particle { constructor() { this.reset(); } reset() { this.x = Math.random() * width; this.y = Math.random() * height; this.size = Math.random() * 2.2 + 0.4; this.speedX = (Math.random() - 0.5) * 0.3; this.speedY = (Math.random() - 0.5) * 0.3; this.opacity = Math.random() * 0.5 + 0.15; this.twinkle = Math.random() * 0.025 + 0.005; this.direction = 1; } update() { this.x += this.speedX; this.y += this.speedY; this.opacity += this.twinkle * this.direction; if (this.opacity > 0.8 || this.opacity < 0.1) this.direction *= -1; if (this.x < 0) this.x = width; if (this.x > width) this.x = 0; if (this.y < 0) this.y = height; if (this.y > height) this.y = 0; } draw() { ctx.shadowBlur = this.size > 1.8 ? 12 : 0; ctx.shadowColor = 'rgba(255, 215, 0, 0.7)'; ctx.fillStyle = 'rgba(255, 215, 0, ' + this.opacity + ')'; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); } }
        function initParticles() { particles = []; const count = Math.min(140, (width * height) / 7000); for (let i = 0; i < count; i++) particles.push(new Particle()); }
        function animate() { ctx.clearRect(0, 0, width, height); const grad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width); grad.addColorStop(0, '#0b0b0b'); grad.addColorStop(1, '#000000'); ctx.fillStyle = grad; ctx.fillRect(0, 0, width, height); particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animate); }
        window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
        resizeCanvas(); initParticles(); animate();
    </script>
</body>
</html>`;

    const blob = new Blob([fullHTML], { type: 'text/html' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = 'Thomas-Edison-Presentation.html';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(anchor.href);
}

// -------- UPDATE UI --------
function updateSlide() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === currentIndex) {
            slide.classList.add('active');
        }
    });

    footerTextEl.textContent = presentationTitle;
    currentPageEl.textContent = currentIndex + 1;
    totalPagesEl.textContent = slidesData.length;
    const progress = ((currentIndex + 1) / slidesData.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function nextSlide() {
    if (currentIndex < slidesData.length - 1) { currentIndex++; updateSlide(); }
}

function prevSlide() {
    if (currentIndex > 0) { currentIndex--; updateSlide(); }
}

function init() {
    renderSlides();
    updateSlide();
}

const container = document.getElementById('main-container');
container.addEventListener('click', (e) => {
    if (e.target.closest('.edit-icon') || e.target.closest('.edit-form') || e.target.closest('button') || e.target.closest('.footer-recovered')) return;
    const width = window.innerWidth;
    const clickX = e.clientX;
    const threshold = width * 0.3;
    if (clickX < threshold) prevSlide();
    else if (clickX > width - threshold) nextSlide();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') nextSlide();
    if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') prevSlide();
});

init();

// -------- BACKGROUND: golden particles --------
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.2 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.15;
        this.twinkle = Math.random() * 0.025 + 0.005;
        this.direction = 1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += this.twinkle * this.direction;
        if (this.opacity > 0.8 || this.opacity < 0.1) this.direction *= -1;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }
    draw() {
        ctx.shadowBlur = this.size > 1.8 ? 12 : 0;
        ctx.shadowColor = 'rgba(255, 215, 0, 0.7)';
        ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(140, (width * height) / 7000);
    for (let i = 0; i < count; i++) particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    const grad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
    grad.addColorStop(0, '#0b0b0b');
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

resizeCanvas();
initParticles();
animate();