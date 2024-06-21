document.addEventListener("DOMContentLoaded", function() {
  
  const editor = document.getElementById('editor');

  // Charger le texte traduit depuis le sessionStorage
  const translatedText = sessionStorage.getItem('translatedText');

  editor.innerHTML = translatedText;

//   // Bouton retour à la page inde.html 
//   const backBtn = document.getElementById('backBtn');
//   backBtn.addEventListener('click', function() {
//       history.back(); // Revenir à la page précédente
//   });

  // Surligner les mots mal traduits en fonction du déplacement du curseur
  const cursorSlider = document.getElementById('cursorSlider');
  cursorSlider.addEventListener('input', function(event) {
      // Récupérer la valeur actuelle du curseur
      const cursorValue = parseInt(event.target.value);

      // Diviser le texte traduit en mots
      const words = getWords(translatedText); // Fonction pour diviser le texte en mots

      // Calculer l'indice du mot à surligner en fonction de la valeur du curseur
      const wordIndex = Math.floor(cursorValue / 100 * words.length);

      // Récupérer le mot à l'index calculé : 
      const word = words[wordIndex];

      // Vérifier si le mot existe
      if (word) {
          const color = getColorForIndex(wordIndex); // Obtenir une couleur en fonction de l'indice du mot
          highlightWord(editor, word, color); // Surligner le mot
      }
  });

  

  

  

  


   

});
document.addEventListener("DOMContentLoaded", function() {

  
    // Déclaration de la variable globale pour stocker la langue courante du texte
    let currentLanguage = ''; 

    // Variable globale pour stocker le texte traduit
    let translatedText = ''; 

    // Les boutons de la page
    const uploadBtn = document.getElementById('uploadBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const translateBtn = document.getElementById('translateBtn');

    // Récupération du texte écrit ou du fichier déposé.
    const textInput = document.getElementById('textInput');
    const fileInput = document.getElementById('fileInput');

    // Initialisation des Selectors de langage.
    const sourceLanguageSelect = document.getElementById('sourceLanguageSelect');
    const targetLanguageSelect = document.getElementById('targetLanguageSelect');
    
    // Le curseur de la page
    const cursorSlider = document.getElementById('cursorSlider');

    // Add an event listener to the cursor slider for tracking its position
    cursorSlider.addEventListener('input', function(event) {
        const cursorPos = parseInt(cursorSlider.value); // Récupérer la position du curseur depuis la valeur du curseur
        
        if (cursorPos > 10) {
            // Diviser le texte traduit en mots
            const words = getWords(translatedText); // Fonction pour diviser le texte en mots

            // Calculer l'indice du mot à surligner en fonction de la valeur du curseur
            const wordIndex = Math.floor(cursorPos / 100 * words.length);

            // Récupérer le mot à l'index calculé
            const word = words[wordIndex];

            // Vérifier si le mot existe
            if (word) {
                const color = getColorForIndex(wordIndex); // Obtenir une couleur en fonction de l'indice du mot
                highlightWord(editor, word, color); // Surligner le mot
            }
        }
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

    // // Récupérer la position du curseur depuis la valeur du curseur
    // function getCustomCursorPosition() {
    //     return parseInt(cursorSlider.value); 
    // }
    
    // Fonction pour gérer la traduction en fonction de la position du curseur
    function translateTextBasedOnCursor(text, cursorPos, sourceLanguage, targetLanguage) {
        //let translatedText;
        //if (cursorPos === 0) {
            // Si le curseur est à la position 0, le texte doit rester dans la langue source
            // Si le texte est déjà dans la langue source on ne fait rien
        //    if(currentLanguage === sourceLanguage){
                //translatedText = text;
                // return ;
            //}
            // Sinon on traduit de la langue cible à la langue source
        //    else{
                //translateText(text, targetLanguage, sourceLanguage);
                // return;
        //    }
        //} else if (cursorPos >= 5 & currentLanguage === sourceLanguage) {
            // Si le curseur est à la position 5 et qu'il n'a pas encore été traduit, le texte est entièrement traduit dans la langue cible
            //translateText(text, sourceLanguage, targetLanguage);
            // return; // Arrêter l'exécution de la fonction après la traduction complète
        //} 
        // else {
        //     // Si le curseur n'est ni à la position 0 ni à la position 5, effectuer une traduction partielle
        //     const textToTranslate = text.substring(cursorPos); // Texte à traduire à partir de la position du curseur
        //     translateText(textToTranslate, sourceLanguage, targetLanguage); // Traduire la partie de texte
        //     return; // Arrêter l'exécution de la fonction après la traduction partielle
        // }
        // Mettre à jour le champ de texte avec le texte traduit ou dans la langue source
        updateTextArea(textInput, cursorPos, translatedText)

    }


    // Activation du bouton de traduction lorsqu'on clique dessus.
    translateBtn.addEventListener('click', function() {
        const textToTranslate = textInput.value.trim(); // Récupération du texte à traduire.
        const sourceLanguage = sourceLanguageSelect.value; // Récupération de la langue source. 
        const targetLanguage = targetLanguageSelect.value; // Récupération de la langue target
        if (!textToTranslate) return; // Gestion du cas où il n y a pas de texte à traduire.
        sessionStorage.setItem('originalText', textToTranslate); // Enregistrement du texte original.
        translateText(textToTranslate, sourceLanguage, targetLanguage); // Appel de la fonction de traduction.
        sourceLanguageSelect.value = targetLanguage;
        targetLanguageSelect.value = sourceLanguage;      
    });


    // Charger le contenu d'un fichier texte séléctionné par l'utilisateur
    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0]; // Récupérer le fichier sélectionné
        const reader = new FileReader(); // Créer un nouvel objet FileReader
        // Lorsque la lecture du fichier est terminée
        reader.onload = function(event) {
            textInput.value = event.target.result; // Mettre à jour la valeur de l'élément textInput avec le contenu du fichier lu
            textInput.setAttribute("placeholder", "Translation"); // Définir un attribut placeholder pour l'élément textInput
        };
        reader.readAsText(file);
    });

    // Bouton pour déposer le contenu d'un fichier texte.
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });

    // Bouton pour télécharger le texte/ 
    downloadBtn.addEventListener('click', function() {
        const text = textInput.value;
        const targetLanguage = targetLanguageSelect.value;

        if (text.trim() === "") {
            return;
        }
        const filename = 'translation_'   // Bouton retour à la page inde.html 
        //   const backBtn = document.getElementById('backBtn');
        //   backBtn.addEventListener('click', function() {
        //       history.back(); // Revenir à la page précédente
        //   });
        + targetLanguage + '.txt';
        const blob = new Blob([text], {type: 'text/plain'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    });


    // Add an event listener for tracking cursor position
    textInput.addEventListener('input', () => {
        const cursorPos = textInput.selectionStart;
        translateTextPart(textInput.value.substring(Math.max(0, cursorPos - 100), cursorPos), cursorPos);
    });

    function translateTextPart(text, cursorPos) {
        // Ensure the user has selected a source and target language
        if (!sourceLanguageSelect.value || !targetLanguageSelect.value) { return; }
        
        // Call the delay function to avoid hitting the MyMemory API rate limit
        delay(function () {
            const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLanguageSelect.value}|${targetLanguageSelect.value}`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                  if (data && data.responseData && data.responseData.translatedText) {
                    const translatedText = data.responseData.translatedText;
                    updateTextArea(textInput, cursorPos, translatedText);
                  }
            })
            .catch(error => {
              console.error('Error translating text:', error);
            });
        }, 1000);

    }

    // // Function to update the textarea with translated text at the cursor position
    // Fonction pour mettre à jour le champ de texte avec le texte traduit ou dans la langue source
    function updateTextArea(textArea, cursorPos, translatedText) {
        const textBeforeCursor = textArea.value.substring(0, cursorPos);
        const textAfterCursor = text;
        // Vous devez définir le comportement approprié pour mettre à jour le champ de texte
        // Par exemple :
        textArea.value = translatedText; // Remplacer le contenu du champ de texte par le texte traduit
    }
    // Fonction qui traduit le texte. 
    function translateText(text, sourceLanguage, targetLanguage) {
        // Ensure the user has selected a source and target language
        // if (!sourceLanguageSelect.value || !targetLanguageSelect.value) { return; }
        
        // Call the delay function to avoid hitting the MyMemory API rate limit
        //delay(function () {
            const apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${sourceLanguage}|${targetLanguage}`;
            fetch(apiUrl)
            // fetch("https://libretranslate.com/translate", {
            //     method: "POST",
            //     body: JSON.stringify({
            //         q: text,
            //         source: sourceLanguage,
            //         target: targetLanguage,
            //         format: "text"
            //     }),
            //     headers: {
            //         "Content-Type": "application/json"
            //     }
            // })
                .then(response => response.json())
                .then(data => {
                    if (data && data.responseData && data.responseData.translatedText) {
                        // Récuperer le texte traduit : 
                        const translatedText = data.responseData.translatedText; 
                        textInput.value = translatedText; 
                        // sourceLanguageSelect.value = targetLanguage;
                        // targetLanguageSelect.value = sourceLanguage;
                        
                        // Stocker le texte traduit dans la session storage
                        sessionStorage.setItem('translatedText', translatedText);
                    } else {
                        textInput.value = "Translation not available";
                    }
                    textInput.setAttribute("placeholder", "Translation");
                })
                .catch(error => {
                    console.error('Error translating text:', error);
                    textInput.value = "Error translating text";
                    textInput.setAttribute("placeholder", "Translation");
                });
        //}, 1000);
    }





    // Fonction pour diviser le texte en mots
    function getWords(text) {
        return text.match(/\b\w+\b/g) || [];
    }

    // Fonction pour obtenir une couleur en fonction de l'indice du mot
    function getColorForIndex(index) {
        const colors = ['#FFFF00', '#FFA500', '#FFC0CB']; // Jaune, orange, rose
        return colors[index % colors.length]; // Utiliser modulo pour répéter les couleurs si nécessaire
    }

    // Fonction pour surligner un mot dans le texte
    function highlightWord(editor, word, color) {
        const regex = new RegExp('\\b' + word + '\\b', 'gi');
        const html = editor.innerHTML;
        const highlightedHtml = html.replace(regex, `<span style="background-color: ${color}; cursor: pointer;" class="highlighted-word">${word}</span>`);
        editor.innerHTML = highlightedHtml;
    }

    // Fonction pour obtenir la phrase du texte original contenant le mot spécifié
    function getSentenceContainingWord(originalText, word) {
        const sentences = originalText.split('.'); // Séparer le texte en phrases
        const sentences_trans = translatedText.split('.')
        console.log("sentences \n", sentences);
        let cpt = 0 
        for (let i = 0; i < sentences.length; i++) {
            if (sentences_trans[i].toLowerCase().includes(word.toLowerCase())) {
                cpt += 1
                return sentences[i].trim(); // Retourner la phrase contenant le mot
            }
        }
        return null; // Retourner null si aucune phrase ne contient le mot
    }

    // Fonction pour afficher la phrase du texte original contenant le mot surligné
    editor.addEventListener('click', function(event) {

        // Récupération de l'élément sur lequel l'utilisateur a cliqué
        const clickedElement = event.target;

        // Vérifier si l'élément cliqué est surligné 
        if (clickedElement.classList.contains('highlighted-word')) {
            // Récupération du mot à partir du texte de l'élément cliqué
            const word = clickedElement.textContent;
            // Récupération du texte original depuis le sessionStorage
            const originalText = sessionStorage.getItem('originalText'); 

            // Vérification que le mot n'est pas vide et que le texte original existe : 
            if (word !== "" && originalText) {

                // Obtenir la phrase du texte original contenant le mot
                const sentence = getSentenceContainingWord(originalText, word);

                if (sentence) {

                // Créer la fenêtre pour afficher la phrase
                    const windowElement = document.createElement('div');
                    windowElement.classList.add('original-sentence-window');
                    windowElement.textContent = `"${sentence}"`;

                    // Positionner la fenêtre juste en dessous du mot surligné
                    const rect = clickedElement.getBoundingClientRect();
                    windowElement.style.top = rect.bottom + 'px';
                    windowElement.style.left = rect.left + 'px';

                    // Ajouter la fenêtre au DOM, en tant que frère de l'éditeur
                    editor.parentNode.appendChild(windowElement);
                    
                    // Écouter les événements pour masquer la fenêtre lorsque vous cliquez en dehors de celle-ci
                    document.addEventListener('click', function hideWindow(event) {
                        if (!windowElement.contains(event.target) && event.target !== clickedElement) {
                            // Supprimer la fenêtre du DOM
                            windowElement.parentNode.removeChild(windowElement);
                            // Arrêter d'écouter les clics une fois que la fenêtre est masquée
                            document.removeEventListener('click', hideWindow); 
                        }
                    });
                }
            }
        }
    });


   





});