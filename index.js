window.onload = main;
function main() {
    const buttonGenerateRandomRecipe = document.getElementById("button-generate-random-recipe");
    buttonGenerateRandomRecipe.onclick = requestRandomRecipeFromAPI;
}

function requestRandomRecipeFromAPI() {
    const url = "https://www.themealdb.com/api/json/v1/1/random.php";
    fetch(url)
    .then(response => {
        if (!response.ok) throw new Error("We have a 404 or similar error.");

        const typeOfHeaders = response.headers.get("content-type");
        if (typeOfHeaders !== "application/json") throw new TypeError(`Expected JSON, got ${typeOfHeaders}`);
    
        return response.json()})
    .then(randomRecipe => parseRandomRecipeData(randomRecipe))
    .catch(error => {
        if (error.name === "NetworkError") {
            displayErrorMessage("Check your internet connection.");
        } else if (error instanceof TypeError) {
            displayErrorMessage("Something is wrong with the server.");
        } else {
            console.error(error);
        }
    })
}

function displayErrorMessage(errorMessage) {
    const errorMessageContainer = document.getElementById("error-message-container");
    errorMessageContainer.innerHTML = errorMessage;
}

function parseRandomRecipeData(randomRecipe) {
    const randomRecipeObjectExtractedFromAPIDataStructure = randomRecipe.meals[0];
    console.log(randomRecipeObjectExtractedFromAPIDataStructure);
    const randomRecipeKeys = Object.keys(randomRecipeObjectExtractedFromAPIDataStructure);
    const matchImageKey = /strMealThumb/gi;
    const matchCategoryKey = /strCategory/gi;
    const matchCountryKey = /strArea/gi;
    const matchIngredientsKeys = /strIngredient/gi;
    const matchMeasuresKeys = /strMeasure/gi;
    const matchInstructionsKey = /strInstructions/gi;
    const matchVideoKey = /strYoutube/gi;

    let imageURL = "";
    let category = "";
    let country = "";
    let ingredients = [];
    let measures = [];
    let title = "";
    let instructions = "";
    let videoURL = "";

    randomRecipeKeys.forEach(randomRecipeKey => {
        if (randomRecipeKey.match(matchImageKey)) {
            imageURL = randomRecipeObjectExtractedFromAPIDataStructure[randomRecipeKey]; 
        }
        if (randomRecipeKey.match(matchCategoryKey)) {
            category = randomRecipeObjectExtractedFromAPIDataStructure[randomRecipeKey]; 
        }
        if (randomRecipeKey.match(matchCountryKey)) {
            country = randomRecipeObjectExtractedFromAPIDataStructure[randomRecipeKey]; 
        }
        if (randomRecipeKey.match(matchIngredientsKeys) && randomRecipeObjectExtractedFromAPIDataStructure[randomRecipeKey]) {
            ingredients.push(randomRecipeObjectExtractedFromAPIDataStructure[randomRecipeKey]);
        }
        //the extra checks are needed because the API data comes with strings that contain one space character
        if (randomRecipeKey.match(matchMeasuresKeys) && randomRecipeObjectExtractedFromAPIDataStructure[randomRecipeKey] !== " " && randomRecipeObjectExtractedFromAPIDataStructure[randomRecipeKey]) {
            measures.push(randomRecipeObjectExtractedFromAPIDataStructure[randomRecipeKey]);
        }
        if (randomRecipeKey === "strMeal") {
            title = randomRecipeObjectExtractedFromAPIDataStructure[randomRecipeKey]; 
        }
        if (randomRecipeKey.match(matchInstructionsKey)) {
            instructions = randomRecipeObjectExtractedFromAPIDataStructure[randomRecipeKey]; 
        }
        if (randomRecipeKey.match(matchVideoKey)) {
            videoURL = randomRecipeObjectExtractedFromAPIDataStructure[randomRecipeKey]; 
        }
    })
    displayImageElement(imageURL, title);
    displayHighlightsElements(category, country);
    displayIngredientsAndMeasures(ingredients, measures);
    displayTitle(title);
    displayCookingInstructions(instructions);
    convertWatchVideoURLToEmbedVideoURL(videoURL);
}

function displayImageElement(imageURL, title) {
    const imageElement = document.createElement("img");
    imageElement.setAttribute("alt", `this is a picture that represents the ${title} recipe`);
    imageElement.setAttribute("height", "300px");
    imageElement.setAttribute("width", "300px");
    imageElement.src = imageURL;

    const displayImageElement = document.getElementById("display-random-recipe-image-box");
    displayImageElement.innerHTML = imageElement.outerHTML;
}

function displayHighlightsElements(category, country) {
    const categoryElement = document.createElement("h4");
    categoryElement.innerHTML = `Category: ${category}`;

    const countryElement = document.createElement("h4");
    countryElement.innerHTML = `Country: ${country}`;

    const highlightsBox = document.getElementById("display-random-recipe-highlights-box");
    highlightsBox.innerHTML = categoryElement.outerHTML + countryElement.outerHTML;
}

function displayIngredientsAndMeasures(ingredients, measures) {
    const ingredientsHeaderElement = document.createElement("h3");
    ingredientsHeaderElement.innerHTML = "Ingredients:";

    const unorderedListElement = document.createElement("ul");
    ingredients.forEach((ingredient, index, ingredients) => {
        const listElement = document.createElement("li");
        listElement.innerHTML = `${ingredients[index]} - ${measures[index]}`;
        unorderedListElement.appendChild(listElement);
    })

    const displayRandomRecipeIngredientsAndMeasuresBox = document.getElementById("display-random-recipe-ingredients-and-measures-box");
    displayRandomRecipeIngredientsAndMeasuresBox.innerHTML = ingredientsHeaderElement.outerHTML + unorderedListElement.outerHTML;
}

function displayTitle(title) {
    const titleElement = document.createElement("h2");
    titleElement.innerHTML = title;

    const titleBox = document.getElementById("random-recipe-title-box");
    titleBox.innerHTML = titleElement.outerHTML;
}

function displayCookingInstructions(instructions) {
    const instructionsElement = document.createElement("p");
    instructionsElement.innerHTML = instructions;

    const instructionsBox = document.getElementById("display-random-recipe-instructions-box");
    instructionsBox.innerHTML = instructionsElement.outerHTML;
}

function convertWatchVideoURLToEmbedVideoURL(videoURL) {
    const embedVideoURL = videoURL.replace("watch?v=", "embed/");
    displayVideoURL(embedVideoURL);    
}

function displayVideoURL(embedVideoURL) {
    const iFrameElement = document.getElementById("video-player-iframe");
    iFrameElement.src = embedVideoURL;
}