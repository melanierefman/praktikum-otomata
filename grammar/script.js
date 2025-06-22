const reservedWords = new Set([
  "var", "let", "const", "if", "else", "for", "while", "function", "return",
  "true", "false", "null", "undefined", "break", "continue", "switch", "case", "default"
]);

let history = [];

function tokenizeCode() {
  const code = document.getElementById("codeInput").value;
  if (!code.trim()) return;

  const tokens = code.match(/\w+|[^\s\w]/g) || [];

  const categories = {
    reserved: [],
    symbols: [],
    variables: [],
    math: []
  };

  const mathSentences = code.match(/[^;{}]*[=+\-*/%^]+[^;{}]*;/g) || [];
  categories.math = [...new Set(mathSentences.map(s => s.trim()))];

  tokens.forEach(token => {
    if (reservedWords.has(token)) {
      categories.reserved.push(token);
    } else if (/^[=+\-*/%^;{}()[\],.]$/.test(token)) {
      categories.symbols.push(token);
    } else if (!/\d+/.test(token)) {
      categories.variables.push(token);
    }
  });

  const resultArea = document.getElementById("resultArea");
  resultArea.innerHTML = `
    ${generateCard("Reserved Words", categories.reserved, "blue")}
    ${generateCard("Simbol & Tanda Baca", categories.symbols, "green")}
    ${generateCard("Variabel", categories.variables, "yellow")}
    ${generateCard("Kalimat Matematika", categories.math, "purple", true)}
  `;

  // Update Statistik
  document.getElementById("tokenCount").textContent = tokens.length;
  document.getElementById("variableCount").textContent = categories.variables.length;

  // Update History
  history.unshift(code);
  updateHistory();
}

function generateCard(title, list, color, multiline = false) {
  const items = [...new Set(list)];
  const content = multiline
    ? items.map(item => `<div>${item}</div>`).join("")
    : items.join(", ") || "-";

  return `
    <div class="bg-${color}-50 border-l-4 border-${color}-500 p-4 rounded-lg shadow">
      <h3 class="text-${color}-700 font-semibold mb-1">${title}</h3>
      <div class="text-${color}-800 text-sm font-mono">${content}</div>
    </div>
  `;
}

function clearInput() {
  document.getElementById("codeInput").value = "";
  document.getElementById("resultArea").innerHTML = `
    <div class="text-center text-gray-500 py-10">
      <p>Masukkan kode dan klik "Tokenize" untuk melihat hasil.</p>
    </div>`;
}

function updateHistory() {
  const historyArea = document.getElementById("historyArea");
  if (history.length === 0) {
    historyArea.innerHTML = `<div class="text-center py-10 text-gray-400">Belum ada history.</div>`;
    return;
  }

  historyArea.innerHTML = history.slice(0, 10).map((entry, index) => `
    <div class="bg-gray-100 px-3 py-2 rounded">${index + 1}. ${entry}</div>
  `).join("");
}

function clearHistory() {
  history = [];
  updateHistory();
}