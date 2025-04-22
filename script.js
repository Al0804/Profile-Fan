// DOM Elements
const header = document.getElementById('header');
const sections = document.querySelectorAll('section');
const footer = document.querySelector('footer');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.querySelector('.theme-toggle');
const body = document.querySelector('body');
const typingElement = document.querySelector('.typing');
const aboutTypingElement = document.querySelector('.typing-text');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const slider = document.querySelector('.slider');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const playButtons = document.querySelectorAll('.play-btn');
const pauseButtons = document.querySelectorAll('.pause-btn');
const musicPlayers = document.querySelectorAll('.music-player');
// Variables
let lastScrollTop = 0;
let currentSlide = 0;
const totalSlides = document.querySelectorAll('.kinnie-card').length;
let interval;
let typingText = "FAN";
let aboutText = "I'm INFP FiNe IF(N) EII-2Fi-H SO/SP459 ELVF³³⁴¹ /R/[L]oaI A[O]Tw/D/Rg melancholic-phelgmatic mel - sup - meph BVPN Cabin 4 Pisces";
let currentCharIndex = 0;
let aboutCurrentCharIndex = 0;
let playingIndex = -1;
let audioInterval;

// Typing Animation Function
function typeText() {
    if (currentCharIndex < typingText.length) {
        typingElement.textContent += typingText.charAt(currentCharIndex);
        currentCharIndex++;
        setTimeout(typeText, 200);
    } else {
        setTimeout(eraseText, 2000);
    }
}

// Erase Animation Function
function eraseText() {
    if (typingElement.textContent.length > 0) {
        typingElement.textContent = typingElement.textContent.slice(0, -1);
        setTimeout(eraseText, 100);
    } else {
        currentCharIndex = 0;
        setTimeout(typeText, 500);
    }
}

// About Typing Animation Function
function typeAboutText() {
    if (aboutCurrentCharIndex < aboutText.length) {
        aboutTypingElement.textContent += aboutText.charAt(aboutCurrentCharIndex);
        aboutCurrentCharIndex++;
        setTimeout(typeAboutText, 50);
    } else {
        setTimeout(eraseAboutText, 2000);
    }
}

function eraseAboutText() {
    if (aboutTypingElement.textContent.length > 0) {
        aboutTypingElement.textContent = aboutTypingElement.textContent.slice(0, -1);
        setTimeout(eraseAboutText, 25);
    } else {
        aboutCurrentCharIndex = 0;
        setTimeout(typeAboutText, 500);
    }
}


// Initialize Typing Animations
typeText();
setTimeout(typeAboutText, 1000);

// Scroll Effects
window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Header hide/show effect
    if (scrollTop > lastScrollTop && scrollTop > 50) {
        header.classList.add('hide');
    } else {
        header.classList.remove('hide');
    }
    lastScrollTop = scrollTop;

    // Section fade in effect
    sections.forEach(section => {
        let sectionTop = section.offsetTop;
        let sectionHeight = section.clientHeight;
        
        if (scrollTop >= (sectionTop - sectionHeight / 3)) {
            section.classList.add('active');
        }
    });

    // Footer fade in effect
    if (scrollTop + window.innerHeight >= document.body.offsetHeight - 100) {
        footer.classList.add('active');
    }
});

// Hamburger Menu Toggle
hamburger.addEventListener('click', function() {
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Transform hamburger to X
    const spans = this.querySelectorAll('span');
    if (this.classList.contains('active')) {
        spans[0].style.transform = 'translateY(8px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Theme Toggle
themeToggle.addEventListener('click', function() {
    body.classList.toggle('dark-mode');
    
    // Toggle icon
    const icon = this.querySelector('i');
    if (body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// Tab Functionality
tabButtons.forEach(button => {
    button.addEventListener('click', function() {
        const tabId = this.dataset.tab;
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        this.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Slider Functionality
function changeSlide(direction) {
    if (direction === 'next') {
        currentSlide = (currentSlide + 1) % totalSlides;
    } else {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    }
    
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}

prevBtn.addEventListener('click', () => changeSlide('prev'));
nextBtn.addEventListener('click', () => changeSlide('next'));

// Music Player Functionality
playButtons.forEach((button, index) => {
    button.addEventListener('click', function () {
        // Stop currently playing music (jika bukan yang sekarang)
        if (playingIndex !== -1 && playingIndex !== index) {
            resetPlayer(playingIndex);
        }

        playingIndex = index;
        const player = musicPlayers[index];
        const durationDisplay = player.querySelector('.music-duration');
        const audio = player.querySelector('audio');
        const totalDuration = parseInt(player.dataset.duration);
        const minutes = Math.floor(totalDuration / 60);
        const seconds = totalDuration % 60;

        // Hide play button, show pause button
        this.style.display = 'none';
        pauseButtons[index].style.display = 'flex';

        // Play audio (lanjut dari waktu terakhir)
        audio.play();

        // Start timer
        audioInterval = setInterval(() => {
            const currentSecond = Math.floor(audio.currentTime);
            const currentMinutes = Math.floor(currentSecond / 60);
            const currentSeconds = currentSecond % 60;

            durationDisplay.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' + currentSeconds : currentSeconds} / ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

            if (audio.ended) {
                clearInterval(audioInterval);
                resetPlayer(index);
            }
        }, 1000);
    });
});

pauseButtons.forEach((button, index) => {
    button.addEventListener('click', function () {
        const player = musicPlayers[index];
        const audio = player.querySelector('audio');

        // Pause audio only (tidak reset waktu)
        audio.pause();
        clearInterval(audioInterval);

        // Show play button, hide pause button
        this.style.display = 'none';
        playButtons[index].style.display = 'flex';

        playingIndex = -1;
    });
});


function resetPlayer(index) {
    clearInterval(audioInterval);

    const player = musicPlayers[index];
    const audio = player.querySelector('audio');
    const durationDisplay = player.querySelector('.music-duration');
    const totalDuration = parseInt(player.dataset.duration);
    const minutes = Math.floor(totalDuration / 60);
    const seconds = totalDuration % 60;

    audio.pause();
    audio.currentTime = 0;

    durationDisplay.textContent = `0:00 / ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    pauseButtons[index].style.display = 'none';
    playButtons[index].style.display = 'flex';
}


// Smooth Scrolling for Navigation Links
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            hamburger.click();
        }
    });
});

// Initialize sections visibility
window.addEventListener('load', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    sections.forEach(section => {
        let sectionTop = section.offsetTop;
        let sectionHeight = section.clientHeight;
        
        if (scrollTop >= (sectionTop - sectionHeight / 3)) {
            section.classList.add('active');
        }
    });
    
    if (scrollTop + window.innerHeight >= document.body.offsetHeight - 100) {
        footer.classList.add('active');
    }
});