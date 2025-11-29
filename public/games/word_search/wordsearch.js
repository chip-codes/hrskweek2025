const initialTxt = document.querySelector('.initialTxt');
const txtCount = document.querySelector('.txtCount');
const countWords = document.querySelector('#countWords');
const wordsSpan = document.querySelector('#wordsSpan');

const btnStart = document.querySelector('.btnStart');
const btnRestart = document.querySelector('.btnRestart');

const imgsWord = document.querySelectorAll('.imgWordNotFound');
const spansWord = document.querySelectorAll('.spanWord');

const wordSearch = document.querySelector('.wordSearch');
const letters = document.querySelectorAll('.btnLetter');

const timerContainer = document.querySelector('.timerContainer');

const popupContainer = document.querySelector(".popup-container");
const popupTime = document.querySelector(".popup-time");
const popupMoves = document.querySelector(".popup-moves");
const popupOk = document.querySelector("#popupOk");


// SAKO
const sakoWord = [letters[105], letters[89], letters[73]];
const foxWord = [letters[51], letters[17]];
const shishitorenWord = [letters[77], letters[93], letters[109], letters[125], letters[141], letters[157], letters[173], letters[189], letters[205], letters[221], letters[237]];
const kobayashiWord = [letters[116], letters[117], letters[118], letters[119], letters[120], letters[122], letters[123]];
const ianWord = [letters[29], letters[44], letters[59]];
const latteWord = [letters[217], letters[216], letters[215], letters[214], letters[213]];
const followWord = [letters[134], letters[168], letters[185], letters[202], letters[219], letters[236], letters[253]];
const decemberWord = [letters[129], letters[145], letters[161], letters[177], letters[193], letters[209], letters[225], letters[241]];

// HIRAGI
const hiragiWord = [letters[179], letters[180], letters[181], letters[182], letters[183], letters[184]];
const sharkWord = [letters[11], letters[28], letters[45], letters[62], letters[79]];
const bofurinWord = [letters[33], letters[35], letters[36], letters[37], letters[38], letters[39]];
const suzukiWord = [letters[242], letters[243], letters[244], letters[245], letters[246], letters[247]];
const nickWord = [letters[64], letters[81], letters[98]];
const coffeeWord = [letters[152], letters[150], letters[149], letters[148], letters[147]];
const gaskunWord = [letters[223], letters[207], letters[191], letters[175], letters[159], letters[143], letters[127], letters[111], letters[95]];
const hirasakoWord = [letters[0], letters[1], letters[2], letters[3], letters[4], letters[5], letters[6], letters[7]];

                        // letters[0]   letters[1]   letters[2]    letters[3]
const lettersInCommon = [letters[121], letters[34], letters[115], letters[151]];

let words = [
    sakoWord, foxWord, shishitorenWord, kobayashiWord, ianWord, latteWord, followWord, decemberWord, hiragiWord, sharkWord, bofurinWord, suzukiWord, nickWord, coffeeWord, gaskunWord, hirasakoWord
].length;

let points = 0;
const maxPoints = words;
const maxPointsText = `Congratulations, you have found the ${maxPoints} hidden words`;

// Generate random letters function
const generateRandomLetter = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const charactersLength = characters.length;

    result = characters.charAt(Math.floor(Math.random()* charactersLength));

    return result;
};

// ===== TIMER SETUP =====
let timer = 0; // in seconds
let timerInterval = null;

// Use the existing <span id="timer">
const timerDisplay = document.querySelector('#timer');

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timer++; // increment timer every second

        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}


const stopTimer = () => {
    clearInterval(timerInterval);
    timerInterval = null;
};


// Check for generate random letters
const checkWord = (letter, word) => {
    let count = 0;
    word.forEach((item) => item !== letter && count++);

    return count;
};

