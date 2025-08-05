const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("dishInput");
const searchIngredientsForm = document.getElementById("searchingredients");
const ingredientInput = document.getElementById("ingredientInput");
const recipeContainer = document.getElementById("resultsContainer");
const recipeModal = document.querySelector(".recipe-modal");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");

const apiKey = "47335e3f804e4a2dacb82d4b633e5404"; // TEMP test key
 // Replace with your real Spoonacular key

// ------------------ Dish Search using TheMealDB ------------------
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (!searchTerm) return;

 // window.location.href = `search.html?dish=${encodeURIComponent(searchTerm)}`;//
 window.location.href = `/search.html?dish=${encodeURIComponent(searchTerm)}`;

});

// ------------------ Ingredient-Based Search (Spoonacular) ------------------
searchIngredientsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const ingredients = ingredientInput.value.trim();
  if (!ingredients) return;

 // window.location.href = `search.html?ingredients=${encodeURIComponent(ingredients)}`;//
 window.location.href = `/search.html?ingredients=${encodeURIComponent(ingredients)}`;

});

// ------------------ Load Recipes on search.html ------------------
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const dish = urlParams.get("dish");
  const ingredients = urlParams.get("ingredients");

  if (dish) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${dish}`)
      .then((res) => res.json())
      .then((data) => {
       // recipeContainer.innerHTML = "<h2>Search Results:</h2>";//
       document.getElementById("resultsTitle").textContent = "Search Results:";
recipeContainer.innerHTML = "";

        if (!data.meals) {
          recipeContainer.innerHTML += `<p>No results found</p>`;
          return;
        }

        data.meals.forEach((meal) => {
          const recipeDiv = document.createElement("div");
          recipeDiv.classList.add("recipe");
          recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <p><strong>Category:</strong> ${meal.strCategory}</p>
            <p><strong>Area:</strong> ${meal.strArea}</p>
            <a href="#" class="view-recipe-btn" data-id="${meal.idMeal}">View Recipe</a>
          `;
          recipeContainer.appendChild(recipeDiv);
        });
      });
  }

  if (ingredients) {
    fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${apiKey}`)
      .then((res) => res.json())
      .then((data) => {
       // recipeContainer.innerHTML = "<h2>Recipes based on ingredients:</h2>";//
       document.getElementById("resultsTitle").textContent = "Recipes based on ingredients:";
recipeContainer.innerHTML = "";

        if (!data || data.length === 0) {
          recipeContainer.innerHTML += `<p>No recipes found with those ingredients.</p>`;
          return;
        }

        data.forEach((recipe) => {
          const recipeDiv = document.createElement("div");
          recipeDiv.classList.add("recipe");
          recipeDiv.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p>Used ingredients: ${recipe.usedIngredientCount}, Missing: ${recipe.missedIngredientCount}</p>
          `;
          recipeContainer.appendChild(recipeDiv);
        });
      })
      .catch(() => {
        recipeContainer.innerHTML += `<p>Error fetching recipes.</p>`;
      });
  }
});

// ------------------ View Recipe (MealDB only) ------------------
recipeContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("view-recipe-btn")) {
    e.preventDefault();
    const mealId = e.target.dataset.id;

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      .then((res) => res.json())
      .then((data) => {
        const meal = data.meals[0];
        const ingredients = [];

        for (let i = 1; i <= 20; i++) {
          const ingredient = meal[`strIngredient${i}`];
          const measure = meal[`strMeasure${i}`];
          if (ingredient && ingredient.trim()) {
            ingredients.push(`${ingredient} - ${measure}`);
          }
        }

        recipeDetailsContent.innerHTML = `
          <span class="recipe-close-btn">&times;</span>
          <h2>${meal.strMeal}</h2>
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h3>Ingredients:</h3>
          <ul>${ingredients.map((ing) => `<li>${ing}</li>`).join("")}</ul>
          <h3>Instructions:</h3>
          <p>${meal.strInstructions}</p>
          ${
            meal.strYoutube
              ? `<a href="${meal.strYoutube}" class="youtube-btn" target="_blank">▶ Watch on YouTube
              </a>`
              : ""
          }
        `;
        recipeModal.style.display = "block";
      });
  }
});

// ------------------ Close Modal ------------------
document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("recipe-close-btn") ||
    e.target === recipeModal
  ) {
    recipeModal.style.display = "none";
  }
});
