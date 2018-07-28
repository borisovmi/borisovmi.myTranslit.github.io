window.onload = function () {
    // getAbcs() - getting array of all languages
    getAbcs();
    var letters = document.querySelector(".letters");
    var translit = document.getElementById("translit");
    var langSelect = document.getElementById("langSelect");
    var language = abcs.rus;

    var lastEng = "";
    var secondLastEng = "";
    var lastTwoEng = "";
    var doubleValueFlag = false;

    var caretPositionCleanEN = "";
    var caretPosition = "";
    /**/
    //building default eng-rus transliteration keybord and keys event
    printKeys(language, letters, newTextFromKeyboard);
    //setting focus on caret default position to '0' at textarea
    setCaretToPos(translit, 0);
    //changing keyboard by selecting another language and adding event to keys
    langSelect.addEventListener("change", languageChange);
    //typing using regular keyboard // it was prev "keypress"
    translit.addEventListener("keypress", transform);
    //deleting EN characters 
    translit.addEventListener("keyup", cleanEn);
    //checking caret position after a mouse click
    translit.addEventListener("click", getNewCaretPosition);
    translit.addEventListener("keydown", getNewCaretPositionKeys);

    function getNewCaretPositionKeys(event) {
        //checking new and old caret position /arrows+home+end+pUp+pDn/ to avoid bugs with double letters in the middle of a word
        if (event.keyCode >= 33 && event.keyCode <= 40) {
            caretPosition = getCaretPosition();
            console.log("test///caretPosition on click: " + caretPosition);
            console.log("test///caretPositionCleanEn on click: " + Number(caretPositionCleanEN));
            lastEng = "";
        }
    }

    function getNewCaretPosition(event) {
        //checking new and old caret position to avoid bugs with double letters in the middle of a word
        caretPosition = getCaretPosition();
        console.log("test///caretPosition on click: " + caretPosition);
        console.log("test///caretPositionCleanEn on click: " + Number(caretPositionCleanEN));
        if (caretPositionCleanEN != (Number(caretPosition) + 1)) {
            console.log("new position");
            lastEng = "";
        }
    }

    function newTextFromKeyboard(event) {
        //typing using virtual keyboard
        var t = event.target;
        addOnCaretPosition(translit, t.innerHTML);
    }

    function languageChange() {
        //changing keyboard by selecting another language
        letters.innerHTML = '';
        switch (langSelect.value) {
            case 'rus':
                printKeys(abcs.rus, letters);
                language = abcs.rus;
                break;
            case 'heb':
                printKeys(abcs.heb, letters);
                language = abcs.heb;
                break;
            case 'gre':
                printKeys(abcs.gre, letters);
                language = abcs.gre;
                break;
        }
        if (language == abcs.heb) {
            translit.style.direction = 'rtl';
        } else {
            translit.style.direction = 'ltr';
        }
        //adding event to keys when the languages changes
        var translittedLetters = document.querySelectorAll(".letters .letter div~div");
        for (var i = 0; i < translittedLetters.length; i++) {
            translittedLetters[i].addEventListener("click", newTextFromKeyboard);
        }
    }

    function addOnCaretPosition(inputElem, addedText) {
        // adding new character to on caret position
        if (addedText != undefined) {
            caretPosition = getCaretPosition();
            console.log("caretPosition(addOn): " + caretPosition);
            nextPosition = caretPosition + 1;
            console.log("nextPosition(addOn): " + nextPosition);

            var half_one = inputElem.value.substr(0, caretPosition);
            var half_two = inputElem.value.substr(caretPosition);
            inputElem.value = half_one + addedText + half_two;
            setCaretToPos(translit, nextPosition);
            var lastTwo = inputElem.value.substring(0, nextPosition);
        }
    }

    function transform(event) {
        // transliterating the pressed key - based on the last two pressed keys and caret position - contains an enormous "if"...
        //***** it doesn't work if CapsLock is pressed *****//
        secondLastEng = lastEng;
        console.log("secondLastEng: " + secondLastEng);
        lastEng = event.key;
        console.log("lastEng: " + lastEng);
        lastTwoEng = secondLastEng + lastEng;
        console.log("lastTwoEng: " + lastTwoEng);

        var pressedKey = lastTwoEng;
        console.log("pressedKey: " + pressedKey);

        var translitted = getKeyByValue(language, pressedKey);
        console.log("translitted: " + translitted);

        if (translitted === undefined) {
            console.log("translitted is undefined");
            if (event.shiftKey) {
                pressedKey = pressedKey.toLowerCase();
                translitted = getKeyByValue(language, pressedKey);
                console.log("translitted_1: " + translitted);
                if (translitted === undefined) {
                    pressedKey = event.key;
                    translitted = getKeyByValue(language, pressedKey);
                    console.log("translitted_2: " + translitted);
                    if (translitted === undefined) {
                        // "S" // "SS" // "sS" // "SH" //
                        pressedKey = pressedKey.toLowerCase();
                        translitted = getKeyByValue(language, pressedKey);
                        if (translitted === undefined) {
                            // """ = "Ь" //
                            pressedKey = "'";
                            translitted = getKeyByValue(language, pressedKey);
                            translitted = translitted.toUpperCase();
                            console.log("translitted_3: " + translitted);
                        } else {
                            translitted = translitted.toUpperCase();
                            console.log("translitted_4: " + translitted);
                        }
                    }
                } else {
                    // "sH" //
                    translitted = getKeyByValue(language, pressedKey);
                    translitted = translitted.toUpperCase();
                    console.log("translitted_5: " + translitted);
                }
            } else {
                if (secondLastEng == secondLastEng.toUpperCase()) {
                    pressedKey = pressedKey.toLowerCase();
                    translitted = getKeyByValue(language, pressedKey);
                    if (translitted === undefined) {
                        // "tt" //
                        pressedKey = event.key;
                        translitted = getKeyByValue(language, pressedKey);
                        console.log("translitted_6: " + translitted);
                    } else {
                        // "Sh" //
                        translitted = translitted.toUpperCase();
                        console.log("translitted_7: " + translitted);
                    }
                } else {
                    // "tt" //
                    pressedKey = event.key;
                    translitted = getKeyByValue(language, pressedKey);
                    console.log("translitted_8: " + translitted);
                }
            }
        }
        // "t" // "sh" //
        console.log("translitted_F: " + translitted);
        var keys = Object.keys(language);
        for (var key in language) {
            if (language[key].length > 1 && pressedKey.length > 1 && pressedKey == language[key]) {
                doubleValueFlag = true;
                console.log("you've used double trans: " + language[key]);
            }
        }
        //console.log("translitted_F_double: " + keys);
        addOnCaretPosition(translit, translitted);
    }
    // cleans EN letters and odd rus letters if it was double value
    function cleanEn(event) {
        if (event.keyCode >= 65 && event.keyCode <= 90 && !event.ctrlKey || event.keyCode == 222) {
            caretPositionCleanEN = getCaretPosition() - 1;
            //console.log("caretPosition cleanEN: " + caretPosition);
            var reg = /[a-zA-Z]/g;
            if (translit.value.search(reg) != -1) {
                translit.value = translit.value.replace(reg, '');
            } else if (translit.value.search("'") != -1) {
                translit.value = translit.value.replace("'", '');
            } else if (translit.value.search('"') != -1) {
                translit.value = translit.value.replace('"', '');
            }
            if (doubleValueFlag) {
                console.log("caretPosition cleanEN: " + caretPosition);
                var border = caretPositionCleanEN - 1;
                var half_one = translit.value.substring(0, border - 1);
                var half_two = translit.value.substring(border);
                translit.value = half_one + half_two;
                console.log("clean_halfOne: " + half_one);
                console.log("clean_halfTwo: " + half_two);
                doubleValueFlag = false;
                setCaretToPos(translit, border);
            } else {
                setCaretToPos(translit, caretPositionCleanEN);
            }
        } else {
            console.log("smth wrong");
            console.log(event.keyCode);
        }
    }

    function getKeyByValue(object, value) {
        // to find a key-value pair in language object
        return Object.keys(object).find(key => object[key] === value);
    }

    function getCaretPosition() {
        // getting current caret position
        var cursorPos = null;
        if (document.selection) {
            var range = document.selection.createRange();
            range.moveStart('textedit', -1);
            cursorPos = range.text.length;
        } else {
            cursorPos = translit.selectionStart;
        }
        return cursorPos;
    }

    function setCaretToPos(input, pos) {
        // setting next position for caret
        setSelectionRange(input, pos, pos);
    }

    function setSelectionRange(input, selectionStart, selectionEnd) {
        // auxiliary function for setting caret position
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(selectionStart, selectionEnd);
        } else if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();
        }
    }
}