const compareLetters = (letter, word) => checkWord(letter, word) == word.length;


    const conditionCompareWords = (letter, word1, word2, word3, word4, word5, word6, word7, word8) => {
        return (
            compareLetters(letter, word1) &&
            compareLetters(letter, word2) &&
            compareLetters(letter, word3) &&
            compareLetters(letter, word4) &&
            compareLetters(letter, word5) &&
            compareLetters(letter, word6) &&
            compareLetters(letter, word7) &&
            compareLetters(letter, word8)
        );
    };

    const compareFirst8Words = (letter) => {
        return conditionCompareWords(letter, sakoWord, foxWord, shishitorenWord, kobayashiWord, ianWord, latteWord, followWord, decemberWord)
    };

    const compareLast8Words = (letter) => {
        return conditionCompareWords(letter, hiragiWord, sharkWord, bofurinWord, suzukiWord, nickWord, coffeeWord, gaskunWord, hirasakoWord)
    };

    const compareCommonLetters = (letter) => {
        return lettersInCommon[0] !== letter && lettersInCommon[1] !== letter && lettersInCommon[2] !== letter && lettersInCommon[3] !== letter;
    };

    const compareWords = (letter) => {
        return compareFirst8Words(letter) && compareLast8Words(letter);
    };

    const compareWordsAndLettersInCommon = (letter) => {
        return compareWords(letter) && compareCommonLetters(letter)
    };

    // Set initial text and disable the letters
    initialTxt.innerText = 
`Find the ${words} hidden words`;
wordSearch.classList.add('disabledBtn');

// Btn start click event
const addRemoveClass = (element, element2, className, className2) => {
    element.classList.add(className);
    element2.classList.remove(className2);
};

btnStart.addEventListener('click', () => {

    addRemoveClass(btnStart, wordSearch, 'disabledBtnStart', 'disabledBtn');
    addRemoveClass(initialTxt, initialTxt, 'd_none', 'd_inline');

    txtCount.classList.add('fewWords');
    addRemoveClass(txtCount, txtCount, 'd_inline', 'd_none');

    countWords.innerText = words;
    wordsSpan.innerText = 'words';

    startTimer();
});

btnRestart.addEventListener('click', () => {
    stopTimer(); // stop timer just in case
    window.location.reload();
});

// Validation for words complete
const containsBtnLettersClicked = (letterInCommon) => {
    return letterInCommon.classList.contains('btnLetterClicked');
};

const classListContains = (letterInCommon, className) => {
    return letterInCommon.classList.contains(className);
}

const letterInCommonClassContains = (letterInCommon, className) => {
    return containsBtnLettersClicked(letterInCommon) || classListContains(letterInCommon, className);
};

const validateLettersInCommon = (lettersInCommon1, className, letterInCommon2, className2) => {
    return (
        letterInCommonClassContains(lettersInCommon1, className) &&
        letterInCommonClassContains(letterInCommon2, className2)
    );
};

const conditionWordEvery = (item) => {
    return item.classList.contains('btnLetterClicked');
};

const word_condition_1 = (word) => word.every(conditionWordEvery);

const word_condition_2 = (word, letterInCommon1, className) => {
    return (
        word_condition_1(word) && letterInCommonClassContains(letterInCommon1, className)
    );
};

const word_condition_3 = (word, letterInCommon1, className, letterInCommon2, className2) => {
    return word_condition_1(word) && validateLettersInCommon(
        letterInCommon1, className,
        letterInCommon2, className2
    );
};

const validateWord = (
    word, letterInCommon1 = null,
    className = '', letterInCommon2 = null,
    className2 = ''
) => {
    let condition = null;

    // Validate word without letters in common
    if(letterInCommon1 === null && letterInCommon2 === null) {
        condition = word_condition_1(word);
    }

    // Validate word with one letter in common
    if(letterInCommon1 !== null && letterInCommon2 === null) {
        condition = word_condition_2(word, letterInCommon1, className);
    }

    // Validate word with two letters in common
    if(letterInCommon1 !== null && letterInCommon2 !== null) {
        condition = word_condition_3(word, letterInCommon1, className, letterInCommon2, className2);
    }

    return condition;
};

// Word complete functions
const imgColorWord = (index, className) => {
    imgsWord[index].classList.remove('imgWordNotFound');
    spansWord[index].classList.add(className);
};

const letterInCommonIsClicked = (letterInCommon) => {
    return letterInCommon.classList.contains('btnLetterClicked');
};

const letterInCommonNoClicked = (letterInCommon) => {
    return letterInCommon.classList.remove('btnLetterClicked');
};

const letterInCommonNotNull = (letterInCommon, className, className2) => {

    if(letterInCommonIsClicked(letterInCommon)) {
        letterInCommonNoClicked(letterInCommon);
    } else {
        letterInCommon.classList.remove(className2);
    }

    letterInCommon.classList.add(className);
};

