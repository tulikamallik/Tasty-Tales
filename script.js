const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const closeBtn = document.querySelector('.recipe-close-btn');
const modal = document.querySelector('.recipe-modal');

// Fetch recipe data
const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";

  const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
  const response = await data.json();

  recipeContainer.innerHTML = "";

  if (!response.meals) {
    recipeContainer.innerHTML = "<h2>No recipes found. Try something else!</h2>";
    return;
  }

  response.meals.forEach(meal => {
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe');

    recipeDiv.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <h3>${meal.strMeal}</h3>
      <p><span>${meal.strArea}</span> Dish</p>
      <p>Belongs to <span>${meal.strCategory}</span> Category</p>
    `;

    const button = document.createElement('button');
    button.textContent = "View Recipe";
    button.addEventListener('click', () => openRecipePopup(meal));

    recipeDiv.appendChild(button);
    recipeContainer.appendChild(recipeDiv);
  });
};

// Generate ingredients list
const fetchIngredients = (meal) => {
  let ingredients = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      ingredients += `<li>${ingredient} - ${measure}</li>`;
    }
  }
  return ingredients;
};

// Show popup
const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul>${fetchIngredients(meal)}</ul>
    <h3>Instructions:</h3>
    <p>${meal.strInstructions}</p>
    <a href="${meal.strYoutube}" target="_blank">Watch on YouTube</a>
  `;
  modal.classList.add('show');
};

// Close popup
closeBtn.addEventListener('click', () => {
  modal.classList.remove('show');
});

// On search
searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const query = searchBox.value.trim();
  if (query) {
    fetchRecipes(query);
  } else {
    recipeContainer.innerHTML = "<h2>Please enter a search term.</h2>";
  }
});
