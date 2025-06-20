let history = [];
let stats = { totalChecks: 0, palindromeCount: 0 };

function loadData() {
    if (window.appData) {
        history = window.appData.history || [];
        stats = window.appData.stats || { totalChecks: 0, palindromeCount: 0 };
    }
}

function saveData() {
    window.appData = { history, stats };
}

document.addEventListener('DOMContentLoaded', function() {
    loadData();
    updateStatsDisplay();
    updateHistoryDisplay();

    document.getElementById('inputString').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPalindrome();
        }
    });
});

function isValidInput(text) {
    return /^[a-zA-Z0-9]*$/.test(text);
}

function isPalindrome(text) {
    const clean = text.toLowerCase();
    return clean === clean.split('').reverse().join('');
}

function analyzeString(text) {
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    const digits = (text.match(/[0-9]/g) || []).length;
    const total = text.length;
    
    return {
        length: total,
        letters: letters,
        digits: digits,
        letterRatio: total > 0 ? (letters / total * 100).toFixed(1) : 0,
        digitRatio: total > 0 ? (digits / total * 100).toFixed(1) : 0
    };
}

function checkPalindrome() {
    const input = document.getElementById('inputString').value.trim();
    
    if (!input) {
        alert('Input kosong. Silakan masukkan string untuk dicheck!');
        return;
    }

    if (!isValidInput(input)) {
        alert('Format tidak valid. Input harus mengikuti pola (letter + digit)*\nHanya huruf dan angka yang diperbolehkan!');
        return;
    }

    const isPalin = isPalindrome(input);
    const analysis = analyzeString(input);
    const timestamp = new Date().toLocaleString('id-ID');

    stats.totalChecks++;
    if (isPalin) {
        stats.palindromeCount++;
    }

    displayResult(input, isPalin, analysis, timestamp);

    const historyEntry = {
        timestamp: timestamp,
        input: input,
        isPalindrome: isPalin,
        analysis: analysis
    };
    
    history.unshift(historyEntry);
    if (history.length > 50) {
        history = history.slice(0, 50);
    }

    saveData();
    updateStatsDisplay();
    updateHistoryDisplay();
}

function displayResult(input, isPalin, analysis, timestamp) {
    const resultArea = document.getElementById('resultArea');
    
    const statusColor = isPalin ? 'green' : 'red';
    const statusBg = isPalin ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
    const statusText = isPalin ? 'text-green-700' : 'text-red-700';
    
    const resultHTML = `
        <div class="space-y-4">
            <!-- Main Result -->
            <div class="border rounded-lg p-4 ${statusBg}">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="text-lg font-semibold ${statusText}">
                        ${isPalin ? '✅ PALINDROME' : '❌ BUKAN PALINDROME'}
                    </h3>
                    <span class="text-sm text-gray-500">${timestamp}</span>
                </div>
                <div class="font-mono text-xl text-gray-800 mb-2">${input}</div>
                <div class="text-sm text-gray-600">${analysis.length} characters</div>
            </div>

            <!-- String Comparison -->
            <div class="border rounded-lg p-4">
                <h4 class="font-medium text-gray-700 mb-3">String Comparison</h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <div class="text-gray-500 mb-1">Original:</div>
                        <div class="font-mono bg-gray-100 p-2 rounded border">${input}</div>
                    </div>
                    <div>
                        <div class="text-gray-500 mb-1">Reversed:</div>
                        <div class="font-mono bg-gray-100 p-2 rounded border">${input.split('').reverse().join('')}</div>
                    </div>
                </div>
            </div>

            <!-- Analysis -->
            <div class="border rounded-lg p-4">
                <h4 class="font-medium text-gray-700 mb-3">Analysis</h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span>Total Length:</span>
                            <span class="font-medium">${analysis.length}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Letters:</span>
                            <span class="font-medium">${analysis.letters} (${analysis.letterRatio}%)</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Digits:</span>
                            <span class="font-medium">${analysis.digits} (${analysis.digitRatio}%)</span>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 bg-green-500 rounded-full"></span>
                            <span class="text-xs">Format Valid</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 ${isPalin ? 'bg-green-500' : 'bg-red-500'} rounded-full"></span>
                            <span class="text-xs">Palindrome Check</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Message -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center text-blue-700">
                ${isPalin ? '🎉 Selamat! Anda menemukan palindrome!' : '💡 Bukan palindrome, tapi terus eksplorasi!'}
            </div>
        </div>
    `;
    
    resultArea.innerHTML = resultHTML;
}

function updateStatsDisplay() {
    document.getElementById('totalChecks').textContent = stats.totalChecks;
    document.getElementById('palindromeCount').textContent = stats.palindromeCount;
    
    const rate = stats.totalChecks > 0 ? Math.round((stats.palindromeCount / stats.totalChecks) * 100) : 0;
    document.getElementById('successRate').textContent = rate + '%';
}

function updateHistoryDisplay() {
    const historyArea = document.getElementById('historyArea');
    
    if (history.length === 0) {
        historyArea.innerHTML = `
            <div class="text-center py-16 text-gray-500">
                <p>Belum ada history. Mulai cek palindrome yuk!</p>
            </div>
        `;
        return;
    }

    const historyHTML = history.slice(0, 20).map(entry => {
        const isPalin = entry.isPalindrome;
        const borderColor = isPalin ? 'border-l-green-400' : 'border-l-red-400';
        const bgColor = isPalin ? 'bg-green-50' : 'bg-red-50';
        
        return `
            <div class="border-l-4 ${borderColor} ${bgColor} p-3 rounded">
                <div class="flex justify-between items-start mb-1">
                    <div class="font-mono font-medium">"${entry.input}"</div>
                    <span class="text-xs px-2 py-1 rounded ${isPalin ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                        ${isPalin ? 'PALINDROME' : 'NOT PALINDROME'}
                    </span>
                </div>
                <div class="text-xs text-gray-500 flex justify-between">
                    <span>${entry.timestamp}</span>
                    <span>${entry.analysis.length} chars, ${entry.analysis.letters} letters, ${entry.analysis.digits} digits</span>
                </div>
            </div>
        `;
    }).join('');

    historyArea.innerHTML = historyHTML;
}

function clearInput() {
    document.getElementById('inputString').value = '';
    document.getElementById('resultArea').innerHTML = `
        <div class="text-center py-16 text-gray-500">
            <p>Enter a string above and click "Check Now" to see the analysis</p>
        </div>
    `;
    document.getElementById('inputString').focus();
}

function clearHistory() {
    if (confirm('Yakin ingin menghapus semua history dan statistik?')) {
        history = [];
        stats = { totalChecks: 0, palindromeCount: 0 };
        saveData();
        updateStatsDisplay();
        updateHistoryDisplay();
    }
}