const youWin = (points) => {
    // stopTimer(); 

    if(points === maxPoints) {
        stopTimer();
        wordSearch.classList.add('wordSearchDisabledWin');

        setTimeout(() => {
            addRemoveClass(btnStart, btnRestart, 'd_none', 'd_none');
            addRemoveClass(txtCount, txtCount, 'd_none', 'd_inline');
            initialTxt.innerText = maxPointsText;
            addRemoveClass(initialTxt, initialTxt, 'd_inline', 'd_none');

            // ===== POPUP MESSAGE =====
            const minutes = Math.floor(timer / 60);
            const seconds = timer % 60;
           showPopup(minutes, seconds, points);
        }, 1000);
    }
};

const wordComplete = (
    word, className, words, points, letterInCommon1 = null, 
    className2 = '', letterInCommon2 = null, className3 = ''
) => {
    countWords.innerText = words;
    words === 1 ? wordsSpan.innerText = 'word' : wordsSpan.innerText = 'words';

    word.forEach((letter) => {
        letter.classList.remove('btnLetterClicked');
        letter.classList.add(className);
    });

    if(letterInCommon1 !== null) {
        letterInCommonNotNull(letterInCommon1, className, className2);
    }

    if(letterInCommon2 !== null) {
        letterInCommonNotNull(letterInCommon2, className, className3);
    }

    if(words === 4) {
        txtCount.classList.add('goodNumberWords');
        txtCount.classList.remove('fewWords');
    }

    if(words === 2) {
        txtCount.classList.add('lotOfWords');
        txtCount.classList.remove('goodNumberOfWords');
    }

    youWin(points);
};

// A self note for the 6 function below: 
// The complicated codes means there's letters in common so be wise and avoid making some codes tangle with each other

// SAKO
const validateSako = () => {
    if (validateWord(
        sakoWord, lettersInCommon[0], 'btnWordCompleteKobayashi'
    )) {
        words--;
        points++;
        imgColorWord(0, 'txtImgSako');
        wordComplete(
            sakoWord, 'btnWordCompleteSako',
            words, points,
            lettersInCommon[0], 'btnWordCompleteKobayashi',
        );
    }
};

const validateFox = () => {
    if (validateWord(
        foxWord, lettersInCommon[1], 'btnWordCompleteBofurin',
    )) {
        words--;
        points++;
        imgColorWord(1, 'txtImgFox');
        wordComplete(
            foxWord, 'btnWordCompleteFox', 
            words, points,
            lettersInCommon[1], 'btnWordCompleteBofurin',
        );
    }
};

const validateShishitoren = () => {
    if (validateWord(shishitorenWord)) {
        words--;
        points++;
        imgColorWord(2, 'txtImgShishitoren');
        wordComplete(shishitorenWord, 'btnWordCompleteShishitoren', words, points);
    }
};

const validateKobayashi = () => {
    if (validateWord(
        kobayashiWord, lettersInCommon[0], 'btnWordCompleteSako', lettersInCommon[2], 'btnWordCompleteNick'
    )) {
        words--;
        points++;
        imgColorWord(3, 'txtImgKobayashi');
        wordComplete(
            kobayashiWord, 
            'btnWordCompleteKobayashi',
            words, points,
            lettersInCommon[0], 'btnWordCompleteSako',
            lettersInCommon[2], 'btnWordCompleteNick',
        );
    }
};

const validateIan = () => {
    if (validateWord(ianWord)) {
        words--;
        points++;
        imgColorWord(4, 'txtImgIan');
        wordComplete(ianWord, 'btnWordCompleteIan', words, points);
    }
};

const validateLatte = () => {
    if (validateWord(latteWord)) {
        words--;
        points++;
        imgColorWord(5, 'txtImgLatte');
        wordComplete(
            latteWord, 'btnWordCompleteLatte', words, points);
    }
};

const validateFollow = () => {
    if (validateWord(followWord, lettersInCommon[3], 'btnWordCompleteCoffee')) {
        words--;
        points++;
        imgColorWord(6, 'txtImgFollow');
        wordComplete(
            followWord, 'btnWordCompleteFollow',
            words, points,
            lettersInCommon[3], 'btnWordCompleteCoffee',
        );
    }
};

