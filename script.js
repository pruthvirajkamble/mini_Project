const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

const spoonacularApiKey = 'd7de66eae26449be8fcc6320812e027d';

// Event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// Get meal list that matches with the ingredients
function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${searchInputTxt}&number=5&apiKey=${spoonacularApiKey}`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data.results && data.results.length > 0) {
                data.results.forEach(meal => {
                    html += `
                        <div class="meal-item" data-id="${meal.id}">
                            <div class="meal-img">
                                <img src="${meal.image}" alt="food">
                            </div>
                            <div class="meal-name">
                                <h3>${meal.title}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                            </div>
                        </div>
                    `;
                });
                mealList.classList.remove('notFound');
            } else {
                html = "Sorry, we didn't find any meal!";
                mealList.classList.add('notFound');
            }

            mealList.innerHTML = html;
        });
}

// Get recipe of the meal
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        let mealId = mealItem.getAttribute('data-id');
        fetch(`https://api.spoonacular.com/recipes/${mealId}/information?includeNutrition=false&apiKey=${spoonacularApiKey}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data));
    }
}

// Create a modal
function mealRecipeModal(meal) {
    let html = `
        <h2 class="recipe-title">${meal.title}</h2>
        <p class="recipe-category">${meal.dishTypes.join(', ')}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.instructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.image}" alt="">
        </div>
        <div class="recipe-link">
            <a href="${meal.sourceUrl}" target="_blank">View Full Recipe</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}
