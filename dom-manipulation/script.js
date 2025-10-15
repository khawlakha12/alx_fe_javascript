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
    saveQuotes(); // <-- Sauvegarde après ajout
    alert("Quote added successfully!");
  }
  
  // --- Écouteurs d’événements ---
  newQuoteBtn.addEventListener("click", showRandomQuote);
  
  // --- Initialisation ---
  createCategoryDropdown();
  createAddQuoteForm();
  
  
  // -------------------- NOUVELLE PARTIE : WEB STORAGE + JSON HANDLING --------------------
  
  // Sauvegarder les citations dans le localStorage
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
  
  // Charger les citations depuis le localStorage
  function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
      quotes = JSON.parse(storedQuotes);
    }
  }
  
  // Charger la dernière citation vue depuis la session
  function loadLastViewedQuote() {
    const lastQuote = sessionStorage.getItem("lastViewedQuote");
    if (lastQuote) {
      const quote = JSON.parse(lastQuote);
      quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
    }
  }
  
  // Exporter les citations en JSON
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
  
  // Importer des citations depuis un fichier JSON
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
  
  // Charger les données au démarrage
  loadQuotes();
  createCategoryDropdown();
  loadLastViewedQuote();
  