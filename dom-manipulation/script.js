
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const categoryFilter = document.getElementById("categoryFilter");

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

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

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function addQuote() {
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


function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    createCategoryDropdown();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
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

function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  select.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    select.appendChild(option);
  });

  const lastFilter = localStorage.getItem("lastCategoryFilter");
  if (lastFilter) select.value = lastFilter;
}

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategoryFilter", selected);

  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  const display = filtered.map(q => `"${q.text}" — ${q.category}`).join("\n");
  quoteDisplay.textContent = display || "No quotes available for this category.";
}

loadQuotes();
createCategoryDropdown();
populateCategories();

newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

function notifyUser(message, type = "info") {
  const note = document.createElement("div");
  note.textContent = message;
  note.style.position = "fixed";
  note.style.bottom = "20px";
  note.style.right = "20px";
  note.style.background = type === "error" ? "#ff5c5c" : "#4CAF50";
  note.style.color = "#fff";
  note.style.padding = "10px 15px";
  note.style.borderRadius = "8px";
  note.style.zIndex = "1000";
  document.body.appendChild(note);
  setTimeout(() => note.remove(), 4000);
}

async function syncQuotes() {
  try {
    
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverData = await response.json();

    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    const localTexts = quotes.map(q => q.text);
    const newServerQuotes = serverQuotes.filter(sq => !localTexts.includes(sq.text));

    if (newServerQuotes.length > 0) {
      quotes.push(...newServerQuotes);
      saveQuotes();
      createCategoryDropdown();
      populateCategories();
      notifyUser("New quotes synced from server!", "info");
    } else {
      console.log("No new quotes from server.");
    }
  } catch (error) {
    console.error("Error syncing quotes:", error);
    notifyUser("Error syncing with server.", "error");
  }
}

setInterval(syncQuotes, 30000);

const syncBtn = document.getElementById("syncBtn");
if (syncBtn) syncBtn.addEventListener("click", syncQuotes);
