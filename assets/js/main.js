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

async function showButtonNextDuel(resultMatch) {
    state.actions.button.style.display = "block";
    state.actions.button.classList.remove("hidden");
    state.actions.button.innerText = resultMatch.toUpperCase();
}

async function checkMatch(cardId, pcCardId) {
    let resultMatch = "draw";
    const playerCard = cardData[cardId];
    const computerCard = cardData[pcCardId];

    if (playerCard.WinOf.includes(computerCard)) {
        state.score.playerScore++;
        resultMatch = "win";
    } else if (playerCard.LoseOf.includes(computerCard)) {
        state.score.computerScore++;
        resultMatch = "lose";
    } else {
        state.score.playerScore++;
        state.score.computerScore++;
    }
    await updateScore();
    await showButtonNextDuel(resultMatch);
}

async function setCardSelected(cardId) {
    await removeAllCards();
    const pcCardId = await getRandomCardId();

    state.fieldCards.computerCard.setAttribute("src", cardData[pcCardId].img);
    state.fieldCards.computerCard.setAttribute("alt", "Carta computador aberta");
    state.fieldCards.playerCard.setAttribute("src", cardData[cardId].img);
    state.fieldCards.playerCard.setAttribute("alt", "Carta jogador aberta");

    await checkMatch(cardId, pcCardId);
}

async function createCardImage(cardId, player) {
    const elementImage = document.getElementById("eye-card");
    const cardImg = document.createElement("img");
    cardImg.dataset.id = cardId; // Store the card ID in a data attribute
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
            state.cardSprites.avatar.setAttribute("src", `${pathImages}card-back.png`);
            state.cardSprites.name.innerHTML = "";
            state.cardSprites.type.innerHTML = "";
            document.getElementById("card-status").appendChild(elementImage);
        });
    }
    return cardImg;
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
        container.appendChild(cardImg); // Adiciona a carta ao contêiner correto
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
    // playAudio();
    playVideo();
}

function init() {

    drawCards(5, state.playerSides.computer).then(r => {
    });
    drawCards(5, state.playerSides.player).then(r => {
    });
    initMedia();
    console.log(getRandomCardId());
}

init();