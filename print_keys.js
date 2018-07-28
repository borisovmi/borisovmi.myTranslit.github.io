function printKeys(langArray, letters, newTextFromKeyboard) {
    var keys = Object.keys(langArray);
    for (var i = 0; i < keys.length; i++) {
        var newLetterDiv = document.createElement("div");
        newLetterDiv.classList.add("letter");
        letters.appendChild(newLetterDiv);
        
        var newLetterEng = document.createElement("div");
        newLetterEng.classList.add("eng");
        newLetterEng.innerHTML = langArray[keys[i]];
        newLetterDiv.appendChild(newLetterEng);
        
        var line = document.createElement("hr");
        newLetterDiv.appendChild(line);
        var newLetterNotEng = document.createElement("div");
        
        newLetterNotEng.classList.add("notEng");
        newLetterNotEng.innerHTML = keys[i];
        newLetterDiv.appendChild(newLetterNotEng);
    }
    
    var translittedLetters = document.querySelectorAll(".letters .letter div~div");
    
    for (var i = 0; i < translittedLetters.length; i++) {
        translittedLetters[i].addEventListener("click", newTextFromKeyboard);
    }
}