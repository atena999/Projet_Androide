document.addEventListener("DOMContentLoaded", function() {
    // Déclaration de la variable globale pour stocker la langue courante du texte
    let currentLanguage = ''; 

    let valeurTexteSource = 0;
    let seuilTexteCible = 15;

    // Liste des mots
    let list_words = []

    // Les boutons de la page
    const uploadBtn = document.getElementById('uploadBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const translateBtn = document.getElementById('translateBtn');

    // Récupération du texte écrit ou du fichier déposé.
    const textInput = document.getElementById('editor');
    
    const fileInput = document.getElementById('fileInput');

    // Initialisation des Selectors de langage.
    const sourceLanguageSelect = document.getElementById('sourceLanguageSelect');
    const targetLanguageSelect = document.getElementById('targetLanguageSelect');

    // Le curseur de la page
    const cursorSlider = document.getElementById('cursorSlider');

    // Add an event listener to the cursor slider for tracking its position
    cursorSlider.addEventListener('input', function(event) {
        const cursorPos = parseInt(cursorSlider.value); // Récupérer la position du curseur depuis la valeur du curseur
        console.log(cursorPos);
        // Maintenant on va appeler la fonction pour traduire le texte en fonction de la position du curseur
        translateTextBasedOnCursor(textInput.textContent, cursorPos); 
    });

    // Ajout des labels par défaut dans les selectors de langue
    const defaultOptionSource = document.createElement('option');
    defaultOptionSource.textContent = "Langue source";
    sourceLanguageSelect.appendChild(defaultOptionSource);

    const defaultOptionTarget = document.createElement('option');
    defaultOptionTarget.textContent = "Langue cible";
    targetLanguageSelect.appendChild(defaultOptionTarget);

    // Ajout des langues disponibles dans les selectors. 
    for (let countryCode in countries) {
        let option = document.createElement('option');
        option.value = countryCode;
        option.textContent = countries[countryCode];
        sourceLanguageSelect.appendChild(option.cloneNode(true));
        targetLanguageSelect.appendChild(option);
    }


    // Modifiez la fonction translateTextBasedOnCursor pour récupérer le texte traduit à partir de sessionStorage
    function translateTextBasedOnCursor(text, cursorPos) {
        let translatedText = text;
        // Si le curseur est à la position 0, le texte doit rester dans la langue source
            // Si le texte est déjà dans la langue source on ne fait rien
            const textToTranslate = textInput.textContent.trim(); // Récupération du texte à traduire.
            const sourceLanguage = sourceLanguageSelect.value; // Récupération de la langue source. 
            const targetLanguage = targetLanguageSelect.value; // Récupération de la langue target

            if (!textToTranslate) return; // Gestion du cas où il n y a pas de texte à traduire.
            sessionStorage.setItem('originalText', textToTranslate); // Enregistrement du texte original.
            // sourceLanguageSelect.value = targetLanguage;
            // targetLanguageSelect.value = sourceLanguage; 

        console.log("cursorValue \n\n", cursorPos);
        console.log("sourceLanguage : ", sourceLanguage);
        console.log("targetLanguage : ", targetLanguage);
        console.log("currentLanguage : ", currentLanguage);

        if (cursorPos >= valeurTexteSource & cursorPos < seuilTexteCible) {
            console.log("vérification si texte en langue source \n");
            if(currentLanguage === targetLanguage){
                // console.log("sourceLanguage : ", sourceLanguage);
                // console.log("targetLanguage : ", targetLanguage);
                // console.log("currentLanguage : ", currentLanguage);
                
                console.log("\n\ntraduire en langue source \n");
                clearHighlights(textInput);
                
                translateText(text, targetLanguage, sourceLanguage);
            }
            return;
            
        }
        // Si le texte traduit existe, effectuer les actions de surlignage
        else if (cursorPos >= seuilTexteCible) {
                console.log("dépasser valeur seuil");
                // Vérifie si le texte a été traduit si oui, dans le cas de post-édition sinon on traduit
                if (currentLanguage === targetLanguage) {
                    // Si le texte traduit existe, effectuer les actions de surlignage

        

                    // Calculer la position du mot à surligner en fonction de la position du curseur
                    const words = getWords(translatedText); // Diviser le texte traduit en mots
                    console.log("words", words)

                    const wordIndex = Math.floor(cursorPos / 100 * words.length); // Calculer l'indice du mot

                    // Récupérer le mot à l'index calculé
                    const word = words[wordIndex];

                    // Vérifier si le mot existe
                    if (word) {
                        console.log("word", word)
                        const color = getColorForIndex(wordIndex); // Obtenir une couleur en fonction de l'indice du mot
                        console.log("color", color)
                        // Passer l'élément DOM textInput à la place de la chaîne de texte
                        highlightWord(textInput, word, color); // Surligner le mot
                    }
                    return ;
                }
                else {
                    translateText(text, sourceLanguage, targetLanguage);
                    // console.log("sourceLanguage : ", sourceLanguage);
                    // console.log("targetLanguage : ", targetLanguage);
                    // console.log("currentLanguage : ", currentLanguage);
                    console.log("traduction du texte dans la langue cible !")
                }
        }
    }

    // Modifiez la fonction highlightWord pour accepter un élément DOM au lieu d'une chaîne de texte
    function highlightWord(element, word, color) {
        console.log("element : ", element);
        const regex = new RegExp('\\b' + word + '\\b', 'gi');
        const html = element.value; // Utilisez .value pour obtenir le texte de l'élément input
        const highlightedHtml = html.replace(regex, `<span style="background-color: ${color}; cursor: pointer;" class="highlighted-word">${word}</span>`);
        element.value = highlightedHtml; // Utilisez .value pour définir le texte de l'élément input
    }



    // Activation du bouton de traduction lorsqu'on clique dessus.
    translateBtn.addEventListener('click', function() {
        const textToTranslate = textInput.textContent.trim(); // Récupération du texte à traduire.
        const sourceLanguage = sourceLanguageSelect.value; // Récupération de la langue source. 
        const targetLanguage = targetLanguageSelect.value; // Récupération de la langue target
        if (!textToTranslate) return; // Gestion du cas où il n y a pas de texte à traduire.
        sessionStorage.setItem('originalText', textToTranslate); // Enregistrement du texte original.
        translateText(textToTranslate, sourceLanguage, targetLanguage); // Appel de la fonction de traduction.
        sourceLanguageSelect.value = targetLanguage;
        targetLanguageSelect.value = sourceLanguage;      
    });

    // Fonction pour mettre à jour la liste des mots après chaque traduction réussie
    function updateWordList(translatedText) {
        // Diviser le texte traduit en mots
        list_words_trad = getWords(translatedText);
        // list_1 = [];
        // list_2 = [];
        // list_3 = [];
        // list_4 = [];


        // Attribuer à chaque mot une sévérité
        for (word in list_words_trad) {
            const severite = Math.random();

            // // Placer le mot dans la bonne liste en fonction de la sévérité
            // if (severite < 0.25){
            //     list_1.push(word, severite);
            // }
            // else if (severite>= 0.25 & severite < 0.5){
            //     list_2.push(word, severite);
            // }
            // else if (severite>= 0.5 & severite < 0.75){
            //     list_3.push(word, severite);
            // }
            // else if (severite>= 0.75){
            //     list_4.push(word, severite);
            // }
            list_words.push(word, severite);
        }

        list_words.sort((a, b) => b[1] - a[1]);
    }

    // Fonction pour traduire le texte. 
    function translateText(text, srcLanguage, tgetLanguage) {
        console.log("\nTRADUCTION\n\n");
        const apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${srcLanguage}|${tgetLanguage}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.responseData && data.responseData.translatedText) {
                    const translatedText = data.responseData.translatedText; 
                    textInput.textContent = translatedText; 
                    currentLanguage = tgetLanguage;
                    sessionStorage.setItem('translatedText', translatedText);

                    // Mettre à jour la liste des mots après chaque traduction réussie
                    updateWordList(translatedText);
                } else {
                    textInput.textContent = "Translation not available";
                }
                textInput.setAttribute("placeholder", "Translation");
            })
            .catch(error => {
                console.error('Error translating text:', error);
                textInput.value = "Error translating text";
                textInput.setAttribute("placeholder", "Translation");
        });
    }


    // Fonction pour diviser le texte en mots
    function getWords(text) {
        return text.split(/\s+/);
    }
    
    // Fonction pour obtenir une couleur en fonction de l'indice du mot
    function getColorForIndex(index) {
        const colors = ['#FFFF00', '#FFA500', '#FFC0CB']; // Jaune, orange, rose
        return colors[index % colors.length]; // Utiliser modulo pour répéter les couleurs si nécessaire
    }

    // Modifiez la fonction highlightWord pour accepter un élément DOM au lieu d'une chaîne de texte
    function highlightWord(editor, word, color) {
        const regex = new RegExp('\\b' + word + '\\b', 'gi');
        const html = editor.innerHTML;
        const highlightedHtml = html.replace(regex, `<span style="background-color: ${color}; cursor: pointer;" class="highlighted-word">${word}</span>`);
        editor.innerHTML = highlightedHtml;
    }

    function clearHighlights(editor) {
        const highlightedWords = editor.querySelectorAll('.highlighted-word');
        highlightedWords.forEach(word => {
            word.outerHTML = word.textContent; // Remplacer chaque mot surligné par son texte brut
        });
    }

    downloadBtn.addEventListener('click', function() {
        const text = textInput.value;
        const targetLanguage = targetLanguageSelect.value;

        if (text.trim() === "") {
            return;
        }
        const filename = 'translation_'
        + targetLanguage + '.txt';
        const blob = new Blob([text], {type: 'text/plain'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    });

    // Bouton pour déposer le contenu d'un fichier texte.
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });

});