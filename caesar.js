function caesarCipher(text, shift) {
    let finalChars = [];

    for (let i = 0; i < text.length; i++) {
        let char = text[i];

        let isLowerCase = (char >= 'a' && char <= 'z');
        let isUpperCase = (char >= 'A' && char <= 'Z');

        if (isLowerCase || isUpperCase) {

            let code = char.charCodeAt(0);
            let startCode;
            
            if (code >= 65 && code <= 90) {
                startCode = 65;
            } else {
                startCode = 97;
            }

            let currentOrd = code;
            let shiftedOrd = currentOrd + shift;

            if (shiftedOrd - startCode >= 26) {
                shiftedOrd = shiftedOrd - 26;
            } else if (shiftedOrd - startCode < 0){
                shiftedOrd = shiftedOrd + 26;
            }
            let newChar = String.fromCharCode(shiftedOrd);
            finalChars.push(newChar);
        } else {
            finalChars.push(char);
        }
    }

    return finalChars.join('');
}

function frequencyAnalysis(text) {
    const upperText = text.toUpperCase();
    const letterFreq = new Array(26).fill(0);
    let letterCount = 0;

    for (let i = 0; i < upperText.length; i++){
        const char = upperText[i];
        if (char >= 'A' && char <= 'Z') {
            const num = char.charCodeAt(0) - 65;
            letterFreq[num]++;
            letterCount++;
        }
    }
    return { letterFreq, letterCount };
}

document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const textOutput = document.getElementById('textOutput');
    const encryptButton = document.getElementById('encryptButton');
    const shiftValue = document.getElementById('shiftValue');
    const analyzeButton = document.getElementById('analyzeButton');
    const analysisOutput = document.getElementById('analysisOutput');

    encryptButton.addEventListener('click', () => {
        const text = inputText.value;
        const shift = parseInt(shiftValue.value, 10);
        const encryptedText = caesarCipher(text, shift);
        textOutput.value = encryptedText; // Use .value for textarea
        analysisOutput.textContent = ''; // Clear previous analysis
    });

    analyzeButton.addEventListener('click', () => {
        const text = textOutput.value; // Use .value for textarea
        if (!text) return;

        const { letterFreq, letterCount } = frequencyAnalysis(text);
        
        if (letterCount === 0) {
            analysisOutput.textContent = "No letters to analyze.";
            return;
        }

        // Create an array of objects to sort
        const frequencies = letterFreq.map((freq, index) => {
            return {
                letter: String.fromCharCode(65 + index),
                freq: freq,
                percentage: ((freq / letterCount) * 100).toFixed(2)
            };
        });

        // Sort by frequency, descending
        frequencies.sort((a, b) => b.freq - a.freq);

        let output = "Letter Frequencies (most to least common):\n";
        frequencies.forEach(item => {
            if (item.freq > 0) {
                output += `${item.letter}: ${item.percentage}% (${item.freq})\n`;
            }
        });

        analysisOutput.textContent = output;
    });
});