const validateDecember = () => {
    if (validateWord(decemberWord)) {
        words--;
        points++;
        imgColorWord(7, 'txtImgDecember');
        wordComplete(decemberWord, 'btnWordCompleteDecember', words, points);
    }
};

// HIRAGI

const validateHiragi = () => {
    if (validateWord(hiragiWord)) {
        words--;
        points++;
        imgColorWord(8, 'txtImgHiragi');
        wordComplete(hiragiWord, 'btnWordCompleteHiragi', words, points);
    }
};

const validateShark = () => {
    if (validateWord(sharkWord)) {
        words--;
        points++;
        imgColorWord(9, 'txtImgShark');
        wordComplete(sharkWord, 'btnWordCompleteShark', words, points);
    }
};

const validateBofurin = () => {
    if (validateWord(
        bofurinWord, lettersInCommon[1], 'btnWordCompleteFox',
    )) {
        words--;
        points++;
        imgColorWord(10, 'txtImgBofurin');
        wordComplete(
            bofurinWord, 'btnWordCompleteBofurin', 
            words, points,
            lettersInCommon[1], 'btnWordCompleteFox',
        );
    }
};

const validateSuzuki = () => {
    if (validateWord(suzukiWord)) {
        words--;
        points++;
        imgColorWord(11, 'txtImgSuzuki');
        wordComplete(suzukiWord, 'btnWordCompleteSuzuki', words, points);
    }
};

const validateNick = () => {
    if (validateWord(nickWord, lettersInCommon[2], 'btnWordCompleteKobayashi',)) {
        words--;
        points++;
        imgColorWord(12, 'txtImgNick');
        wordComplete(
            nickWord, 'btnWordCompleteNick', 
            words, points,
            lettersInCommon[2], 'btnWordCompleteKobayashi',
        );
    }
};

const validateCoffee = () => {
    if (validateWord(coffeeWord, lettersInCommon[3], 'btnWordCompleteFollow')) {
        words--;
        points++;
        imgColorWord(13, 'txtImgCoffee');
        wordComplete(
            coffeeWord, 'btnWordCompleteCoffee', 
            words, points,
            lettersInCommon[3], 'btnWordCompleteFollow',
        );
    }
};

const validateGasKun = () => {
    if (validateWord(gaskunWord)) {
        words--;
        points++;
        imgColorWord(14, 'txtImgGasKun');
        wordComplete(gaskunWord, 'btnWordCompleteGasKun', words, points);
    }
};

const validateHirasako = () => {
    if (validateWord(hirasakoWord)) {
        words--;
        points++;
        imgColorWord(15, 'txtImgHirasako');
        wordComplete(hirasakoWord, 'btnWordCompleteHirasako', words, points);
    }
};

////////////////////////////////////////////////

const validateFirst8Words = () => {
    validateSako();
    validateFox();
    validateShishitoren();
    validateKobayashi();
    validateIan();
    validateLatte();
    validateFollow();
    validateDecember();
};

const validateLast8Words = () => {
    validateHiragi();
    validateShark();
    validateBofurin();
    validateSuzuki();
    validateNick();
    validateCoffee();
    validateGasKun();
    validateHirasako();
};

    letters.forEach((letter) => {
        
        // Generate random letters except for CHIP and BIRDY
        const excludedIndexes = [249, 250, 251, 252, 160, 176, 192, 208, 224];
        const index = Array.from(letters).indexOf(letter);

        if (compareWordsAndLettersInCommon(letter) && !excludedIndexes.includes(index)) {
            letter.innerText = generateRandomLetter();
        }

        // Btn letter click event
        letter.addEventListener('click', () => {

            !letter.classList.contains('btnLetterClicked') ? (
                letter.classList.add('btnLetterClicked')
            ) : (
                letter.classList.remove('btnLetterClicked')
            );

            validateFirst8Words();
            validateLast8Words();
        });
    });

    // Show popup
function showPopup(finalMinutes, finalSeconds, moves = 0) {
    popupTime.textContent = `Time: ${finalMinutes}:${finalSeconds < 10 ? '0' : ''}${finalSeconds}`;
    popupMoves.textContent = `Moves: ${moves}`;
    popupContainer.classList.remove("hidden");
}

// Close popup
popupOk.addEventListener("click", () => {
    popupContainer.classList.add("hidden");
    window.location.reload();
});