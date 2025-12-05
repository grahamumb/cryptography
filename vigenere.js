function vigenereCipher(text, key) {
    if (!key || typeof key !== 'string') {
        return text;
    }

    let finalChars = [];
    let keyIndex = 0;
    const upperKey = key.toUpperCase();

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const isLetter = (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');

        if (isLetter) {
            const keyChar = upperKey[keyIndex % upperKey.length];
            const shift = keyChar.charCodeAt(0) - 65;

            finalChars.push(caesarCipher(char, shift));

            keyIndex++;
        } else {
            finalChars.push(char);
        }
    }

    return finalChars.join('');
}


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
            
            // Handle wrapping
            const alphabetSize = 26;
            while (shiftedOrd < startCode) {
                shiftedOrd += alphabetSize;
            }
            while (shiftedOrd >= startCode + alphabetSize) {
                shiftedOrd -= alphabetSize;
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

// Returns the sorted frequency data array
function getSortedAnalysis(text) {
    const { letterFreq, letterCount } = frequencyAnalysis(text);
    if (letterCount === 0) {
        return null;
    }
    const frequencies = letterFreq.map((freq, index) => ({
        letter: String.fromCharCode(65 + index),
        freq: freq,
        percentage: ((freq / letterCount) * 100).toFixed(2)
    }));
    frequencies.sort((a, b) => b.freq - a.freq);
    return frequencies;
}

function recombineSegments(segments) {
    let result = '';
    let maxLength = 0;
    segments.forEach(s => {
        if (s.length > maxLength) {
            maxLength = s.length;
        }
    });

    for (let i = 0; i < maxLength; i++) {
        segments.forEach(segment => {
            if (i < segment.length) {
                result += segment[i];
            }
        });
    }
    return result;
}


document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const textOutput = document.getElementById('textOutput');
    const encryptButton = document.getElementById('encryptButton');
    const keyInput = document.getElementById('keyInput');
    const analyzeButton = document.getElementById('analyzeButton');
    const analysisOutput = document.getElementById('analysisOutput');
    const crackButton = document.getElementById('crackButton');
    const crackOutput = document.getElementById('crackOutput');

    encryptButton.addEventListener('click', () => {
        const text = inputText.value;
        const key = keyInput.value;
        const encryptedText = vigenereCipher(text, key);
        textOutput.value = encryptedText;
        analysisOutput.textContent = ''; 
        crackOutput.innerHTML = '';
        const crackedContainer = document.getElementById('recombined-text-container');
        if (crackedContainer) {
            crackedContainer.remove();
        }
    });

    analyzeButton.addEventListener('click', () => {
        const text = textOutput.value;
        if (!text) return;
        
        const frequencies = getSortedAnalysis(text);
        if (!frequencies) {
            analysisOutput.textContent = "No letters to analyze.";
            return;
        }

        let output = "Letter Frequencies (most to least common):\n";
        frequencies.forEach(item => {
            if (item.freq > 0) {
                output += `${item.letter}: ${item.percentage}% (${item.freq})\n`;
            }
        });
        analysisOutput.textContent = output;
    });

    crackButton.addEventListener('click', () => {
        const text = textOutput.value;
        if (!text) return;

        // 1. Segment the text
        const segments = ['', '', ''];
        let letterIndex = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
                segments[letterIndex % 3] += char;
                letterIndex++;
            }
        }

        crackOutput.innerHTML = ''; // Clear previous column results
        const oldRecombinedContainer = document.getElementById('recombined-text-container');
        if(oldRecombinedContainer) {
            oldRecombinedContainer.remove();
        }

        const shiftedSegments = [];
        const E_CODE = 'E'.charCodeAt(0);

        // 2. Analyze, display columns, and calculate shifted segments
        segments.forEach((segment, index) => {
            const column = document.createElement('div');
            column.className = 'crack-column';
            
            const segmentHeader = document.createElement('h4');
            segmentHeader.textContent = `Segment ${index + 1}:`;
            column.appendChild(segmentHeader);
            
            const frequencies = getSortedAnalysis(segment);
            let shift = 0;
            
            if (frequencies) {
                const mostFrequentChar = frequencies[0].letter;
                shift = E_CODE - mostFrequentChar.charCodeAt(0);
                
                let analysisString = "Frequencies:\n";
                frequencies.forEach(item => {
                    if (item.freq > 0) {
                        analysisString += `${item.letter}: ${item.percentage}% (${item.freq})\n`;
                    }
                });
                const analysisText = document.createElement('pre');
                analysisText.textContent = analysisString;
                column.appendChild(analysisText);
            } else {
                 const analysisText = document.createElement('pre');
                 analysisText.textContent = "No letters to analyze.";
                 column.appendChild(analysisText);
            }
            
            shiftedSegments.push(caesarCipher(segment, shift));
            crackOutput.appendChild(column);
        });

        // 3. Recombine and display
        const recombinedText = recombineSegments(shiftedSegments);
        const recombinedContainer = document.createElement('div');
        recombinedContainer.id = 'recombined-text-container';
        recombinedContainer.style.marginTop = '1em';

        const recombinedHeader = document.createElement('h4');
        recombinedHeader.textContent = 'Recombined & Shifted Text:';
        
        const recombinedResult = document.createElement('div');
        recombinedResult.textContent = recombinedText;
        recombinedResult.style.wordWrap = 'break-word';
        recombinedResult.style.backgroundColor = 'white';
        recombinedResult.style.color = 'black';
        recombinedResult.style.padding = '10px';
        recombinedResult.style.borderRadius = '4px';


        recombinedContainer.appendChild(recombinedHeader);
        recombinedContainer.appendChild(recombinedResult);
        crackOutput.insertAdjacentElement('afterend', recombinedContainer);
    });
});
