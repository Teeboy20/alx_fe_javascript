// Initial quotes array
let quotes = [
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const categorySelect = document.getElementById("categorySelect");
const newQuoteBtn = document.getElementById("newQuote");

// Populate category dropdown
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))]; // Unique categories
  categorySelect.innerHTML = ""; // Clear old options
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Display a random quote from selected category
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = filteredQuotes[randomIndex].text;
}

// Add a new quote dynamically
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });

  // Update UI
  populateCategories();
  textInput.value = "";
  categoryInput.value = "";
  alert("Quote added successfully!");
}

// Initial setup
populateCategories();
newQuoteBtn.addEventListener("click", showRandomQuote);
