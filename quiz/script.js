const angryCat = document.getElementById('angry-cat');

const angryGifs = [
    "https://i.pinimg.com/originals/fc/0c/98/fc0c981fe4a4a8796badd15b423414cb.gif",
    "https://media.tenor.com/6u1cocwwEd4AAAAj/ragey-cat.gif",
    "https://media1.tenor.com/m/sblBUsSvPRoAAAAd/cat-meme-cat-meme-angry.gif",
    "https://media.tenor.com/Jz0hI2sWIBIAAAAj/cat-crying-cat-crying-meme.gif"
];

let catTimeout;
const allNoBtns = document.querySelectorAll('.btn-no');

function triggerChaos(btn) {
    const allModes = [
        'mode-shake', 'mode-spin', 'mode-ghost', 'mode-micro',
        'mode-zoom', 'mode-glitch', 'mode-rainbow', 'mode-blob',
        'mode-pixel', 'mode-frozen', 'mode-reverse', 'mode-stretch', 'mode-stone'
    ];

    btn.classList.remove(...allModes);

    btn.style.opacity = '1';
    btn.style.background = '';
    btn.style.color = '';
    btn.style.boxShadow = '';
    btn.style.transform = '';
    btn.style.borderRadius = '';

    const moveType = Math.floor(Math.random() * 16);

    switch (moveType) {
        case 0:
            btn.innerText = "GRRRR!";
            btn.classList.add('mode-shake');
            break;
        case 1:
            btn.innerText = "Sparisco!";
            btn.classList.add('mode-ghost');
            break;
        case 2:
            btn.innerText = "WIIII!";
            btn.classList.add('mode-spin');
            break;
        case 3:
            btn.innerText = "prendimi";
            btn.classList.add('mode-micro');
            break;
        case 4:
            btn.style.background = "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)";
            btn.style.color = "#1a5c38";
            btn.style.boxShadow = "0 8px 20px rgba(56, 249, 215, 0.4)";
            btn.innerText = "SI :3";
            setTimeout(() => {
                if (btn.innerText === "SI :3") {
                    btn.style.background = "";
                    btn.style.color = "";
                    btn.style.boxShadow = "";
                    btn.innerText = "SCHERZAVO";
                }
            }, 400);
            break;
        case 5:
            btn.innerText = "E̴R̴R̴O̴R̴E̴";
            btn.classList.add('mode-glitch');
            break;
        case 6:
            btn.innerText = "NOOOOO!";
            btn.classList.add('mode-zoom');
            break;
        case 7:
            btn.innerText = "DOVE SONO?";
            btn.style.opacity = '0.2';
            break;
        case 8:
            btn.innerText = "PARTY!!";
            btn.classList.add('mode-rainbow');
            break;
        case 9:
            btn.innerText = "blup";
            btn.classList.add('mode-blob');
            break;
        case 10:
            btn.innerText = "NO-BLOCK";
            btn.classList.add('mode-pixel');
            break;
        case 11:
            btn.innerText = "BRRRR";
            btn.classList.add('mode-frozen');
            break;
        case 12:
            btn.innerText = "NO :3";
            btn.classList.add('mode-reverse');
            break;
        case 13:
            btn.innerText = "LUNGOOO";
            btn.classList.add('mode-stretch');
            break;
        case 14:
            btn.innerText = "PESANTE";
            btn.classList.add('mode-stone');
            break;
        case 15:
            btn.innerText = "🤡";
            btn.style.fontSize = "2rem";
            break;
        default:
            btn.innerText = "No";
            break;
    }
}

function moveButton(btn, e) {
    triggerChaos(btn);

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
        angryCat.style.left = (clientX - 50) + 'px';
        angryCat.style.top = (clientY - 80) + 'px';
        angryCat.classList.remove('cat-show');
        void angryCat.offsetWidth;
        angryCat.classList.add('cat-show');
        if (catTimeout) clearTimeout(catTimeout);
        catTimeout = setTimeout(() => {
            angryCat.classList.remove('cat-show');
        }, 1500);
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const btnRect = btn.getBoundingClientRect();

    const spreadX = Math.min(viewportWidth * 0.3, 150);
    const spreadY = Math.min(viewportHeight * 0.3, 150);

    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;

    const randomOffsetX = (Math.random() - 0.5) * 2 * spreadX;
    const randomOffsetY = (Math.random() - 0.5) * 2 * spreadY;

    const finalX = centerX + randomOffsetX - (btnRect.width / 2);
    const finalY = centerY + randomOffsetY - (btnRect.height / 2);

    btn.style.position = 'fixed';
    btn.style.left = `${finalX}px`;
    btn.style.top = `${finalY}px`;
    btn.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
}

allNoBtns.forEach(btn => {
    btn.addEventListener('mouseover', e => moveButton(btn, e));
    btn.addEventListener('touchstart', e => {
        e.preventDefault();
        moveButton(btn, e);
    });
    btn.addEventListener('click', e => {
        e.preventDefault();
        moveButton(btn, e);
    });
});

function nextStep(currentId, nextId) {
    const currentCard = document.getElementById(currentId);
    const nextCard = document.getElementById(nextId);

    currentCard.classList.remove('active-card');
    nextCard.classList.add('active-card');

    const nextNoBtn = nextCard.querySelector('.btn-no');
    if (nextNoBtn) {
        nextNoBtn.style.position = 'relative';
        nextNoBtn.style.left = 'auto';
        nextNoBtn.style.top = 'auto';
        nextNoBtn.style.transform = 'none';
        nextNoBtn.style.opacity = '1';
        nextNoBtn.classList.remove('mode-shake', 'mode-spin', 'mode-ghost', 'mode-micro');
        nextNoBtn.innerText = "No";
    }
}

function finishQuiz(lastId) {
    const lastCard = document.getElementById(lastId);
    const successCard = document.getElementById('card-success');

    lastCard.classList.remove('active-card');
    successCard.classList.add('active-card');

    confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
    setInterval(() => {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }, 3000);
}
