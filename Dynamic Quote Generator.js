let quotes = [];

const quoteDisplay = document.getElementById("quoteDisplay");
const filteredQuotes = document.getElementById("filteredQuotes");
const categoryFilter = document.getElementById("categoryFilter");
const newQuoteBtn = document.getElementById("newQuote");

// Load from local storage
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  quotes = stored ? JSON.parse(stored) : [
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Be yourself; everyone else is already taken.", category: "Inspiration" }
  ];
  saveQuotes();
}

// Save to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate category selectors
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  const currentFilter = localStorage.getItem("selectedCategory") || "all";
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    if (cat === currentFilter) opt.selected = true;
    categoryFilter.appendChild(opt);
  });
  filterQuotes();
}

// Filter quotes by selected category
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);
  const shownQuotes = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  filteredQuotes.innerHTML = shownQuotes.length
    ? shownQuotes.map(q => `<p>"${q.text}" — <em>${q.category}</em></p>`).join("")
    : "<p>No quotes available for this category.</p>";
}

// Show random quote from selected category
function showRandomQuote() {
  const selected = categoryFilter.value;
  const pool = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  if (pool.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }
  const random = pool[Math.floor(Math.random() * pool.length)];
  quoteDisplay.textContent = random.text;
  sessionStorage.setItem("lastQuote", random.text);
}

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) return alert("Both fields required.");

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added!");
}

// Export quotes to JSON
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import from JSON
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data)) throw new Error();
      quotes.push(...data);
      saveQuotes();
      populateCategories();
      alert("Quotes imported!");
    } catch {
      alert("Invalid JSON format.");
    }
  };
  reader.readAsText(file);
}

// On load
loadQuotes();
populateCategories();
newQuoteBtn.addEventListener("click", showRandomQuote);

// Restore last quote if exists
const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) quoteDisplay.textContent = lastQuote;
