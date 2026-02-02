const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const questionCard = document.getElementById('card-question');
const successCard = document.getElementById('card-success');
const angryCat = document.getElementById('angry-cat');

const angryGifs = [
    "https://i.pinimg.com/originals/fc/0c/98/fc0c981fe4a4a8796badd15b423414cb.gif",
    "https://media.tenor.com/6u1cocwwEd4AAAAj/ragey-cat.gif",
    "https://media1.tenor.com/m/sblBUsSvPRoAAAAd/cat-meme-cat-meme-angry.gif",
    "https://media.tenor.com/Jz0hI2sWIBIAAAAj/cat-crying-cat-crying-meme.gif",
    "https://media1.tenor.com/m/qlxw-7nvH_QAAAAd/mad-cat.gif",
    "https://i.pinimg.com/originals/fc/0c/98/fc0c981fe4a4a8796badd15b423414cb.gif"
];

const happyGifs = [
    "https://media1.tenor.com/m/_sTH2Ou_9iIAAAAd/cat-meme-hehehe.gif",
    "https://media.tenor.com/lOG0hy6GUgEAAAAj/cat.gif",
    "https://media.tenor.com/NUxKSQ-pzVoAAAAj/interesting.gif"
];

const messages = [
    "CHEEEE??",
    "SASA????",
    "ma come?",
    "EHI",
    "GRRRRRR",
    "ti sta scivolando il dito?",
    "sasa",
    "mi offendo",
    "i'm angy",
    "ti darò bacini",
    "neanche per i bacini???",
    "un panino e coccole?",
    "guarda com'è bello l'altro",
    "quello accanto",
    "quello verde",
    "ho detto quello verde",
    "questo è rosso",
    "ora divento verde",
    "ti sto avvisando",
    "ok :3"
];

let messageIndex = 0;
let currentFontSize = 1.2;
let catTimeout;
let isGreen = false;

function handleSuccess() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });

    const randomHappyIndex = Math.floor(Math.random() * happyGifs.length);
    const successImg = successCard.querySelector('.gif-container img');
    successImg.src = happyGifs[randomHappyIndex];

    questionCard.style.display = 'none';
    successCard.classList.remove('hidden');

    if (noBtn) noBtn.remove();

    angryCat.classList.remove('cat-show');
    if (catTimeout) clearTimeout(catTimeout);
}

function moveButton(e) {
    if (isGreen) {
        handleSuccess();
        return;
    }

    if (messageIndex === messages.length - 1) {
        isGreen = true;
        noBtn.innerText = "si :3";
        noBtn.style.background = "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)";
        noBtn.style.color = "#1a5c38";
        noBtn.style.boxShadow = "0 8px 20px rgba(56, 249, 215, 0.4)";
        noBtn.style.transform = "scale(1.2) rotate(0deg)";
        noBtn.removeEventListener('mouseover', moveButton);
        noBtn.style.transition = "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        return;
    }

    let clientX, clientY;
    if (e && e.type === 'touchstart') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else if (e) {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    if (clientX !== undefined && clientY !== undefined) {
        const randomAngryIndex = Math.floor(Math.random() * angryGifs.length);
        angryCat.src = angryGifs[randomAngryIndex];

        angryCat.style.left = (clientX - 40) + 'px';
        angryCat.style.top = (clientY - 50) + 'px';

        angryCat.classList.remove('cat-show');
        void angryCat.offsetWidth;
        angryCat.classList.add('cat-show');

        if (catTimeout) clearTimeout(catTimeout);
        catTimeout = setTimeout(() => {
            angryCat.classList.remove('cat-show');
        }, 1500);
    }

    messageIndex++;
    if (messageIndex < messages.length) {
        noBtn.innerText = messages[messageIndex];
    }

    currentFontSize += 0.2;
    yesBtn.style.fontSize = `${currentFontSize}rem`;
    const currentPadding = 12 + (messageIndex * 3);
    yesBtn.style.padding = `${currentPadding}px ${currentPadding * 2}px`;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const btnRect = noBtn.getBoundingClientRect();
    const btnWidth = btnRect.width;
    const btnHeight = btnRect.height;
    const safeMargin = 30;

    if (window.getComputedStyle(noBtn).position !== 'fixed') {
        noBtn.style.position = 'fixed';
    }

    const maxLeft = viewportWidth - btnWidth - safeMargin;
    const maxTop = viewportHeight - btnHeight - safeMargin;

    const randomX = safeMargin + Math.random() * (maxLeft - safeMargin);
    const randomY = safeMargin + Math.random() * (maxTop - safeMargin);

    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    noBtn.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
}

noBtn.addEventListener('mouseover', (e) => {
    if (!isGreen) moveButton(e);
});

noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveButton(e);
});

noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveButton(e);
});

yesBtn.addEventListener('click', handleSuccess);
