const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        player: document.getElementById("player-score"),
        computer: document.getElementById("computer-score"),
    },
    cardSprites: {
        avatar: document.getElementById("back-card"),
        image: document.getElementById("eye-card"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        playerCard: document.getElementById("player-card-drawn"),
        computerCard: document.getElementById("computer-card-drawn"),
    },
    playerSides: {
        player: "player-cards-container",
        playerCards: document.querySelector(".player-cards"),
        computer: "pc-cards-container",
        computerCards: document.querySelector(".pc-cards"),
    },
    actions: {
        button: document.getElementById("next-duel"),
        buttonShow: document.getElementById("game-buttons"),
    },
    media: {
        audioBack: null,
        video: null,
    },
};

const pathImages = "./assets/img/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissor",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1]
    },
];

async function getRandomCardId() {
    return Math.floor(Math.random() * cardData.length);
}

async function removeAllCards() {
    state.playerSides
        .computerCards
        .querySelectorAll("img").forEach(img => img.remove());
    state.playerSides
        .playerCards
        .querySelectorAll("img").forEach(img => img.remove());

}

async function updateScore() {
    state.score.player.textContent = state.score.playerScore;
    state.score.computer.textContent = state.score.computerScore;
}

async function resetGame() {
    state.actions.buttonShow.classList.add("hide-btn-duel");

    state.fieldCards.computerCard.setAttribute("src", `${pathImages}card-back.png`);
    state.fieldCards.computerCard.classList.add("hidden");
    state.fieldCards.computerCard.setAttribute("alt", "Carta computador fechada");
    state.fieldCards.playerCard.setAttribute("src", `${pathImages}card-back.png`);
    state.fieldCards.playerCard.classList.add("hidden");
    state.fieldCards.playerCard.setAttribute("alt", "Carta jogador fechada");

    await removeAllCards();
    await setUpCardSprites();
    init();
}

async function showButtonNextDuel(resultMatch) {
    state.actions.buttonShow.classList.remove("show-btn-duel");
    state.actions.button.innerText = resultMatch.toUpperCase();
    state.actions.button.addEventListener("click", async () => {
        await resetGame();
        state.actions.button.innerText = "";
    });
}

async function checkMatch(cardId, pcCardId) {
    let resultMatch = null;

    if (cardData[cardId].WinOf.includes(cardData[pcCardId].id)) {
        state.score.playerScore++;
        resultMatch = "win";
    }

    if (cardData[cardId].LoseOf.includes(cardData[pcCardId].id)) {
        state.score.computerScore++;
        resultMatch = "lose";
    }
    if (cardId === pcCardId) {
        state.score.playerScore++;
        state.score.computerScore++;
        resultMatch = "draw";
    }
    await updateScore();
    await showButtonNextDuel(resultMatch);
}

async function setCardSelected(cardId) {
    await removeAllCards();
    const pcCardId = await getRandomCardId();
    state.fieldCards.computerCard.classList.remove("hidden");
    state.fieldCards.playerCard.classList.remove("hidden");
    state.actions.buttonShow.classList.remove("hide-btn-duel");

    state.fieldCards.computerCard.setAttribute("src", cardData[pcCardId].img);
    state.fieldCards.computerCard.setAttribute("alt", "Carta computador aberta");
    state.fieldCards.playerCard.setAttribute("src", cardData[cardId].img);
    state.fieldCards.playerCard.setAttribute("alt", "Carta jogador aberta");

    await checkMatch(cardId, pcCardId);
}

async function createCardImage(cardId, player) {
    const cardImg = document.createElement("img");
    cardImg.dataset.id = cardId;
    cardImg.classList.add("card");

    if (player === state.playerSides.player) {
        cardImg.addEventListener("click", () => {
            setCardSelected(cardId);
        });
        cardImg.addEventListener("mouseover", () => {
            drawSelectedCard(cardId);
            state.cardSprites.image.remove();
        });
        cardImg.addEventListener("mouseout", () => {
            setUpCardSprites();
        });
    }
    return cardImg;
}

function setUpCardSprites() {
    state.cardSprites.avatar.setAttribute("src", `${pathImages}card-back.png`);
    state.cardSprites.name.innerHTML = "";
    state.cardSprites.type.innerHTML = "";
    document.getElementById("card-status").appendChild(state.cardSprites.image);
}

async function drawSelectedCard(cardId) {
    state.cardSprites.avatar.setAttribute("src", cardData[cardId].img);
    state.cardSprites.avatar.setAttribute("background-image", "/assets/img/icons/card-front.png");
    state.cardSprites.avatar.setAttribute("alt", "Carta jogador frente ou verso");
    state.cardSprites.avatar.classList.add("back-card");
    state.cardSprites.name.innerHTML = cardData[cardId].name;
    state.cardSprites.type.innerHTML = "Attribute : " +
        cardData[cardId].type;
}

async function drawCards(numCards, player) {
    const container = document.getElementById(player);
    if (!container) {
        console.error(`Container para ${player} não encontrado.`);
        return;
    }
    for (let i = 0; i < numCards; i++) {
        const cardId = await getRandomCardId();
        const cardImg = await createCardImage(cardId, player);
        container.appendChild(cardImg);
    }
}

function createMediaElements() {
    const audioContainer = document.querySelector(".container-audio-content");
    const audio = document.createElement("audio");
    audio.className = "audio";
    const audioSource = document.createElement("source");
    audioSource.src = "./assets/audios/egyptian_duel.mp3"; // assets/audios/egyptian_duel.mp3
    audioSource.type = "audio/mp3";
    audio.appendChild(audioSource);
    audioContainer.appendChild(audio);
    state.media.audioBack = audio;

    const videoContainer = document.querySelector(".container-video-content");
    const video = document.createElement("video");
    video.className = "video";
    const videoSource = document.createElement("source");
    videoSource.src = "./assets/videos/yugi.mp4"; // assets/videos/yugi.mp4
    videoSource.type = "video/mp4";
    video.appendChild(videoSource);
    videoContainer.appendChild(video);
    state.media.video = video;
}

function playAudio() {
    state.media.audioBack.volume = 0.2;
    state.media.audioBack.play().catch(() => {
    });
}

function playVideo() {
    state.media.video.loop = true;
    state.media.video.play().catch(() => {
    });
}

function initMedia() {
    createMediaElements();
    playAudio();
    playVideo();
}

function init() {
    state.actions.buttonShow.classList.add("hide-btn-duel");
    drawCards(5, state.playerSides.computer).then(r => {
    });
    drawCards(5, state.playerSides.player).then(r => {
    });
    initMedia();
}

init();