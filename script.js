// --- 1. DEKORASI MELAYANG NUANSA BIRU MUDA ---
const floatingBg = document.getElementById('floatingBg');
const decoItems = ['🩵', '🦋', '☁️', '❄️', '✨', '🫐', '💙'];

function spawnDecoration() {
    const el = document.createElement('div');
    el.className = 'float-item';
    el.innerText = decoItems[Math.floor(Math.random() * decoItems.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (Math.random() * 14 + 14) + 'px';
    el.style.animationDuration = (Math.random() * 5 + 6) + 's';
    floatingBg.appendChild(el);
    setTimeout(() => el.remove(), 11000);
}
setInterval(spawnDecoration, 550);

// --- 2. SISTEM AUDIO (MP3 Latar + Efek Suara Tombol Web Audio API) ---
const bgMusic = document.getElementById('bgMusic');
const musicWidget = document.getElementById('musicWidget');
const vinylDisc = document.getElementById('vinylDisc');
const musicStatus = document.getElementById('musicStatus');

let sfxCtx = null;
let isMusicPlaying = false;

function initSfxAudio() {
    if (!sfxCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        sfxCtx = new AudioContext();
    }
    if (sfxCtx.state === 'suspended') {
        sfxCtx.resume();
    }
}

// Efek suara Pop saat klik tombol biasa / checkbox
function playPop() {
    initSfxAudio();
    const osc = sfxCtx.createOscillator();
    const gain = sfxCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, sfxCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, sfxCtx.currentTime + 0.09);
    gain.gain.setValueAtTime(0.18, sfxCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, sfxCtx.currentTime + 0.09);
    osc.connect(gain);
    gain.connect(sfxCtx.destination);
    osc.start();
    osc.stop(sfxCtx.currentTime + 0.09);
}

// Efek suara Boing lucu saat tombol "Gak Mau" diklik
function playBoing() {
    initSfxAudio();
    const osc = sfxCtx.createOscillator();
    const gain = sfxCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, sfxCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(580, sfxCtx.currentTime + 0.14);
    osc.frequency.exponentialRampToValueAtTime(190, sfxCtx.currentTime + 0.28);
    gain.gain.setValueAtTime(0.22, sfxCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, sfxCtx.currentTime + 0.28);
    osc.connect(gain);
    gain.connect(sfxCtx.destination);
    osc.start();
    osc.stop(sfxCtx.currentTime + 0.28);
}

// Efek suara Fanfare romantis saat diterima
function playFanfare() {
    initSfxAudio();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
        const osc = sfxCtx.createOscillator();
        const gain = sfxCtx.createGain();
        osc.type = 'triangle';
        const startTime = sfxCtx.currentTime + idx * 0.11;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);
        osc.connect(gain);
        gain.connect(sfxCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.45);
    });
}

// Kontrol Play/Pause Musik Latar MP3
function toggleMusic() {
    playPop();
    if (!bgMusic) return;

    if (bgMusic.paused) {
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            vinylDisc.classList.add('spinning');
            musicStatus.innerText = 'Musik: ON 🎶';
        }).catch(() => {
            showToast('Pastikan file music/lagu-kamu.mp3 sudah ada ya! 🎵');
        });
    } else {
        bgMusic.pause();
        isMusicPlaying = false;
        vinylDisc.classList.remove('spinning');
        musicStatus.innerText = 'Musik: Pause ⏸️';
    }
}

musicWidget.addEventListener('click', toggleMusic);

// --- 3. NAVIGASI & INTERAKSI ---
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2600);
}

function startJourney() {
    initSfxAudio();
    playPop();

    // Auto-play musik saat surat dibuka
    if (bgMusic) {
        bgMusic.volume = 0.65;
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            vinylDisc.classList.add('spinning');
            musicStatus.innerText = 'Musik: ON 🎶';
        }).catch(() => {
            musicStatus.innerText = 'Musik: Off 🎵';
        });
    }

    document.getElementById('step1').classList.add('hidden');
    document.getElementById('step2').classList.remove('hidden');
}

let tengilLevel = 100;
function preventUncheck(checkbox, message) {
    if (!checkbox.checked) {
        checkbox.checked = true;
        playBoing();
        tengilLevel += 25;
        document.getElementById('meterValue').innerText = tengilLevel + '% (OVERLOAD!)';
        showToast(message);
    }
}

function goToStep3() {
    playPop();
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step3').classList.remove('hidden');
}

