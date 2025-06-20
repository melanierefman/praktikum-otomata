class LexicalAnalyzer {
    constructor() {
        this.reservedWords = new Set([
            // JavaScript
            'var', 'let', 'const', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
            'switch', 'case', 'default', 'break', 'continue', 'try', 'catch', 'finally',
            'throw', 'new', 'this', 'typeof', 'instanceof', 'in', 'of', 'class', 'extends',
            'import', 'export', 'from', 'async', 'await', 'yield', 'static', 'super',
            
            // Python
            'def', 'class', 'if', 'elif', 'else', 'while', 'for', 'in', 'try', 'except',
            'finally', 'with', 'as', 'import', 'from', 'lambda', 'global', 'nonlocal',
            'and', 'or', 'not', 'is', 'pass', 'break', 'continue', 'return', 'yield',
            'raise', 'assert', 'del', 'True', 'False', 'None',
            
            // C/C++
            'int', 'float', 'double', 'char', 'bool', 'void', 'auto', 'struct', 'union',
            'enum', 'typedef', 'sizeof', 'const', 'volatile', 'extern', 'static',
            'register', 'inline', 'virtual', 'public', 'private', 'protected',
            'namespace', 'using', 'template', 'typename', 'include', 'define',
            
            // Java
            'public', 'private', 'protected', 'static', 'final', 'abstract', 'synchronized',
            'volatile', 'transient', 'native', 'strictfp', 'interface', 'implements',
            'package', 'throws', 'boolean', 'byte', 'short', 'long',
            
            // Umum
            'true', 'false', 'null', 'undefined', 'NaN', 'Infinity', 'console', 'print',
            'cout', 'cin', 'endl', 'main', 'printf', 'scanf'
        ].map(w => w.toLowerCase()));

        this.mathOperators = new Set([
            '+', '-', '*', '/', '%', '**', '++', '--', '+=', '-=', '*=', '/=', '%=',
            '=', '==', '===', '!=', '!==', '<', '>', '<=', '>=', 'Math', 'pow', 'sqrt',
            'abs', 'floor', 'ceil', 'round', 'sin', 'cos', 'tan'
        ]);
    }

    tokenize(code) {
        const tokens = [];
        let position = 0;
        let lineNumber = 1;
        let columnNumber = 1;

        const patterns = [
            { type: 'comment', regex: /\/\/.*?(?=\n|$)|\/\*[\s\S]*?\*\/|#.*?(?=\n|$)/ },
            { type: 'string', regex: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/ },
            { type: 'number', regex: /\b\d+\.?\d*(?:[eE][+-]?\d+)?\b/ },
            { type: 'symbol', regex: /===|!==|==|!=|<=|>=|&&|\|\||<<|>>|\+\+|--|[-+*/%=<>!&|^~?:;,.()[\]{}@#$\\]/ },
            { type: 'identifier', regex: /[a-zA-Z_$][a-zA-Z0-9_$]*/ },
            { type: 'whitespace', regex: /\s+/ }
        ];

        while (position < code.length) {
            let matched = false;
            
            for (const pattern of patterns) {
                const regex = new RegExp('^' + pattern.regex.source);
                const match = code.slice(position).match(regex);
                
                if (match) {
                    const tokenValue = match[0];
                    
                    if (pattern.type === 'whitespace') {
                        const newlines = tokenValue.match(/\n/g);
                        if (newlines) {
                            lineNumber += newlines.length;
                            columnNumber = 1;
                        } else {
                            columnNumber += tokenValue.length;
                        }
                    } else if (pattern.type !== 'comment') {
                        tokens.push({
                            type: pattern.type,
                            value: tokenValue,
                            position: position,
                            line: lineNumber,
                            column: columnNumber
                        });
                        columnNumber += tokenValue.length;
                    }
                    
                    position += tokenValue.length;
                    matched = true;
                    break;
                }
            }
            
            if (!matched) {
                const unknownChar = code[position];
                tokens.push({
                    type: 'unknown',
                    value: unknownChar,
                    position: position,
                    line: lineNumber,
                    column: columnNumber
                });
                position++;
                columnNumber++;
            }
        }

        return tokens;
    }

    categorizeTokens(tokens) {
        const categories = {
            reservedWords: [],
            symbols: [],
            variables: [],
            mathExpressions: [],
            numbers: [],
            strings: [],
            unknown: []
        };

        tokens.forEach(token => {
            console.log("Token type:", token.type, "value:", token.value);
            switch (token.type) {
                case 'identifier':
                    if (this.reservedWords.has(token.value.toLowerCase())) {
                        categories.reservedWords.push(token);
                    } else {
                        categories.variables.push(token);
                    }
                    break;

                case 'symbol':
                    categories.symbols.push(token);
                    if (this.mathOperators.has(token.value)) {
                        categories.mathExpressions.push(token);
                    }
                    break;

                case 'number':
                    categories.numbers.push(token);
                    categories.mathExpressions.push(token);
                    break;

                case 'string':
                    categories.strings.push(token);
                    break;

                case 'unknown':
                    categories.unknown.push(token);
                    break;
            }
        });

        return categories;
    }

    getStatistics(tokens, categories) {
        return {
            total: tokens.length,
            reservedWords: categories.reservedWords.length,
            variables: categories.variables.length,
            symbols: categories.symbols.length,
            numbers: categories.numbers.length,
            strings: categories.strings.length,
            mathExpressions: categories.mathExpressions.length,
            unknown: categories.unknown.length
        };
    }
}

const analyzer = new LexicalAnalyzer();

const codeInput = document.getElementById('codeInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const exampleBtn = document.getElementById('exampleBtn');
const resultsSection = document.getElementById('resultsSection');

const examples = [
    {
        name: "JavaScript - Palindrome Function",
        code: `function palindrome(str) {
    let cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    let reversed = cleanStr.split('').reverse().join('');
    return cleanStr === reversed;
}

let result = palindrome("A man a plan a canal Panama");
console.log(result);`
    },
    {
        name: "Python - Fibonacci Sequence",
        code: `def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

result = fibonacci(10)
print(f"Fibonacci(10) = {result}")`
    },
    {
        name: "C++ - Basic Calculator",
        code: `#include <iostream>
using namespace std;

int main() {
    int a = 10, b = 20;
    int sum = a + b;
    int product = a * b;
    cout << "Sum: " << sum << endl;
    cout << "Product: " << product << endl;
    return 0;
}`
    }
];

function createTokenElement(token, colorClass) {
    const element = document.createElement('span');
    element.className = `inline-block px-2 py-1 rounded text-xs font-mono ${colorClass} token-item m-1`;
    element.textContent = token.value;
    element.title = `Type: ${token.type} | Line: ${token.line}, Column: ${token.column}`;
    
    element.addEventListener('click', () => {
        const details = `Token: "${token.value}"
Type: ${token.type}
Position: Line ${token.line}, Column ${token.column}`;
        alert(details);
    });
    
    return element;
}

function displayResults(categories, allTokens) {
    const stats = analyzer.getStatistics(allTokens, categories);
    
    document.getElementById('totalTokens').textContent = stats.total;
    document.getElementById('reservedCount').textContent = stats.reservedWords;
    document.getElementById('variableCount').textContent = stats.variables;
    document.getElementById('symbolCount').textContent = stats.symbols;

    const containers = {
        'reservedWords': { items: categories.reservedWords, color: 'bg-purple-200 text-purple-800 border border-purple-300' },
        'symbols': { items: categories.symbols, color: 'bg-orange-200 text-orange-800 border border-orange-300' },
        'variables': { items: categories.variables, color: 'bg-green-200 text-green-800 border border-green-300' },
        'mathExpressions': { items: categories.mathExpressions, color: 'bg-blue-200 text-blue-800 border border-blue-300' }
    };

    Object.entries(containers).forEach(([containerId, config]) => {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        if (config.items && config.items.length > 0) {
            const uniqueValues = [...new Set(config.items.map(t => t.value))];
            
            uniqueValues.forEach(value => {
                const token = config.items.find(t => t.value === value);
                const element = createTokenElement(token, config.color);
                container.appendChild(element);
            });
        } else {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'text-gray-500 text-sm';
            emptyMessage.textContent = `Tidak ada ${containerId === 'reservedWords' ? 'reserved words' : 
                                                     containerId === 'symbols' ? 'simbol' : 
                                                     containerId === 'variables' ? 'variabel' : 
                                                     'ekspresi matematika'} ditemukan`;
            container.appendChild(emptyMessage);
        }
    });

    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function analyzeCode() {
    const code = codeInput.value.trim();

    if (!code) {
        alert('Masukkan kode program terlebih dahulu!');
        codeInput.focus();
        return;
    }

    try {
        const tokens = analyzer.tokenize(code);
        const categories = analyzer.categorizeTokens(tokens);

        console.log("Tokens:", tokens);
        displayResults(categories, tokens);
    } catch (error) {
        console.error('Analysis error:', error);
        alert('Terjadi kesalahan saat menganalisis kode. Silakan coba lagi.');
    }
}

function clearAll() {
    codeInput.value = '';
    resultsSection.classList.add('hidden');
    codeInput.focus();
}

function loadExample() {
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    codeInput.value = randomExample.code;
}

analyzeBtn.addEventListener('click', analyzeCode);
clearBtn.addEventListener('click', clearAll);
exampleBtn.addEventListener('click', loadExample);

codeInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        analyzeCode();
    }
    
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        clearAll();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    codeInput.focus();
});