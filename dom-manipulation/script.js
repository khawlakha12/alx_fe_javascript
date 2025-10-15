// -------------------- ORIGINAL CODE --------------------

let quotes = [
    { text: "The best way to predict the future is to invent it.", category: "Motivation" },
    { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
    { text: "Stay hungry, stay foolish.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" }
  ];
  
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const addQuoteSection = document.getElementById("addQuoteSection");
  const categoryFilter = document.getElementById("categoryFilter");
  
  // --- Fonction pour créer le menu déroulant des catégories ---
  function createCategoryDropdown() {
    const categories = [...new Set(quotes.map(q => q.category))];
    const select = document.createElement("select");
    select.id = "categorySelect";
  
    const allOption = document.createElement("option");
    allOption.value = "All";
    allOption.textContent = "All Categories";
    select.appendChild(allOption);
  
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      select.appendChild(option);
    });
  
    select.addEventListener("change", showRandomQuote);
    categoryFilter.innerHTML = "";
    categoryFilter.appendChild(select);
  }
  
  // --- Fonction pour afficher une citation aléatoire ---
  function showRandomQuote() {
    const selectedCategory = document.getElementById("categorySelect").value;
    let filteredQuotes = quotes;
  
    if (selectedCategory !== "All") {
      filteredQuotes = quotes.filter(q => q.category === selectedCategory);
    }
  
    if (filteredQuotes.length === 0) {
      quoteDisplay.textContent = "No quotes available for this category.";
      return;
    }
  
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
  
    // Sauvegarder la dernière citation vue (sessionStorage)
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
  }
  
  // --- Fonction pour créer le formulaire d’ajout de citation ---
  function createAddQuoteForm() {
    const form = document.createElement("div");
    form.innerHTML = `
      <h3>Add a New Quote</h3>
      <input type="text" id="newQuoteText" placeholder="Quote text" />
      <input type="text" id="newQuoteCategory" placeholder="Category" />
      <button id="addQuoteBtn">Add Quote</button>
    `;
  
    addQuoteSection.appendChild(form);
  
    const addQuoteBtn = form.querySelector("#addQuoteBtn");
    addQuoteBtn.addEventListener("click", addQuote);
  }
  
  // --- Fonction pour ajouter une nouvelle citation ---
  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText");
    const newQuoteCategory = document.getElementById("newQuoteCategory");
  
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();
  
    if (text === "" || category === "") {
      alert("Please fill in both fields!");
      return;
    }
  
    quotes.push({ text, category });
  
    newQuoteText.value = "";
    newQuoteCategory.value = "";
  
    createCategoryDropdown();
    saveQuotes();
    alert("Quote added successfully!");
  }
  
  // --- Écouteurs d’événements ---
  newQuoteBtn.addEventListener("click", showRandomQuote);
  
  // --- Initialisation ---
  createCategoryDropdown();
  createAddQuoteForm();
  
  
  // -------------------- PARTIE 1 : WEB STORAGE + JSON HANDLING --------------------
  
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
  
  function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
      quotes = JSON.parse(storedQuotes);
    }
  }
  
  function loadLastViewedQuote() {
    const lastQuote = sessionStorage.getItem("lastViewedQuote");
    if (lastQuote) {
      const quote = JSON.parse(lastQuote);
      quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
    }
  }
  
  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.download = "quotes.json";
    link.click();
  
    URL.revokeObjectURL(url);
  }
  
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
      try {
        const importedQuotes = JSON.parse(e.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes.push(...importedQuotes);
          saveQuotes();
          createCategoryDropdown();
          alert("Quotes imported successfully!");
        } else {
          alert("Invalid JSON format.");
        }
      } catch {
        alert("Error reading JSON file.");
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  loadQuotes();
  createCategoryDropdown();
  loadLastViewedQuote();
  
  
  // -------------------- PARTIE 2 : DYNAMIC CONTENT FILTERING SYSTEM --------------------
  
  function populateCategories() {
    const categorySelect = document.getElementById("categoryFilter");
    categorySelect.innerHTML = `<option value="All">All Categories</option>`;
    const categories = [...new Set(quotes.map(q => q.category))];
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
  
    const lastFilter = localStorage.getItem("selectedCategory");
    if (lastFilter) {
      categorySelect.value = lastFilter;
      filterQuotes();
    }
  }
  
  function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory);
  
    const filteredQuotes =
      selectedCategory === "All"
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);
  
    if (filteredQuotes.length === 0) {
      quoteDisplay.textContent = "No quotes available for this category.";
    } else {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const quote = filteredQuotes[randomIndex];
      quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
    }
  }
  
  const originalAddQuote = addQuote;
  addQuote = function() {
    originalAddQuote();
    populateCategories();
  };
  
  populateCategories();
  
  
  // -------------------- PARTIE 3 : SERVER SYNC & CONFLICT RESOLUTION --------------------
  
  // Simuler l'URL d'une API (exemple : JSONPlaceholder)
  const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
  
  // Fonction pour simuler la récupération des citations depuis le serveur
  async function fetchQuotesFromServer() {
    try {
      // Simulation d'une requête GET (on récupère des données fictives)
      const response = await fetch(SERVER_URL);
      const data = await response.json();
  
      // Convertir les données simulées en format "quote"
      const serverQuotes = data.slice(0, 5).map(item => ({
        text: item.title,
        category: "Server"
      }));
  
      resolveConflicts(serverQuotes);
    } catch (error) {
      console.error("Error fetching server data:", error);
    }
  }
  
  // Résolution des conflits : le serveur a la priorité
  function resolveConflicts(serverQuotes) {
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
  
    // Si un texte du serveur n'existe pas localement, on l'ajoute
    serverQuotes.forEach(sq => {
      const exists = localQuotes.some(lq => lq.text === sq.text);
      if (!exists) {
        localQuotes.push(sq);
      }
    });
  
    // Si une citation locale est différente (même texte, autre catégorie), on garde celle du serveur
    localQuotes.forEach((lq, index) => {
      const serverMatch = serverQuotes.find(sq => sq.text === lq.text);
      if (serverMatch && lq.category !== serverMatch.category) {
        localQuotes[index] = serverMatch;
      }
    });
  
    quotes = localQuotes;
    saveQuotes();
    createCategoryDropdown();
    populateCategories();
    showSyncNotification("Quotes synced with server (server data prioritized).");
  }
  
  // Notification visuelle lors de la synchronisation
  function showSyncNotification(message) {
    let notif = document.getElementById("syncNotification");
    if (!notif) {
      notif = document.createElement("div");
      notif.id = "syncNotification";
      notif.style.position = "fixed";
      notif.style.bottom = "10px";
      notif.style.right = "10px";
      notif.style.background = "#4CAF50";
      notif.style.color = "white";
      notif.style.padding = "10px 15px";
      notif.style.borderRadius = "8px";
      notif.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
      document.body.appendChild(notif);
    }
    notif.textContent = message;
    setTimeout(() => (notif.style.display = "none"), 4000);
  }
  
  // Simulation d’envoi de nouvelles citations vers le serveur
  async function syncNewQuotesToServer() {
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    try {
      await fetch(SERVER_URL, {
        method: "POST",
        body: JSON.stringify(localQuotes),
        headers: { "Content-Type": "application/json" }
      });
      showSyncNotification("Local quotes synced to server successfully!");
    } catch (error) {
      console.error("Error syncing to server:", error);
    }
  }
  
  // Synchronisation périodique toutes les 30 secondes
  setInterval(() => {
    fetchQuotesFromServer();
    syncNewQuotesToServer();
  }, 30000);
  
  // Synchronisation manuelle au démarrage
  fetchQuotesFromServer();
  