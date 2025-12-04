const API_KEY = "SUA_API_AQUI"; // coloque sua API aqui

const output = document.getElementById("output");
const input = document.getElementById("inputMessage");
const speakBtn = document.getElementById("speakBtn");
const sendBtn = document.getElementById("sendBtn");

// Enviar com Enter
input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }
});

// Microfone
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "pt-BR";

speakBtn.onclick = () => recognition.start();

recognition.onresult = event => {
    const text = event.results[0][0].transcript;
    input.value = text;
    sendMessage();
};

// Função principal — enviar e receber
async function sendMessage() {
    const userText = input.value.trim();
    if (userText === "") return;

    output.innerHTML += `<p><b>Você:</b> ${userText}</p>`;
    input.value = "";
    
    const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userText }] }]
            })
        }
    );

    const data = await response.json();

    try {
        const aiText = data.candidates[0].content.parts[0].text;
        output.innerHTML += `<p><b>Sexta-Feira:</b> ${aiText}</p>`;
        speak(aiText);
    } catch {
        output.innerHTML += `<p style="color:red;"><b>ERRO na resposta</b></p>`;
    }
}

// Voz da IA
function speak(text) {
    const voice = new SpeechSynthesisUtterance(text);
    voice.lang = "pt-BR";
    voice.pitch = 1.3;
    voice.rate = 1.05;
    window.speechSynthesis.speak(voice);
}
