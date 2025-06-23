let localQuotes = [];
let lastSyncTime = Date.now();

// Sync every 15 seconds
setInterval(syncWithServer, 15000);

// Load local quotes and setup
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  localQuotes = stored ? JSON.parse(stored) : [];
  saveQuotes();
}

// Save local changes
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(localQuotes));
}

// Show notification
function showNotification(message, duration = 3000) {
  const note = document.createElement('div');
  note.textContent = message;
  note.style = "background: #28a745; color: white; padding: 10px; margin-top: 10px;";
  document.body.prepend(note);
  setTimeout(() => note.remove(), duration);
}

// Sync with server
async function syncWithServer() {
  try {
    const serverQuotes = await fakeServer.fetchQuotes();
    const mergedQuotes = mergeQuotes(serverQuotes, localQuotes);
    if (mergedQuotes.updated) {
      localQuotes = mergedQuotes.quotes;
      saveQuotes();
      populateCategories();
      showNotification("Synced with server, conflicts resolved.");
    }
  } catch (err) {
    console.error("Sync failed:", err);
    showNotification("Sync failed!", 3000);
  }
}

// Merge logic: server wins if conflict
function mergeQuotes(server, local) {
  const result = [];
  const serverMap = new Map(server.map(q => [q.id, q]));
  const localMap = new Map(local.map(q => [q.id, q]));
  let updated = false;

  // Merge
  serverMap.forEach((serverQ, id) => {
    if (!localMap.has(id)) {
      result.push(serverQ);
      updated = true;
    } else {
      const localQ = localMap.get(id);
      // Conflict: use server's if text/category differs
      if (serverQ.text !== localQ.text || serverQ.category !== localQ.category) {
        result.push(serverQ);
        updated = true;
      } else {
        result.push(localQ);
      }
    }
  });

  // Include local-only quotes
  local.forEach(q => {
    if (!serverMap.has(q.id)) {
      result.push(q);
    }
  });

  return { quotes: result, updated };
}
async function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) return alert("Both fields required.");

  const quote = { id: Date.now(), text, category, timestamp: Date.now() };
  localQuotes.push(quote);
  saveQuotes();
  populateCategories();
  filterQuotes();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  showNotification("Quote added locally.");

  // Simulate server push
  try {
    await fakeServer.postQuote(quote);
    showNotification("Quote synced to server.");
  } catch {
    showNotification("Failed to sync to server!", 3000);
  }
}
