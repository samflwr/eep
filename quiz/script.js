const angryCat = document.getElementById('angry-cat');

// Liste di GIF (puoi lasciarle uguali)
const angryGifs = [
    "https://i.pinimg.com/originals/fc/0c/98/fc0c981fe4a4a8796badd15b423414cb.gif",
    "https://media.tenor.com/6u1cocwwEd4AAAAj/ragey-cat.gif",
    "https://media1.tenor.com/m/sblBUsSvPRoAAAAd/cat-meme-cat-meme-angry.gif",
    "https://media.tenor.com/Jz0hI2sWIBIAAAAj/cat-crying-cat-crying-meme.gif"
];



let catTimeout;
const allNoBtns = document.querySelectorAll('.btn-no');

// --- LA FUNZIONE DEL CAOS ---
// --- LA FUNZIONE DEL CAOS (AGGIORNATA) ---
// --- LA FUNZIONE DEL CAOS (VERSIONE ESTESA) ---
function triggerChaos(btn) {
    // 1. LISTA DI TUTTE LE CLASSI POSSIBILI
    const allModes = [
        'mode-shake', 'mode-spin', 'mode-ghost', 'mode-micro', 
        'mode-zoom', 'mode-glitch', 'mode-rainbow', 'mode-blob', 
        'mode-pixel', 'mode-frozen', 'mode-reverse', 'mode-stretch', 'mode-stone'
    ];

    // 2. RESET TOTALE: Rimuove tutte le classi CSS speciali
    btn.classList.remove(...allModes);

    // 3. RESET STILI INLINE (Pulisce modifiche manuali precedenti)
    btn.style.opacity = '1';
    btn.style.background = ''; 
    btn.style.color = '';
    btn.style.boxShadow = '';
    btn.style.transform = ''; // Importante reset
    btn.style.borderRadius = ''; 

    // 4. SCELTA RANDOM (0 a 15 -> 16 casi totali)
    const moveType = Math.floor(Math.random() * 16);

    switch(moveType) {
        case 0: // SHAKE RABBIA
            btn.innerText = "GRRRR!";
            btn.classList.add('mode-shake');
            break;

        case 1: // FANTASMA
            btn.innerText = "Sparisco!";
            btn.classList.add('mode-ghost');
            break;

        case 2: // SPIN
            btn.innerText = "WIIII!";
            btn.classList.add('mode-spin');
            break;

        case 3: // MICRO
            btn.innerText = "prendimi";
            btn.classList.add('mode-micro');
            break;

        case 4: // TROLL (Sembra il tasto SI)
            btn.style.background = "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)";
            btn.style.color = "#1a5c38";
            btn.style.boxShadow = "0 8px 20px rgba(56, 249, 215, 0.4)";
            btn.innerText = "SI :3"; 
            setTimeout(() => {
                if(btn.innerText === "SI :3") {
                    btn.style.background = ""; 
                    btn.style.color = "";
                    btn.style.boxShadow = "";
                    btn.innerText = "SCHERZAVO";
                }
            }, 400);
            break;

        case 5: // GLITCH
            btn.innerText = "E̴R̴R̴O̴R̴E̴"; 
            btn.classList.add('mode-glitch');
            break;

        case 6: // ZOOM
            btn.innerText = "NOOOOO!";
            btn.classList.add('mode-zoom');
            break;

        case 7: // OPACITY (Manuale)
            btn.innerText = "DOVE SONO?";
            btn.style.opacity = '0.2';
            break;

        case 8: // DISCO RAINBOW
            btn.innerText = "PARTY!!";
            btn.classList.add('mode-rainbow');
            break;

        case 9: // BLOB LIQUIDO
            btn.innerText = "blup";
            btn.classList.add('mode-blob');
            break;

        case 10: // MINECRAFT / PIXEL
            btn.innerText = "NO-BLOCK";
            btn.classList.add('mode-pixel');
            break;

        case 11: // FROZEN
            btn.innerText = "BRRRR";
            btn.classList.add('mode-frozen');
            break;

        case 12: // REVERSE (Sottosopra)
            btn.innerText = "NO :3";
            btn.classList.add('mode-reverse');
            break;

        case 13: // STRETCH (Allungato)
            btn.innerText = "LUNGOOO";
            btn.classList.add('mode-stretch');
            break;

        case 14: // STONE (Pesante)
            btn.innerText = "PESANTE";
            btn.classList.add('mode-stone');
            break;

        case 15: // EMOJI (Solo icona)
            btn.innerText = "🤡";
            btn.style.fontSize = "2rem";
            break;

        default: // DEFAULT: Messaggio casuale normale
            const randomMsgIndex = Math.floor(Math.random() * messages.length);
            btn.innerText = messages[randomMsgIndex];
            break;
    }
}


function moveButton(btn, e) {
    // Attiva una mossa speciale
    triggerChaos(btn);

    // --- LOGICA GATTO ARRABBIATO (UGUALE A PRIMA) ---
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
        catTimeout = setTimeout(() => { angryCat.classList.remove('cat-show'); }, 1500);
    }

// --- CALCOLO POSIZIONE (SPOSTAMENTO CENTRALE) ---
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const btnRect = btn.getBoundingClientRect();

    // Impostiamo un "raggio d'azione" dal centro (es. 150px)
    // Su mobile riduciamo un po' il raggio per non uscire dai bordi
    const spreadX = Math.min(viewportWidth * 0.3, 150); 
    const spreadY = Math.min(viewportHeight * 0.3, 150); 

    // Calcoliamo il centro dello schermo
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;

    // Generiamo un offset casuale (+ o - rispetto al centro)
    // (Math.random() - 0.5) * 2 genera un numero tra -1 e 1
    const randomOffsetX = (Math.random() - 0.5) * 2 * spreadX;
    const randomOffsetY = (Math.random() - 0.5) * 2 * spreadY;

    // Calcoliamo la posizione finale (sottraendo metà bottone per centrarlo bene)
    const finalX = centerX + randomOffsetX - (btnRect.width / 2);
    const finalY = centerY + randomOffsetY - (btnRect.height / 2);

    btn.style.position = 'fixed'; // Assicuriamoci che sia fixed
    btn.style.left = `${finalX}px`;
    btn.style.top = `${finalY}px`;
    
    // Rotazione casuale (ridotta leggermente per evitare che esca coi bordi)
    btn.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;}

allNoBtns.forEach(btn => {
    btn.addEventListener('mouseover', (e) => moveButton(btn, e));
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); moveButton(btn, e); });
    btn.addEventListener('click', (e) => { e.preventDefault(); moveButton(btn, e); });
});

function nextStep(currentId, nextId) {
    const currentCard = document.getElementById(currentId);
    const nextCard = document.getElementById(nextId);
    currentCard.classList.remove('active-card');
    nextCard.classList.add('active-card');
    
    // Reset bottone NO della nuova card
    const nextNoBtn = nextCard.querySelector('.btn-no');
    if(nextNoBtn) {
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
    setInterval(() => { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); }, 3000);
}