// Fonction factorielle
function fact(n) {
  return (n === 0 || n === 1) ? 1 : n * fact(n - 1);
}

// Fonction pour appliquer une fonction à un tableau
function applique(f, tab) {
  return tab.map(f);
}

// Variables pour stocker les messages
let localMsgs = [];
let serverMsgs = [];

// Fonction pour mettre à jour l'affichage des messages
function update() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  // Fusionner messages locaux et distants et trier par timestamp
  const mergedMsgs = [...localMsgs, ...serverMsgs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  mergedMsgs.forEach(msg => {
    const li = document.createElement("li");
    li.textContent = `${msg.user} (${formatTimestamp(msg.timestamp)}) : ${msg.msg}`;
    list.appendChild(li);
  });
}

// Récupération des messages du serveur
async function fetchMessages() {
  try {
    let response = await fetch('https://message-board-yoga.onrender.com/msg/getAll');
    if (!response.ok) throw new Error();

    serverMsgs = await response.json();
    update();
  } catch {
    alert("Impossible de récupérer les messages du serveur.");
  }
}

// Envoi d'un message
document.getElementById('sendButton').addEventListener('click', async function() {
  let user = "Myself";
  let msg = document.querySelector("textarea").value.trim();
  let timestamp = new Date().toISOString();

  if (msg === "") {
    alert("Please enter a message");
    return;
  }

  localMsgs.push({ user, msg, timestamp });
  update();

  let apiUrl = `https://message-board-yoga.onrender.com/msg/post/${encodeURIComponent(msg)}/${encodeURIComponent(user)}`;

  try {
    await fetch(apiUrl, { method: "POST", headers: { "Content-Type": "application/json" } });
    fetchMessages();
  } catch {
    alert("Erreur lors de l'envoi du message.");
  }

  document.querySelector("textarea").value = "";
});

// Rafraîchir les messages
document.getElementById('updateButton').addEventListener('click', fetchMessages);

// Mode sombre
document.getElementById('styleButton').addEventListener('click', function() {
  document.body.classList.toggle('dark-mode');
  this.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
});


// Fonction pour formater le timestamp
function formatTimestamp(timestamp) {
  let date = new Date(timestamp);
  return date.toLocaleString("en-EN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
}