// --- 4. LOGIKA TOMBOL "GAK MAU" 5 TAHAP UNTUK SI TENGIL ---
let noStage = 0;
let yesScale = 1;

const noStages = [
    {
        btnText: "Yakin nih? 🥺",
        title: "Eits, Salah Pencet Ya? 🤨",
        text: "Masa tuan putri tengil nolak orang sebaik dan sesabar aku? Coba pencet tombol yang biru aja deh! 🩵"
    },
    {
        btnText: "Gak mempan wlee 😜",
        title: "Heh Tengil, Jangan Nolak! 😤",
        text: "Tombol 'Gak Mau' lagi dalam masa perbaikan khusus buat kamu. Udah takdirnya klik 'Mau Banget!' tau! ✨"
    },
    {
        btnText: "Makin gede kan tombolnya 👀",
        title: "Tuh Lihat Tombol Biru-nya! 🦋",
        text: "Makin kamu klik nolak, tombol 'Mau Banget!' makin membesar sampe nutupin layar nih!"
    },
    {
        btnText: "Ampun deh nyerah 🏳️",
        title: "Kucing Aja Ikut Ngambek Nih! 😾",
        text: "Satu kali lagi kamu pencet tombol ini, sistem bakal otomatis ngubah pilihanmu jadi 'Mau Banget!' titik!",
        catMode: true
    }
];

function handleNoClick() {
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    const title = document.getElementById('proposalTitle');
    const text = document.getElementById('proposalText');
    const mascot = document.getElementById('reactionMascot');

    if (noStage < noStages.length) {
        playBoing();
        const current = noStages[noStage];
        noBtn.innerText = current.btnText;
        title.innerText = current.title;
        text.innerHTML = current.text;

        yesScale += 0.16;
        yesBtn.style.transform = `scale(${yesScale})`;

        if (current.catMode) {
            mascot.innerHTML = `
                <svg viewBox="0 0 200 170" class="kawaii-svg bounce">
                    <polygon points="45,75 60,25 90,60" fill="#fff" stroke="#7cc6fe" stroke-width="4"/>
                    <polygon points="155,75 140,25 110,60" fill="#fff" stroke="#7cc6fe" stroke-width="4"/>
                    <ellipse cx="100" cy="105" rx="64" ry="50" fill="#fff" stroke="#7cc6fe" stroke-width="4"/>
                    <line x1="65" y1="88" x2="88" y2="96" stroke="#2c4966" stroke-width="4" stroke-linecap="round"/>
                    <line x1="135" y1="88" x2="112" y2="96" stroke="#2c4966" stroke-width="4" stroke-linecap="round"/>
                    <circle cx="77" cy="103" r="6" fill="#2c4966"/>
                    <circle cx="123" cy="103" r="6" fill="#2c4966"/>
                    <circle cx="60" cy="114" r="9" fill="#90ccf4" opacity="0.75"/>
                    <circle cx="140" cy="114" r="9" fill="#90ccf4" opacity="0.75"/>
                    <path d="M90 122 Q100 112 110 122" fill="none" stroke="#2c4966" stroke-width="3" stroke-linecap="round"/>
                </svg>
            `;
        }
        noStage++;
    } else {
        // Tahap 5: Tombol Gak Mau pasrah berubah jadi Mau Juga!
        playPop();
        noBtn.innerText = "Iya Deh Mau! 🩵";
        noBtn.classList.remove('btn-no');
        noBtn.classList.add('btn-yes');
        noBtn.onclick = acceptProposal;
        showToast("Nah gitu dong, pasrah aja jadi pacarku! 🥰");
    }
}

function acceptProposal() {
    playFanfare();
    document.getElementById('step3').classList.add('hidden');
    document.getElementById('step4').classList.remove('hidden');

    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('officialDate').innerText =
        "Ditetapkan pada: " + today.toLocaleDateString('id-ID', options);

    for (let i = 0; i < 65; i++) {
        setTimeout(() => {
            const conf = document.createElement('div');
            conf.className = 'confetti';
            conf.innerText = decoItems[Math.floor(Math.random() * decoItems.length)];
            conf.style.left = Math.random() * 100 + 'vw';
            conf.style.animationDuration = (Math.random() * 2 + 2) + 's';
            document.body.appendChild(conf);
            setTimeout(() => conf.remove(), 4000);
        }, i * 35);
    }
}