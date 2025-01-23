// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    themeToggle.innerHTML = isDark 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
    localStorage.setItem('darkMode', JSON.stringify(isDark));
}

// Initialize theme
const storedTheme = localStorage.getItem('darkMode');
setTheme(storedTheme !== null ? JSON.parse(storedTheme) : prefersDark.matches);

themeToggle.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('dark-mode'));
});

// Scroll Animations
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '50px'
});

document.querySelectorAll('[data-animate]').forEach(element => {
    observer.observe(element);
});

// Performance Optimizations
document.fonts.ready.then(() => {
    document.documentElement.classList.add('fonts-loaded');
});

window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
});

// Image Modal Functionality
const projectImages = document.querySelectorAll('.project-image');
const imageModal = document.createElement('div');
const modalImage = document.createElement('img');

imageModal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    cursor: zoom-out;
`;

modalImage.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    border-radius: 1rem;
    box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
`;

imageModal.appendChild(modalImage);
document.body.appendChild(imageModal);

projectImages.forEach(img => {
    // Create a color-filled container for small images
    const container = img.closest('.image-container');
    if (img.naturalWidth < 300 || img.naturalHeight < 200) {
        const dominantColor = getDominantColor(img);
        container.style.background = dominantColor;
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
    }

    img.addEventListener('click', () => {
        modalImage.src = img.src;
        imageModal.style.display = 'flex';
    });
});

imageModal.addEventListener('click', () => {
    imageModal.style.display = 'none';
});

// Dominant Color Extraction Function
function getDominantColor(img) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = img.width;
    canvas.height = img.height;
    
    context.drawImage(img, 0, 0, img.width, img.height);
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let r = 0, g = 0, b = 0;
    
    for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
    }
    
    r = Math.floor(r / (data.length / 4));
    g = Math.floor(g / (data.length / 4));
    b = Math.floor(b / (data.length / 4));
    
    return `rgb(${r}, ${g}, ${b})`;
}